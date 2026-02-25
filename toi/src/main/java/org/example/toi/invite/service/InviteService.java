package org.example.toi.invite.service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.UUID;
import org.example.toi.invite.dto.InviteResponseItem;
import org.example.toi.invite.dto.InviteStatsResponse;
import org.example.toi.invite.dto.InviteUpsertRequest;
import org.example.toi.invite.dto.InviteView;
import org.example.toi.invite.dto.PublicInviteView;
import org.example.toi.invite.dto.PublicRsvpRequest;
import org.example.toi.invite.persistence.InviteEntity;
import org.example.toi.invite.persistence.InviteRepository;
import org.example.toi.invite.persistence.InviteResponseEntity;
import org.example.toi.invite.persistence.InviteResponseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InviteService {
    private final InviteRepository inviteRepository;
    private final InviteResponseRepository inviteResponseRepository;

    public InviteService(InviteRepository inviteRepository, InviteResponseRepository inviteResponseRepository) {
        this.inviteRepository = inviteRepository;
        this.inviteResponseRepository = inviteResponseRepository;
    }

    @Transactional
    public InviteView upsertInvite(String ownerUsername, InviteUpsertRequest request) {
        String normalizedOwner = normalizeUsername(ownerUsername);
        String requestId = safeTrim(request.id());

        InviteEntity entity;
        Instant now = Instant.now();

        if (requestId != null) {
            entity = inviteRepository.findByIdAndOwnerUsernameNormalized(requestId, normalizedOwner)
                    .orElseThrow(() -> new NoSuchElementException("Шақырту табылмады"));
        } else {
            entity = new InviteEntity();
            entity.setId(makeInviteId());
            entity.setOwnerUsername(ownerUsername);
            entity.setOwnerUsernameNormalized(normalizedOwner);
            entity.setCreatedAt(now);
        }

        entity.setCategoryKey(safeTrim(request.categoryKey()));
        entity.setCategoryLabel(safeTrim(request.categoryLabel()));
        entity.setTitle(safeTrim(request.title()));
        entity.setDescription(safeTrim(request.description()));
        entity.setEventDate(request.date());
        entity.setEventTime(safeTrim(request.time()));
        entity.setPlace(safeTrim(request.place()));
        entity.setSong(safeTrim(request.song()));
        entity.setMapLink(safeTrim(request.mapLink()));
        entity.setHosts(safeTrim(request.hosts()));
        entity.setMaxGuests(request.maxGuests() == null ? 3 : Math.max(1, Math.min(20, request.maxGuests())));
        entity.setPreviewPhoto(safeTrim(request.previewPhoto()));
        entity.setUpdatedAt(now);

        InviteEntity saved = inviteRepository.save(entity);
        return toInviteView(saved);
    }

    @Transactional(readOnly = true)
    public List<InviteView> getOwnerInvites(String ownerUsername) {
        String normalizedOwner = normalizeUsername(ownerUsername);
        return inviteRepository.findByOwnerUsernameNormalizedOrderByUpdatedAtDesc(normalizedOwner).stream()
                .map(this::toInviteView)
                .toList();
    }

    @Transactional(readOnly = true)
    public InviteView getOwnerInvite(String ownerUsername, String inviteId) {
        String normalizedOwner = normalizeUsername(ownerUsername);
        InviteEntity invite = inviteRepository.findByIdAndOwnerUsernameNormalized(inviteId, normalizedOwner)
                .orElseThrow(() -> new NoSuchElementException("Шақырту табылмады"));
        return toInviteView(invite);
    }

    @Transactional(readOnly = true)
    public PublicInviteView getPublicInvite(String inviteId) {
        InviteEntity invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new NoSuchElementException("Шақырту табылмады"));
        return toPublicInviteView(invite);
    }

    @Transactional
    public void addPublicResponse(String inviteId, PublicRsvpRequest request) {
        InviteEntity invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new NoSuchElementException("Шақырту табылмады"));

        int guests = request.guests() == null ? 1 : request.guests();
        guests = Math.max(1, Math.min(20, guests));
        int maxGuests = invite.getMaxGuests() == null ? 20 : invite.getMaxGuests();

        if (guests > maxGuests) {
            throw new IllegalArgumentException("Бұл шақыртуда бір жауапқа максимум " + maxGuests + " қонақ рұқсат");
        }

        InviteResponseEntity response = new InviteResponseEntity();
        response.setInvite(invite);
        response.setGuestName(safeTrim(request.name()));
        response.setPhone(normalizeKzPhone(request.phone()));
        response.setGuestsCount(guests);
        response.setStatus(safeTrim(request.status()));
        response.setNote(safeTrim(request.note()));
        response.setCreatedAt(Instant.now());

        inviteResponseRepository.save(response);
    }

    @Transactional(readOnly = true)
    public InviteStatsResponse getOwnerStats(String ownerUsername, String inviteId) {
        String normalizedOwner = normalizeUsername(ownerUsername);
        InviteEntity invite = inviteRepository.findByIdAndOwnerUsernameNormalized(inviteId, normalizedOwner)
                .orElseThrow(() -> new NoSuchElementException("Шақырту табылмады"));

        List<InviteResponseEntity> responses = inviteResponseRepository.findByInviteIdOrderByCreatedAtDesc(invite.getId());

        int yesCount = 0;
        int maybeCount = 0;
        int noCount = 0;
        int totalGuests = 0;

        for (InviteResponseEntity response : responses) {
            String status = response.getStatus();
            int guests = response.getGuestsCount() == null ? 1 : response.getGuestsCount();

            if (Objects.equals(status, "yes")) {
                yesCount += 1;
                totalGuests += guests;
            } else if (Objects.equals(status, "maybe")) {
                maybeCount += 1;
                totalGuests += guests;
            } else {
                noCount += 1;
            }
        }

        List<InviteResponseItem> items = responses.stream()
                .limit(50)
                .map(this::toResponseItem)
                .toList();

        return new InviteStatsResponse(invite.getId(), yesCount, maybeCount, noCount, totalGuests, items);
    }

    private InviteView toInviteView(InviteEntity entity) {
        return new InviteView(
                entity.getId(),
                entity.getCategoryKey(),
                entity.getCategoryLabel(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getEventDate(),
                entity.getEventTime(),
                entity.getPlace(),
                entity.getSong(),
                entity.getMapLink(),
                entity.getHosts(),
                entity.getMaxGuests(),
                entity.getPreviewPhoto(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    private PublicInviteView toPublicInviteView(InviteEntity entity) {
        return new PublicInviteView(
                entity.getId(),
                entity.getCategoryLabel(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getEventDate(),
                entity.getEventTime(),
                entity.getPlace(),
                entity.getMapLink(),
                entity.getHosts(),
                entity.getMaxGuests(),
                entity.getPreviewPhoto()
        );
    }

    private InviteResponseItem toResponseItem(InviteResponseEntity entity) {
        return new InviteResponseItem(
                entity.getGuestName(),
                entity.getPhone(),
                entity.getGuestsCount(),
                entity.getStatus(),
                entity.getNote(),
                entity.getCreatedAt()
        );
    }

    private String makeInviteId() {
        String base = UUID.randomUUID().toString().replace("-", "");
        return "inv_" + base.substring(0, 18);
    }

    private String normalizeUsername(String username) {
        return safeTrim(username).toLowerCase(Locale.ROOT);
    }

    private String safeTrim(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeKzPhone(String phone) {
        String trimmed = safeTrim(phone);
        if (trimmed == null) {
            return null;
        }
        String digits = trimmed.replaceAll("\\D", "");
        if (digits.isEmpty()) {
            return null;
        }
        if (digits.length() == 11 && digits.startsWith("8")) {
            return "7" + digits.substring(1);
        }
        if (digits.length() == 11 && digits.startsWith("7")) {
            return digits;
        }
        return digits;
    }
}
