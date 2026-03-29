package org.example.toi.repository;

import java.util.List;
import java.util.Map;
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

    /**
     * Fallback: читает старые колонки (до рефакторинга на payload).
     * Используется в сервисе если payload пустой.
     */
    @Query(value = """
            SELECT
                title, description, template,
                TO_CHAR(event_date, 'YYYY-MM-DD"T"HH24:MI:SS') AS event_date,
                location_name, location_url,
                max_guests, music_key, music_source, music_title, music_url,
                preview_photo_url, toi_owners, topic1, topic2
            FROM invites WHERE id = :id
            """, nativeQuery = true)
    Optional<Map<String, Object>> findLegacyColumnsById(@Param("id") UUID id);
}
