package com.tp.equipo4.demo.controller;

import com.tp.equipo4.demo.dto.LibraryItemResponse;
import com.tp.equipo4.demo.dto.PurchaseResponse;
import com.tp.equipo4.demo.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/purchases")
public class PurchaseController {

    @Autowired
    private PurchaseService purchaseService;

    @PostMapping
    public ResponseEntity<?> buyCart(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        Integer userId = (Integer) auth.getPrincipal();
        List<PurchaseResponse> purchased = purchaseService.buyCart(userId);
        return ResponseEntity.ok(Map.of("success", true, "purchased", purchased));
    }

    @GetMapping
    public ResponseEntity<?> getOwnedGames(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(List.of());
        Integer userId = (Integer) auth.getPrincipal();
        return ResponseEntity.ok(purchaseService.getUserOwnedGameIds(userId));
    }

    @GetMapping("/library")
    public ResponseEntity<?> getLibrary(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(List.of());
        Integer userId = (Integer) auth.getPrincipal();
        return ResponseEntity.ok(purchaseService.getLibrary(userId));
    }

    @PostMapping("/{gameId}/install")
    public ResponseEntity<?> toggleInstall(@PathVariable Integer gameId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        purchaseService.toggleInstalled((Integer) auth.getPrincipal(), gameId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/{gameId}/favorite")
    public ResponseEntity<?> toggleFavorite(@PathVariable Integer gameId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        purchaseService.toggleFavorite((Integer) auth.getPrincipal(), gameId);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
