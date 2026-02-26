package org.example.toi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.toi.dto.request.CreateInviteRequest;
import org.example.toi.dto.request.RespondInviteRequest;
import org.example.toi.dto.request.UpdateInviteRequest;
import org.example.toi.dto.response.GuestResponseDTO;
import org.example.toi.dto.response.InviteResponseDTO;
import org.example.toi.service.InviteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/invites")
@RequiredArgsConstructor
public class InviteController {

    private final InviteService inviteService;

    /** POST /api/v1/invites — create a new invite (authenticated) */
    @PostMapping
    public ResponseEntity<InviteResponseDTO> createInvite(@Valid @RequestBody CreateInviteRequest request) {
        return ResponseEntity.ok(inviteService.createInvite(request));
    }

    /** GET /api/v1/invites/my — list current user's invites (authenticated) */
    @GetMapping("/my")
    public ResponseEntity<List<InviteResponseDTO>> getMyInvites() {
        return ResponseEntity.ok(inviteService.getMyInvites());
    }

    /** GET /api/v1/invites/slug/{slug} — public, no auth required */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<InviteResponseDTO> getPublicInvite(@PathVariable String slug) {
        return ResponseEntity.ok(inviteService.getPublicInvite(slug));
    }

    /** PUT /api/v1/invites/{id} — update invite (owner only, authenticated) */
    @PutMapping("/{id}")
    public ResponseEntity<InviteResponseDTO> updateInvite(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateInviteRequest request
    ) {
        return ResponseEntity.ok(inviteService.updateInvite(id, request));
    }

    /** GET /api/v1/invites/{id}/responses — CRM guest list (owner only, authenticated) */
    @GetMapping("/{id}/responses")
    public ResponseEntity<List<GuestResponseDTO>> getResponses(@PathVariable UUID id) {
        return ResponseEntity.ok(inviteService.getResponses(id));
    }

    /** POST /api/v1/invites/{id}/respond — RSVP (public, no auth required) */
    @PostMapping("/{id}/respond")
    public ResponseEntity<Void> respondToInvite(
            @PathVariable UUID id,
            @Valid @RequestBody RespondInviteRequest request
    ) {
        inviteService.respondToInvite(id, request);
        return ResponseEntity.ok().build();
    }
}
