package org.example.toi.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "invite_responses", indexes = {
    @Index(name = "idx_responses_invite", columnList = "invite_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InviteResponse extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invite_id", nullable = false)
    private Invite invite;

    @Column(name = "guest_name", nullable = false, length = 100)
    private String guestName;

    @Column(name = "guests_count", nullable = false)
    private int guestsCount;

    @Column(nullable = false)
    private boolean attending;
}
