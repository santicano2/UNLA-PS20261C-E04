package com.tp.equipo4.demo.controller;

import com.tp.equipo4.demo.dto.UserSearchResponse;
import com.tp.equipo4.demo.dto.UsernameRequest;
import com.tp.equipo4.demo.entity.User;
import com.tp.equipo4.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        List<UserSearchResponse> results = userRepository.findAll().stream()
                .filter(u -> u.getUsername().toLowerCase().contains(query.toLowerCase()))
                .map(u -> new UserSearchResponse(u.getId(), u.getUsername()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    @PatchMapping("/me/username")
    public ResponseEntity<?> updateUsername(@RequestBody UsernameRequest request, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre de usuario no puede estar vacío"));
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre de usuario ya está en uso"));
        }
        Integer userId = (Integer) auth.getPrincipal();
        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
        User user = userOpt.get();
        user.setUsername(request.getUsername());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true, "username", user.getUsername()));
    }
}
