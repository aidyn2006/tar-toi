package org.example.toi.service.impl;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.example.toi.common.exception.ConflictException;
import org.example.toi.common.exception.ForbiddenException;
import org.example.toi.common.exception.NotFoundException;
import org.example.toi.dto.request.CreateInviteRequest;
import org.example.toi.dto.request.RespondInviteRequest;
import org.example.toi.dto.request.UpdateInviteRequest;
import org.example.toi.dto.response.GuestResponseDTO;
import org.example.toi.dto.response.InviteResponseDTO;
import org.example.toi.entity.Invite;
import org.example.toi.entity.InviteResponse;
import org.example.toi.entity.User;
import org.example.toi.entity.enums.MusicSource;
import org.example.toi.entity.enums.Role;
import org.example.toi.repository.InviteRepository;
import org.example.toi.repository.InviteResponseRepository;
import org.example.toi.repository.UserRepository;
import org.example.toi.service.InviteService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InviteServiceImpl implements InviteService {

    private final InviteRepository inviteRepository;
    private final InviteResponseRepository responseRepository;
    private final UserRepository userRepository;

    @Value("${uploads.dir:uploads}")
    private String uploadDir;

    @Override
    @Transactional
    public InviteResponseDTO createInvite(CreateInviteRequest request) {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhoneAndIsDeletedFalse(phone)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Map<String, Object> payload = copyPayload(request.getPayload());
        sanitizePayloadBeforePersist(payload);

        String slug = generateSlug(extractTitle(payload));

        Invite invite = Invite.builder()
                .owner(owner)
                .slug(slug)
                .payload(payload)
                .build();

        return mapToDTO(inviteRepository.save(invite));
    }

    @Override
    @Transactional
    public List<InviteResponseDTO> getMyInvites() {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhoneAndIsDeletedFalse(phone)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return inviteRepository.findAllByOwnerIdAndIsDeletedFalse(owner.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InviteResponseDTO> getAllInvites() {
        return inviteRepository.findAllByIsDeletedFalse().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InviteResponseDTO getPublicInvite(String slug) {
        Invite invite = inviteRepository.findBySlugAndIsDeletedFalse(slug)
                .orElseThrow(() -> new NotFoundException("Invite not found"));
        if (!invite.isActive()) {
            throw new NotFoundException("Invite not found");
        }
        return mapToDTO(invite);
    }

    @Override
    @Transactional
    public InviteResponseDTO updateInvite(UUID id, UpdateInviteRequest request) {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhoneAndIsDeletedFalse(phone)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Invite invite = inviteRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NotFoundException("Invite not found"));

        if (!invite.getOwner().getId().equals(owner.getId()) && owner.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Access denied");
        }

        Map<String, Object> payload = copyPayload(invite.getPayload());
        if (request.getPayload() != null) {
            payload.putAll(request.getPayload());
        }
        sanitizePayloadBeforePersist(payload);
        invite.setPayload(payload);

        return mapToDTO(inviteRepository.save(invite));
    }

    @Override
    @Transactional(readOnly = true)
    public List<GuestResponseDTO> getResponses(UUID inviteId) {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhoneAndIsDeletedFalse(phone)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Invite invite = inviteRepository.findByIdAndIsDeletedFalse(inviteId)
                .orElseThrow(() -> new NotFoundException("Invite not found"));

        if (!invite.getOwner().getId().equals(owner.getId()) && owner.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Access denied");
        }

        return responseRepository.findAllByInviteIdAndIsDeletedFalse(inviteId).stream()
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

    @Override
    @Transactional
    public void respondToInvite(UUID inviteId, RespondInviteRequest request) {
        Invite invite = inviteRepository.findWithLockingById(inviteId)
                .orElseThrow(() -> new NotFoundException("Invite not found"));
        if (invite.isDeleted()) {
            throw new NotFoundException("Invite not found");
        }

        int guests = request.getGuestsCount() == null || request.getGuestsCount() < 1 ? 1 : request.getGuestsCount();
        boolean attending = request.getAttending() == null ? true : request.getAttending();

        int maxGuests = extractMaxGuests(invite.getPayload());
        if (attending && maxGuests > 0) {
            long currentAttending = responseRepository.sumAttendingGuests(inviteId);
            if (currentAttending + guests > maxGuests) {
                throw new ConflictException("Қонақтар лимиті толды. Максимум: " + maxGuests);
            }
        }

        InviteResponse response = InviteResponse.builder()
                .invite(invite)
                .guestName(request.getGuestName())
                .phone(request.getPhone())
                .guestsCount(guests)
                .attending(attending)
                .note(request.getNote())
                .build();

        responseRepository.save(response);
    }

    @Override
    @Transactional
    public void deleteInvite(UUID id) {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhoneAndIsDeletedFalse(phone)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Invite invite = inviteRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NotFoundException("Invite not found"));

        if (!invite.getOwner().getId().equals(owner.getId()) && owner.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Access denied");
        }

        List<InviteResponse> responses = responseRepository.findAllByInviteIdAndIsDeletedFalse(id);
        responses.forEach(r -> r.setDeleted(true));
        responseRepository.saveAll(responses);

        invite.setDeleted(true);
        inviteRepository.save(invite);
    }

    @Override
    @Transactional
    public void toggleActive(UUID id) {
        Invite invite = inviteRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NotFoundException("Invite not found"));
        invite.setActive(!invite.isActive());
        inviteRepository.save(invite);
    }

    /* ── helpers ─────────────────────────────────────────── */

    private String currentUserPhone() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private String generateSlug(String title) {
        String base = title.trim()
                .toLowerCase()
                .replaceAll("[^a-z0-9\\u0400-\\u04ff]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        String shortId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        return (base.isEmpty() ? "invite" : base) + "-" + shortId;
    }

    private InviteResponseDTO mapToDTO(Invite invite) {
        Map<String, Object> sanitized = sanitizePayloadForView(invite.getPayload());
        long responseCount = responseRepository.countByInviteIdAndAttendingTrueAndIsDeletedFalse(invite.getId());

        return new InviteResponseDTO(
                invite.getId(),
                invite.getSlug(),
                sanitized,
                invite.getOwner().getFullName(),
                responseCount,
                invite.isActive()
        );
    }

    private Map<String, Object> copyPayload(Map<String, Object> payload) {
        return payload == null ? new java.util.HashMap<>() : new java.util.HashMap<>(payload);
    }

    private String extractTitle(Map<String, Object> payload) {
        if (payload == null) return "";
        Object titleObj = payload.get("title");
        return titleObj == null ? "" : titleObj.toString();
    }

    private int extractMaxGuests(Map<String, Object> payload) {
        if (payload == null) return 0;
        Object value = payload.get("maxGuests");
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value instanceof String s) {
            try {
                return Integer.parseInt(s);
            } catch (NumberFormatException ignored) {
            }
        }
        return 0;
    }

    private Map<String, Object> sanitizePayloadForView(Map<String, Object> payload) {
        Map<String, Object> copy = copyPayload(payload);
        normalizeMusicPayload(copy, true);
        cleanMediaPayload(copy, true);
        return copy;
    }

    private void sanitizePayloadBeforePersist(Map<String, Object> payload) {
        normalizeMusicPayload(payload, true);
        cleanMediaPayload(payload, true);
    }

    private void normalizeMusicPayload(Map<String, Object> payload, boolean enforceUploadsExistence) {
        String rawSource = asString(payload.get("musicSource"));
        String musicUrl = asString(payload.get("musicUrl"));
        String musicKey = asString(payload.get("musicKey"));
        String musicTitle = asString(payload.get("musicTitle"));

        MusicSource source = MusicSource.fromString(rawSource);
        if (source == null) {
            if (musicKey != null && !musicKey.isBlank()) {
                source = MusicSource.SYSTEM;
            } else if (musicUrl != null && !musicUrl.isBlank()) {
                source = MusicSource.UPLOAD;
            }
        }

        if (source == MusicSource.SYSTEM) {
            payload.put("musicSource", MusicSource.SYSTEM.name());
            payload.put("musicKey", musicKey);
            payload.remove("musicUrl");
        } else if (source == MusicSource.UPLOAD) {
            if (enforceUploadsExistence && (musicUrl == null || musicUrl.isBlank() || !uploadExists(musicUrl))) {
                payload.remove("musicUrl");
                payload.remove("musicTitle");
                payload.remove("musicSource");
                payload.remove("musicKey");
            } else {
                payload.put("musicSource", MusicSource.UPLOAD.name());
                payload.put("musicUrl", musicUrl);
                payload.remove("musicKey");
            }
        } else {
            payload.remove("musicSource");
            payload.remove("musicUrl");
            payload.remove("musicKey");
        }

        if (musicTitle != null) {
            payload.put("musicTitle", musicTitle);
        }
    }

    private void cleanMediaPayload(Map<String, Object> payload, boolean enforceUploadsExistence) {
        String preview = asString(payload.get("previewPhotoUrl"));
        if (preview != null && !preview.isBlank()) {
            if (enforceUploadsExistence && isUploadPath(preview) && !uploadExists(preview)) {
                payload.remove("previewPhotoUrl");
            } else {
                payload.put("previewPhotoUrl", preview);
            }
        }

        Object galleryObj = payload.get("gallery");
        if (galleryObj instanceof List<?> galleryList) {
            List<String> filtered = galleryList.stream()
                    .map(this::asString)
                    .filter(Objects::nonNull)
                    .filter(url -> !enforceUploadsExistence || !isUploadPath(url) || uploadExists(url))
                    .collect(Collectors.toCollection(ArrayList::new));
            payload.put("gallery", filtered);
        }
    }

    private String asString(Object value) {
        return value == null ? null : value.toString();
    }

    private boolean isUploadPath(String url) {
        return resolveUploadPath(url) != null;
    }

    private boolean uploadExists(String url) {
        Path path = resolveUploadPath(url);
        if (path == null) return true;
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
