package org.example.toi.repository;

import java.util.List;
import org.example.toi.entity.InviteResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InviteResponseRepository extends JpaRepository<InviteResponse, Long> {
    List<InviteResponse> findAllByInviteIdAndIsDeletedFalse(java.util.UUID inviteId);

    void deleteAllByInviteId(java.util.UUID inviteId);

    long countByInviteIdAndAttendingTrueAndIsDeletedFalse(java.util.UUID inviteId);

    @Query("select coalesce(sum(r.guestsCount), 0) from InviteResponse r where r.invite.id = :inviteId and r.attending = true and r.isDeleted = false")
    long sumAttendingGuests(java.util.UUID inviteId);
}
