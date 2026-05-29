package com.tp.equipo4.demo.service;

import com.tp.equipo4.demo.dto.GameResponse;
import com.tp.equipo4.demo.dto.WishlistResponse;
import com.tp.equipo4.demo.entity.WishlistItem;
import com.tp.equipo4.demo.repository.GameRepository;
import com.tp.equipo4.demo.repository.UserRepository;
import com.tp.equipo4.demo.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GameService gameService;

    public List<WishlistResponse> getWishlist(Integer userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(w -> new WishlistResponse(w.getGame().getId(), w.getGame().getTitle()))
                .collect(Collectors.toList());
    }

    public List<Integer> getWishlistGameIds(Integer userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(w -> w.getGame().getId())
                .collect(Collectors.toList());
    }

    public List<GameResponse> getWishlistGames(Integer userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(w -> gameService.toResponse(w.getGame()))
                .collect(Collectors.toList());
    }

    public boolean isWishlisted(Integer userId, Integer gameId) {
        return wishlistRepository.existsByUserIdAndGameId(userId, gameId);
    }

    @Transactional
    public boolean toggle(Integer userId, Integer gameId) {
        var opt = wishlistRepository.findByUserIdAndGameId(userId, gameId);
        if (opt.isPresent()) {
            wishlistRepository.delete(opt.get());
            return false;
        }
        var user = userRepository.findById(userId).orElseThrow();
        var game = gameRepository.findById(gameId).orElseThrow();
        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setGame(game);
        wishlistRepository.save(item);
        return true;
    }
}
