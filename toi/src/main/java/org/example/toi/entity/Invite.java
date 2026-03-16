package org.example.toi.entity;

import jakarta.persistence.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.*;
import org.example.toi.entity.base.BaseEntity;
import org.example.toi.entity.enums.MusicSource;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "invites", indexes = {
    @Index(name = "idx_invites_owner", columnList = "owner_id"),
    @Index(name = "idx_invites_slug", columnList = "slug", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invite extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(unique = true, length = 80)
    private String slug;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", columnDefinition = "jsonb", nullable = false)
    @Builder.Default
    private Map<String, Object> payload = new HashMap<>();

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = false;
}
