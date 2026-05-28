package com.tp.equipo4.demo.service;

import com.tp.equipo4.demo.dto.GameRequest;
import com.tp.equipo4.demo.dto.GameResponse;
import com.tp.equipo4.demo.entity.Game;
import com.tp.equipo4.demo.entity.User;
import com.tp.equipo4.demo.repository.GameRepository;
import com.tp.equipo4.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserRepository userRepository;

    public List<GameResponse> getAllGames() {
        return gameRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<GameResponse> createGame(GameRequest request, Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty() || !"developer".equals(userOpt.get().getRole())) {
            return Optional.empty();
        }

        Game game = new Game();
        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setGenre(request.getGenre());
        game.setPrice(request.getPrice());
        game.setImageUrl(request.getImageUrl());
        game.setDownloadUrl(request.getDownloadUrl());
        game.setPublisher(userOpt.get());

        Game saved = gameRepository.save(game);
        return Optional.of(toResponse(saved));
    }

    private GameResponse toResponse(Game game) {
        return new GameResponse(
                game.getId(),
                game.getTitle(),
                game.getDescription(),
                game.getGenre(),
                game.getPrice(),
                game.getImageUrl(),
                game.getDownloadUrl(),
                game.getPublisher().getUsername(),
                game.getCreatedAt()
        );
    }
}
