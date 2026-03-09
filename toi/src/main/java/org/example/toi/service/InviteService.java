package org.example.toi.service;

import lombok.RequiredArgsConstructor;
import org.example.toi.dto.request.CreateInviteRequest;
import org.example.toi.dto.request.RespondInviteRequest;
import org.example.toi.dto.request.UpdateInviteRequest;
import org.example.toi.dto.response.GuestResponseDTO;
import org.example.toi.dto.response.InviteResponseDTO;
import org.example.toi.entity.Invite;
import org.example.toi.entity.InviteResponse;
import org.example.toi.entity.MusicSource;
import org.example.toi.entity.Role;
import org.example.toi.entity.User;
import org.example.toi.repository.InviteRepository;
import org.example.toi.repository.InviteResponseRepository;
import org.example.toi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InviteService {

    private final InviteRepository inviteRepository;
    private final InviteResponseRepository responseRepository;
    private final UserRepository userRepository;

    @Value("${uploads.dir:uploads}")
    private String uploadDir;

    @Transactional
    public InviteResponseDTO createInvite(CreateInviteRequest request) {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String slug = generateSlug(request.title());

        Invite invite = Invite.builder()
                .owner(owner)
                .title(request.title())
                .description(request.description())
                .maxGuests(request.maxGuests() != null ? request.maxGuests() : 0)
                .eventDate(request.eventDate())
                .previewPhotoUrl(request.previewPhotoUrl())
                .gallery(request.gallery() == null ? List.of() : request.gallery())
                .slug(slug)
                .topic1(request.topic1())
                .topic2(request.topic2())
                .locationName(request.locationName())
                .locationUrl(request.locationUrl())
                .toiOwners(request.toiOwners())
                .template(request.template())
                .build();

        applyMusicSelection(invite, request.musicSource(), request.musicKey(), request.musicUrl(), request.musicTitle());
        sanitizeMedia(invite);

        return mapToDTO(inviteRepository.save(invite));
    }

    @Transactional
    public List<InviteResponseDTO> getMyInvites() {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return inviteRepository.findAllByOwnerId(owner.getId()).stream()
                .map(this::sanitizeAndMaybePersist)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public List<InviteResponseDTO> getAllInvites() {
        return inviteRepository.findAll().stream()
                .map(this::sanitizeAndMaybePersist)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /** Public — no auth required. Fetches invite by its unique slug. */
    @Transactional
    public InviteResponseDTO getPublicInvite(String slug) {
        Invite invite = inviteRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Invite not found"));
        return mapToDTO(sanitizeAndMaybePersist(invite));
    }

    /** Owner-only update. */
    @Transactional
    public InviteResponseDTO updateInvite(UUID id, UpdateInviteRequest request) {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Invite invite = inviteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        if (!invite.getOwner().getId().equals(owner.getId()) && owner.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied");
        }

        if (request.title() != null) invite.setTitle(request.title());
        if (request.description() != null) invite.setDescription(request.description());
        if (request.eventDate() != null) invite.setEventDate(request.eventDate());
        if (request.previewPhotoUrl() != null) invite.setPreviewPhotoUrl(request.previewPhotoUrl());
        if (request.gallery() != null) invite.setGallery(request.gallery());
        if (request.topic1() != null) invite.setTopic1(request.topic1());
        if (request.topic2() != null) invite.setTopic2(request.topic2());
        if (request.locationName() != null) invite.setLocationName(request.locationName());
        if (request.locationUrl() != null) invite.setLocationUrl(request.locationUrl());
        if (request.toiOwners() != null) invite.setToiOwners(request.toiOwners());
        if (request.template() != null) invite.setTemplate(request.template());
        boolean hasMusicUpdate = request.musicUrl() != null || request.musicTitle() != null
                || request.musicKey() != null || request.musicSource() != null;
        if (hasMusicUpdate) {
            applyMusicSelection(invite, request.musicSource(), request.musicKey(), request.musicUrl(), request.musicTitle());
        }
        if (request.maxGuests() != null) invite.setMaxGuests(request.maxGuests());

        sanitizeMedia(invite);
        return mapToDTO(inviteRepository.save(invite));
    }

    /** Owner-only: returns all guest responses for a given invite (CRM table). */
    @Transactional(readOnly = true)
    public List<GuestResponseDTO> getResponses(UUID inviteId) {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        if (!invite.getOwner().getId().equals(owner.getId()) && owner.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied");
        }

        return responseRepository.findAllByInviteId(inviteId).stream()
                .map(r -> new GuestResponseDTO(
                        r.getId(),
                        r.getGuestName(),
                        r.getPhone(),
                        r.getGuestsCount(),
                        r.isAttending(),
                        r.getNote(),
                        r.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void respondToInvite(UUID inviteId, RespondInviteRequest request) {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        int guests = request.guestsCount() == null || request.guestsCount() < 1 ? 1 : request.guestsCount();
        boolean attending = request.attending() == null ? true : request.attending();

        // Validate against maxGuests limit
        if (attending && invite.getMaxGuests() > 0) {
            long currentAttending = responseRepository.findAllByInviteId(inviteId).stream()
                    .filter(InviteResponse::isAttending)
                    .mapToInt(InviteResponse::getGuestsCount)
                    .sum();
            if (currentAttending + guests > invite.getMaxGuests()) {
                throw new RuntimeException("Қонақтар лимиті толды. Максимум: " + invite.getMaxGuests());
            }
        }

        InviteResponse response = InviteResponse.builder()
                .invite(invite)
                .guestName(request.guestName())
                .phone(request.phone())
                .guestsCount(guests)
                .attending(attending)
                .note(request.note())
                .build();

        responseRepository.save(response);
    }

    /** Owner-only delete: removes guest responses then invite */
    @Transactional
    public void deleteInvite(UUID id) {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Invite invite = inviteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        if (!invite.getOwner().getId().equals(owner.getId()) && owner.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied");
        }

        List<InviteResponse> responses = responseRepository.findAllByInviteId(id);
        responses.forEach(r -> r.setDeleted(true));
        responseRepository.saveAll(responses);

        invite.setDeleted(true);
        inviteRepository.save(invite);
    }

    /** Admin-only toggle active status */
    @Transactional
    public void toggleActive(UUID id) {
        Invite invite = inviteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invite not found"));
        invite.setActive(!invite.isActive());
        inviteRepository.save(invite);
    }

    /* ── helpers ─────────────────────────────────────────── */

    private String currentUserPhone() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private String generateSlug(String title) {
        // Cyrillics are stripped; keep alphanumeric ASCII + hyphen
        String base = title.trim()
                .toLowerCase()
                .replaceAll("[^a-z0-9\\u0400-\\u04ff]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        // Append short UUID part to guarantee uniqueness
        String shortId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        return (base.isEmpty() ? "invite" : base) + "-" + shortId;
    }

    private InviteResponseDTO mapToDTO(Invite invite) {
        long responseCount = responseRepository.findAllByInviteId(invite.getId()).stream()
                .filter(InviteResponse::isAttending)
                .count();

        return new InviteResponseDTO(
                invite.getId(),
                invite.getSlug(),
                invite.getTitle(),
                invite.getDescription(),
                invite.getMaxGuests(),
                invite.getEventDate(),
                invite.getPreviewPhotoUrl(),
                invite.getOwner().getFullName(),
                responseCount,
                invite.getTopic1(),
                invite.getTopic2(),
                invite.getLocationName(),
                invite.getLocationUrl(),
                invite.getToiOwners(),
                invite.getTemplate(),
                invite.getGallery() == null ? List.of() : invite.getGallery(),
                invite.getMusicUrl(),
                invite.getMusicTitle(),
                invite.getMusicKey(),
                invite.getMusicSource() == null ? null : invite.getMusicSource().name(),
                invite.isActive()
        );
    }

    /** Drops dead upload links (music/photo/gallery) and infers missing music source. Returns persisted invite when mutated. */
    private Invite sanitizeAndMaybePersist(Invite invite) {
        boolean changed = sanitizeMedia(invite);
        return changed ? inviteRepository.save(invite) : invite;
    }

    /** Returns true when invite was mutated */
    private boolean sanitizeMedia(Invite invite) {
        boolean changed = false;

        // Music — remove stale uploads or infer source when missing
        if (invite.getMusicSource() == null && invite.getMusicUrl() != null && !invite.getMusicUrl().isBlank()) {
            invite.setMusicSource(MusicSource.UPLOAD);
            changed = true;
        }
        if (invite.getMusicSource() == MusicSource.UPLOAD) {
            String url = invite.getMusicUrl();
            if (url == null || url.isBlank() || !uploadExists(url)) {
                invite.setMusicUrl(null);
                invite.setMusicTitle(null);
                invite.setMusicSource(null);
                invite.setMusicKey(null);
                changed = true;
            }
        } else if (invite.getMusicSource() == MusicSource.SYSTEM) {
            // System tracks store only key; wipe stray url
            if (invite.getMusicUrl() != null && !invite.getMusicUrl().isBlank()) {
                invite.setMusicUrl(null);
                changed = true;
            }
            if (invite.getMusicKey() == null || invite.getMusicKey().isBlank()) {
                invite.setMusicSource(null);
                changed = true;
            }
        } else {
            // Legacy: source unset and url empty — clean any titles
            if ((invite.getMusicUrl() == null || invite.getMusicUrl().isBlank())
                    && (invite.getMusicKey() == null || invite.getMusicKey().isBlank())
                    && invite.getMusicTitle() != null) {
                invite.setMusicTitle(null);
                changed = true;
            }
        }

        // Preview photo — drop missing uploads
        if (invite.getPreviewPhotoUrl() != null
                && isUploadPath(invite.getPreviewPhotoUrl())
                && !uploadExists(invite.getPreviewPhotoUrl())) {
            invite.setPreviewPhotoUrl(null);
            changed = true;
        }

        // Gallery — keep only existing upload files (external URLs stay as-is)
        if (invite.getGallery() != null && !invite.getGallery().isEmpty()) {
            List<String> filtered = invite.getGallery().stream()
                    .filter(Objects::nonNull)
                    .filter(url -> !isUploadPath(url) || uploadExists(url))
                    .collect(Collectors.toCollection(ArrayList::new));
            if (filtered.size() != invite.getGallery().size()) {
                invite.setGallery(filtered);
                changed = true;
            }
        }

        return changed;
    }

    private void applyMusicSelection(Invite invite, String musicSourceRaw, String musicKey, String musicUrl, String musicTitle) {
        String cleanedUrl = (musicUrl != null && musicUrl.isBlank()) ? null : musicUrl;
        String cleanedKey = (musicKey != null && musicKey.isBlank()) ? null : musicKey;
        MusicSource source = MusicSource.fromString(musicSourceRaw);
        if (source == null) {
            if (cleanedKey != null) {
                source = MusicSource.SYSTEM;
            } else if (cleanedUrl != null) {
                source = MusicSource.UPLOAD;
            }
        }

        if (source == MusicSource.SYSTEM) {
            invite.setMusicSource(MusicSource.SYSTEM);
            invite.setMusicKey(cleanedKey);
            invite.setMusicUrl(null);
        } else if (source == MusicSource.UPLOAD) {
            invite.setMusicSource(MusicSource.UPLOAD);
            invite.setMusicKey(null);
            invite.setMusicUrl(cleanedUrl);
        } else {
            // Explicit clear
            if (musicSourceRaw != null) {
                invite.setMusicSource(null);
                invite.setMusicKey(null);
                invite.setMusicUrl(null);
            }
        }

        if (musicTitle != null) {
            invite.setMusicTitle(musicTitle);
        } else if (source == null && cleanedUrl == null && cleanedKey == null) {
            invite.setMusicTitle(null);
        }
    }

    private boolean isUploadPath(String url) {
        return resolveUploadPath(url) != null;
    }

    private boolean uploadExists(String url) {
        Path path = resolveUploadPath(url);
        if (path == null) return true; // external / non-upload links are not validated here
        return Files.exists(path);
    }

    private Path resolveUploadPath(String url) {
        if (url == null || url.isBlank()) return null;
        try {
            URI uri = URI.create(url);
            String path = uri.getPath();
            if (path == null || !path.startsWith("/uploads/")) return null;
            String relative = path.substring("/uploads/".length());
            return Paths.get(uploadDir).toAbsolutePath().normalize().resolve(relative).normalize();
        } catch (Exception e) {
            return null;
        }
    }
}
