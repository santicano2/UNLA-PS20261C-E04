package com.tp.equipo4.demo.controller;

import com.tp.equipo4.demo.dto.GameResponse;
import com.tp.equipo4.demo.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Integer>> getWishlist(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(List.of());
        return ResponseEntity.ok(wishlistService.getWishlistGameIds((Integer) auth.getPrincipal()));
    }

    @GetMapping("/games")
    public ResponseEntity<List<GameResponse>> getWishlistGames(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(List.of());
        return ResponseEntity.ok(wishlistService.getWishlistGames((Integer) auth.getPrincipal()));
    }

    @PostMapping("/{gameId}")
    public ResponseEntity<?> toggle(@PathVariable Integer gameId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        boolean added = wishlistService.toggle((Integer) auth.getPrincipal(), gameId);
        return ResponseEntity.ok(Map.of("added", added));
    }
}
