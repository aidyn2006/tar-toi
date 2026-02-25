package org.example.toi.invite.web;

import jakarta.validation.Valid;
import org.example.toi.invite.dto.PublicInviteView;
import org.example.toi.invite.dto.PublicRsvpRequest;
import org.example.toi.invite.dto.PublicRsvpResponse;
import org.example.toi.invite.service.InviteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/invites")
public class PublicInviteController {
    private final InviteService inviteService;

    public PublicInviteController(InviteService inviteService) {
        this.inviteService = inviteService;
    }

    @GetMapping("/{id}")
    public PublicInviteView getPublicInvite(@PathVariable("id") String id) {
        return inviteService.getPublicInvite(id);
    }

    @PostMapping("/{id}/responses")
    public ResponseEntity<PublicRsvpResponse> addResponse(
            @PathVariable("id") String id,
            @Valid @RequestBody PublicRsvpRequest request
    ) {
        inviteService.addPublicResponse(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new PublicRsvpResponse("Рақмет! Жауабыңыз қабылданды"));
    }
}
