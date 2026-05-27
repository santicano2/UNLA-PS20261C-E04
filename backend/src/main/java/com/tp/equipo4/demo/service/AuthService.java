package com.tp.equipo4.demo.service;

import com.tp.equipo4.demo.dto.LoginRequest;
import com.tp.equipo4.demo.dto.RegisterRequest;
import com.tp.equipo4.demo.dto.AuthResponse;
import com.tp.equipo4.demo.dto.UserDto;
import com.tp.equipo4.demo.entity.User;
import com.tp.equipo4.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    public AuthResponse register(RegisterRequest request) {
        // Validar que el email no exista
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "El email ya está registrado", null);
        }
        
        // Validar que el username no exista
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(false, "El username ya está registrado", null);
        }
        
        // Crear nuevo usuario
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        // TODO: encriptar la contraseña con BCrypt
        user.setPassword(request.getPassword());
        
        User savedUser = userRepository.save(user);
        
        UserDto userDto = new UserDto(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
        return new AuthResponse(true, "Usuario registrado exitosamente", userDto);
    }
    
    public AuthResponse login(LoginRequest request) {
        // Buscar usuario por email
        var user = userRepository.findByEmail(request.getEmail());
        
        if (user.isEmpty()) {
            return new AuthResponse(false, "Credenciales inválidas", null);
        }
        
        User foundUser = user.get();
        
        // TODO: comparar contraseña encriptada con BCrypt
        if (!foundUser.getPassword().equals(request.getPassword())) {
            return new AuthResponse(false, "Credenciales inválidas", null);
        }
        
        UserDto userDto = new UserDto(foundUser.getId(), foundUser.getUsername(), foundUser.getEmail());
        return new AuthResponse(true, "Login exitoso", userDto);
    }
}
