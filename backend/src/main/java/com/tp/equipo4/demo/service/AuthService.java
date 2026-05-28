package com.tp.equipo4.demo.service;

import com.tp.equipo4.demo.dto.LoginRequest;
import com.tp.equipo4.demo.dto.RegisterRequest;
import com.tp.equipo4.demo.dto.AuthResponse;
import com.tp.equipo4.demo.dto.UserDto;
import com.tp.equipo4.demo.entity.User;
import com.tp.equipo4.demo.repository.UserRepository;
import com.tp.equipo4.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "El email ya está registrado", null, null);
        }
        
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(false, "El username ya está registrado", null, null);
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        User savedUser = userRepository.save(user);
        
        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
        UserDto userDto = new UserDto(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
        return new AuthResponse(true, "Usuario registrado exitosamente", userDto, token);
    }
    
    public AuthResponse login(LoginRequest request) {
        var user = userRepository.findByEmail(request.getEmail());
        
        if (user.isEmpty()) {
            return new AuthResponse(false, "Credenciales inválidas", null, null);
        }
        
        User foundUser = user.get();
        
        if (!passwordEncoder.matches(request.getPassword(), foundUser.getPassword())) {
            return new AuthResponse(false, "Credenciales inválidas", null, null);
        }
        
        String token = jwtUtil.generateToken(foundUser.getId(), foundUser.getUsername(), foundUser.getEmail());
        UserDto userDto = new UserDto(foundUser.getId(), foundUser.getUsername(), foundUser.getEmail());
        return new AuthResponse(true, "Login exitoso", userDto, token);
    }
}
