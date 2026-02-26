package org.example.toi.service;

import lombok.RequiredArgsConstructor;
import org.example.toi.dto.request.CreateInviteRequest;
import org.example.toi.dto.request.RespondInviteRequest;
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
        String phone = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Invite invite = Invite.builder()
                .owner(owner)
                .title(request.title())
                .description(request.description())
                .maxGuests(request.maxGuests())
                .eventDate(request.eventDate())
                .previewPhotoUrl(request.previewPhotoUrl())
                .build();

        Invite saved = inviteRepository.save(invite);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<InviteResponseDTO> getMyInvites() {
        String phone = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return inviteRepository.findAllByOwnerId(owner.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void respondToInvite(UUID inviteId, RespondInviteRequest request) {
        Invite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        // Business Logic: Check max guests
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
                .guestsCount(request.guestsCount())
                .attending(request.attending())
                .build();

        responseRepository.save(response);
    }

    private InviteResponseDTO mapToDTO(Invite invite) {
        long responseCount = responseRepository.findAllByInviteId(invite.getId()).stream()
                .filter(InviteResponse::isAttending)
                .count();

        return new InviteResponseDTO(
                invite.getId(),
                invite.getTitle(),
                invite.getDescription(),
                invite.getMaxGuests(),
                invite.getEventDate(),
                invite.getPreviewPhotoUrl(),
                invite.getOwner().getFullName(),
                responseCount
        );
    }
}
