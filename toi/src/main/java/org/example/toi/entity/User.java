package org.example.toi.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_users", uniqueConstraints = {
    @UniqueConstraint(name = "uk_users_phone", columnNames = "phone")
})
@org.hibernate.annotations.SQLRestriction("is_deleted = false")
@org.hibernate.annotations.SQLDelete(sql = "UPDATE app_users SET is_deleted = true WHERE id = ?")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "facebook_id", unique = true, length = 100)
    private String facebookId;

    @Column(name = "threads_id", unique = true, length = 100)
    private String threadsId;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private boolean approved = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;
}
