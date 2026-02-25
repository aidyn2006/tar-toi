package org.example.toi.invite.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InviteResponseRepository extends JpaRepository<InviteResponseEntity, Long> {
    List<InviteResponseEntity> findByInviteIdOrderByCreatedAtDesc(String inviteId);
}
