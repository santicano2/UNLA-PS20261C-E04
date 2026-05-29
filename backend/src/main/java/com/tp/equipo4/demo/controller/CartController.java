package com.tp.equipo4.demo.controller;

import com.tp.equipo4.demo.dto.CartItemResponse;
import com.tp.equipo4.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(List.of());
        Integer userId = (Integer) auth.getPrincipal();
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/{gameId}")
    public ResponseEntity<?> addGame(@PathVariable Integer gameId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        Integer userId = (Integer) auth.getPrincipal();
        String error = cartService.addGame(userId, gameId);
        if (error == null) {
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.badRequest().body(Map.of("error", error));
    }

    @DeleteMapping("/{gameId}")
    public ResponseEntity<?> removeGame(@PathVariable Integer gameId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        Integer userId = (Integer) auth.getPrincipal();
        cartService.removeGame(userId, gameId);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
