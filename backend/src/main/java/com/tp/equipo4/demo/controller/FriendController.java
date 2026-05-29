package com.tp.equipo4.demo.controller;

import com.tp.equipo4.demo.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    @GetMapping
    public ResponseEntity<?> getFriends(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        return ResponseEntity.ok(friendService.getFriends((Integer) auth.getPrincipal()));
    }

    @PostMapping("/{friendId}")
    public ResponseEntity<?> addFriend(@PathVariable Integer friendId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        var result = friendService.addFriend((Integer) auth.getPrincipal(), friendId);
        if (result.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "friend", result.get()));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "No se pudo agregar amigo"));
    }

    @DeleteMapping("/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable Integer friendId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        if (friendService.removeFriend((Integer) auth.getPrincipal(), friendId)) {
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "No tienes este amigo"));
    }
}
