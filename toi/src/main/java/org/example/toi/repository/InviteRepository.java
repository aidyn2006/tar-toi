package org.example.toi.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.example.toi.entity.Invite;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InviteRepository extends JpaRepository<Invite, UUID> {

    @EntityGraph(attributePaths = {"owner"})
    List<Invite> findAllByOwnerIdAndIsDeletedFalse(Long ownerId);

    @EntityGraph(attributePaths = {"owner"})
    Optional<Invite> findByIdAndIsDeletedFalse(UUID id);

    @EntityGraph(attributePaths = {"owner"})
    Optional<Invite> findBySlugAndIsDeletedFalse(String slug);
    @EntityGraph(attributePaths = {"owner"})
    List<Invite> findAllByIsDeletedFalse();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from Invite i where i.id = :id and i.isDeleted = false")
    Optional<Invite> findWithLockingById(@Param("id") UUID id);
}
