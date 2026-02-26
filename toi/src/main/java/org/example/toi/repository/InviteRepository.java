package org.example.toi.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.example.toi.entity.Invite;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InviteRepository extends JpaRepository<Invite, UUID> {
    
    @EntityGraph(attributePaths = {"owner"})
    List<Invite> findAllByOwnerId(Long ownerId);

    @EntityGraph(attributePaths = {"owner"})
    Optional<Invite> findById(UUID id);
}
