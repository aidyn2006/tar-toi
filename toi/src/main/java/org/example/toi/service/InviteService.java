package org.example.toi.service;

import lombok.RequiredArgsConstructor;
import org.example.toi.dto.request.CreateInviteRequest;
import org.example.toi.dto.request.RespondInviteRequest;
import org.example.toi.dto.request.UpdateInviteRequest;
import org.example.toi.dto.response.GuestResponseDTO;
import org.example.toi.dto.response.InviteResponseDTO;
import org.example.toi.entity.Invite;
import org.example.toi.entity.InviteResponse;
import org.example.toi.entity.User;
import org.example.toi.repository.InviteRepository;
import org.example.toi.repository.InviteResponseRepository;
import org.example.toi.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InviteService {

    private final InviteRepository inviteRepository;
    private final InviteResponseRepository responseRepository;
    private final UserRepository userRepository;

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
                .maxGuests(request.maxGuests())
                .eventDate(request.eventDate())
                .previewPhotoUrl(request.previewPhotoUrl())
                .slug(slug)
                .topic1(request.topic1())
                .topic2(request.topic2())
                .locationName(request.locationName())
                .locationUrl(request.locationUrl())
                .toiOwners(request.toiOwners())
                .template(request.template())
                .build();

        return mapToDTO(inviteRepository.save(invite));
    }

    @Transactional(readOnly = true)
    public List<InviteResponseDTO> getMyInvites() {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return inviteRepository.findAllByOwnerId(owner.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /** Public — no auth required. Fetches invite by its unique slug. */
    @Transactional(readOnly = true)
    public InviteResponseDTO getPublicInvite(String slug) {
        Invite invite = inviteRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Invite not found"));
        return mapToDTO(invite);
    }

    /** Owner-only update. */
    @Transactional
    public InviteResponseDTO updateInvite(UUID id, UpdateInviteRequest request) {
        String phone = currentUserPhone();
        User owner = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Invite invite = inviteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        if (!invite.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Access denied");
        }

        if (request.title() != null) invite.setTitle(request.title());
        if (request.description() != null) invite.setDescription(request.description());
        if (request.maxGuests() > 0) invite.setMaxGuests(request.maxGuests());
        if (request.eventDate() != null) invite.setEventDate(request.eventDate());
        if (request.previewPhotoUrl() != null) invite.setPreviewPhotoUrl(request.previewPhotoUrl());
        if (request.topic1() != null) invite.setTopic1(request.topic1());
        if (request.topic2() != null) invite.setTopic2(request.topic2());
        if (request.locationName() != null) invite.setLocationName(request.locationName());
        if (request.locationUrl() != null) invite.setLocationUrl(request.locationUrl());
        if (request.toiOwners() != null) invite.setToiOwners(request.toiOwners());
        if (request.template() != null) invite.setTemplate(request.template());

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

        if (!invite.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Access denied");
        }

        return responseRepository.findAllByInviteId(inviteId).stream()
                .map(r -> new GuestResponseDTO(
                        r.getId(),
                        r.getGuestName(),
                        r.getPhone(),
                        r.getGuestsCount(),
                        r.isAttending(),
                        r.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void respondToInvite(UUID inviteId, RespondInviteRequest request) {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        long currentGuests = responseRepository.findAllByInviteId(inviteId).stream()
                .filter(InviteResponse::isAttending)
                .mapToLong(InviteResponse::getGuestsCount)
                .sum();

        if (request.attending() && (currentGuests + request.guestsCount() > invite.getMaxGuests())) {
            throw new RuntimeException("Cannot exceed max guests limit");
        }

        InviteResponse response = InviteResponse.builder()
                .invite(invite)
                .guestName(request.guestName())
                .phone(request.phone())
                .guestsCount(request.guestsCount())
                .attending(request.attending())
                .build();

        responseRepository.save(response);
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
                invite.getTemplate()
        );
    }
}
