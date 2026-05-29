package com.tp.equipo4.demo.service;

import com.tp.equipo4.demo.dto.CartItemResponse;
import com.tp.equipo4.demo.entity.CartItem;
import com.tp.equipo4.demo.entity.Game;
import com.tp.equipo4.demo.entity.User;
import com.tp.equipo4.demo.repository.CartItemRepository;
import com.tp.equipo4.demo.repository.GameRepository;
import com.tp.equipo4.demo.repository.PurchaseRepository;
import com.tp.equipo4.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    public List<CartItemResponse> getCart(Integer userId) {
        return cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public String addGame(Integer userId, Integer gameId) {
        if (cartItemRepository.existsByUserIdAndGameId(userId, gameId)) {
            return "El juego ya está en el carrito";
        }
        if (purchaseRepository.existsByUserIdAndGameIdAndRefundedFalse(userId, gameId)) {
            return "Ya tienes este juego en tu biblioteca";
        }
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Game> gameOpt = gameRepository.findById(gameId);
        if (userOpt.isEmpty() || gameOpt.isEmpty()) {
            return "Juego o usuario no encontrado";
        }
        CartItem item = new CartItem();
        item.setUser(userOpt.get());
        item.setGame(gameOpt.get());
        cartItemRepository.save(item);
        return null;
    }

    @Transactional
    public void removeGame(Integer userId, Integer gameId) {
        cartItemRepository.deleteByUserIdAndGameId(userId, gameId);
    }

    private CartItemResponse toResponse(CartItem item) {
        Game g = item.getGame();
        BigDecimal discountedPrice = g.getDiscount() != null && g.getDiscount() > 0
                ? g.getPrice().multiply(BigDecimal.valueOf(100 - g.getDiscount()))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                : g.getPrice();
        return new CartItemResponse(
                item.getId(),
                g.getId(),
                g.getTitle(),
                g.getGenre(),
                g.getPrice(),
                g.getImageUrl(),
                g.getPublisher().getUsername(),
                g.getDiscount(),
                discountedPrice
        );
    }
}
