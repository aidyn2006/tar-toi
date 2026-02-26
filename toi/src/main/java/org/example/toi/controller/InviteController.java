package org.example.toi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.toi.dto.request.CreateInviteRequest;
import org.example.toi.dto.request.RespondInviteRequest;
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

    @PostMapping
    public ResponseEntity<InviteResponseDTO> createInvite(@Valid @RequestBody CreateInviteRequest request) {
        return ResponseEntity.ok(inviteService.createInvite(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<InviteResponseDTO>> getMyInvites() {
        return ResponseEntity.ok(inviteService.getMyInvites());
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<Void> respondToInvite(
            @PathVariable UUID id,
            @Valid @RequestBody RespondInviteRequest request
    ) {
        inviteService.respondToInvite(id, request);
        return ResponseEntity.ok().build();
    }
}
