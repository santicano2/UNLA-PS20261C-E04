package com.tp.equipo4.demo.controller;

import com.tp.equipo4.demo.dto.LoginRequest;
import com.tp.equipo4.demo.dto.RegisterRequest;
import com.tp.equipo4.demo.dto.AuthResponse;
import com.tp.equipo4.demo.dto.UserDto;
import com.tp.equipo4.demo.entity.User;
import com.tp.equipo4.demo.repository.UserRepository;
import com.tp.equipo4.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", "No autenticado"));
        }
        Integer userId = (Integer) auth.getPrincipal();
        String role = (String) auth.getDetails();
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", "Usuario no encontrado"));
        }
        User user = userOpt.get();
        UserDto dto = new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(dto);
    }
}
