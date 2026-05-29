package com.tp.equipo4.demo.controller;

import com.tp.equipo4.demo.dto.GameRequest;
import com.tp.equipo4.demo.dto.GameResponse;
import com.tp.equipo4.demo.entity.Game;
import com.tp.equipo4.demo.repository.GameRepository;
import com.tp.equipo4.demo.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @Autowired
    private GameRepository gameRepository;

    @GetMapping
    public ResponseEntity<List<GameResponse>> getAllGames() {
        return ResponseEntity.ok(gameService.getAllGames());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGame(@PathVariable Integer id) {
        return gameRepository.findById(id)
                .map(g -> ResponseEntity.ok(gameService.toResponse(g)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createGame(@RequestBody GameRequest request, Authentication auth) {
        if (auth == null || !"developer".equals(auth.getDetails())) {
            return ResponseEntity.status(403).body(Map.of("error", "Solo desarrolladores pueden publicar juegos"));
        }
        Integer userId = (Integer) auth.getPrincipal();
        var result = gameService.createGame(request, userId);
        if (result.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("error", "Solo desarrolladores pueden publicar juegos"));
        }
        return ResponseEntity.ok(result.get());
    }
}
