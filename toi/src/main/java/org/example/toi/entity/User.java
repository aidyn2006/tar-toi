package org.example.toi.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_users", uniqueConstraints = {
    @UniqueConstraint(name = "uk_users_phone", columnNames = "phone"),
    @UniqueConstraint(name = "uk_users_threads_id", columnNames = "threads_id")
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

    @Column(nullable = true, length = 20)
    private String phone;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "password_hash", nullable = true)
    private String passwordHash;

    @Column(name = "threads_id", nullable = true, length = 50)
    private String threadsId;

    @Column(nullable = false)
    private boolean approved = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;
}

