package org.example.toi.invite.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "invite_responses")
@Getter
@Setter
public class InviteResponseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invite_id", nullable = false)
    private InviteEntity invite;

    @Column(name = "guest_name", nullable = false, length = 120)
    private String guestName;

    @Column(name = "phone", nullable = false, length = 30)
    private String phone;

    @Column(name = "guests_count", nullable = false)
    private Integer guestsCount;

    @Column(name = "status", nullable = false, length = 12)
    private String status;

    @Column(name = "note", length = 500)
    private String note;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
