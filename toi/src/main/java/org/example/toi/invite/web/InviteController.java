package org.example.toi.invite.web;

import jakarta.validation.Valid;
import java.util.List;
import org.example.toi.invite.dto.InviteStatsResponse;
import org.example.toi.invite.dto.InviteUpsertRequest;
import org.example.toi.invite.dto.InviteView;
import org.example.toi.invite.service.InviteService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/invites")
public class InviteController {
    private final InviteService inviteService;

    public InviteController(InviteService inviteService) {
        this.inviteService = inviteService;
    }

    @GetMapping("/my")
    public List<InviteView> myInvites(Authentication authentication) {
        return inviteService.getOwnerInvites(authentication.getName());
    }

    @GetMapping("/{id}")
    public InviteView getInvite(Authentication authentication, @PathVariable("id") String id) {
        return inviteService.getOwnerInvite(authentication.getName(), id);
    }

    @GetMapping("/{id}/stats")
    public InviteStatsResponse getInviteStats(Authentication authentication, @PathVariable("id") String id) {
        return inviteService.getOwnerStats(authentication.getName(), id);
    }

    @PostMapping
    public InviteView upsertInvite(Authentication authentication, @Valid @RequestBody InviteUpsertRequest request) {
        return inviteService.upsertInvite(authentication.getName(), request);
    }
}
