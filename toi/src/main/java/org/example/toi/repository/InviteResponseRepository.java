package org.example.toi.repository;

import java.util.List;
import org.example.toi.entity.InviteResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InviteResponseRepository extends JpaRepository<InviteResponse, Long> {
    List<InviteResponse> findAllByInviteId(java.util.UUID inviteId);
}
