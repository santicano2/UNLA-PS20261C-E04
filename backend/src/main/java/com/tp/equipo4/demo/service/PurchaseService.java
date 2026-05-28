package com.tp.equipo4.demo.service;

import com.tp.equipo4.demo.dto.LibraryItemResponse;
import com.tp.equipo4.demo.dto.PurchaseResponse;
import com.tp.equipo4.demo.entity.CartItem;
import com.tp.equipo4.demo.entity.Game;
import com.tp.equipo4.demo.entity.Purchase;
import com.tp.equipo4.demo.repository.CartItemRepository;
import com.tp.equipo4.demo.repository.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Transactional
    public List<PurchaseResponse> buyCart(Integer userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<PurchaseResponse> purchased = cartItems.stream()
                .filter(item -> !purchaseRepository.existsByUserIdAndGameId(userId, item.getGame().getId()))
                .map(item -> {
                    Purchase purchase = new Purchase();
                    purchase.setUser(item.getUser());
                    purchase.setGame(item.getGame());
                    purchaseRepository.save(purchase);
                    return new PurchaseResponse(item.getGame().getId(), item.getGame().getTitle());
                })
                .collect(Collectors.toList());

        cartItemRepository.deleteAll(cartItems);
        return purchased;
    }

    public List<Integer> getUserOwnedGameIds(Integer userId) {
        return purchaseRepository.findByUserId(userId).stream()
                .map(p -> p.getGame().getId())
                .collect(Collectors.toList());
    }

    public List<LibraryItemResponse> getLibrary(Integer userId) {
        return purchaseRepository.findByUserId(userId).stream()
                .map(p -> {
                    Game g = p.getGame();
                    return new LibraryItemResponse(
                            g.getId(),
                            g.getTitle(),
                            g.getGenre(),
                            g.getImageUrl(),
                            g.getPublisher().getUsername(),
                            p.getPurchasedAt(),
                            p.getInstalled() != null && p.getInstalled(),
                            p.getFavorite() != null && p.getFavorite()
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleInstalled(Integer userId, Integer gameId) {
        Optional<Purchase> opt = purchaseRepository.findByUserIdAndGameId(userId, gameId);
        if (opt.isEmpty()) return false;
        Purchase p = opt.get();
        p.setInstalled(!Boolean.TRUE.equals(p.getInstalled()));
        purchaseRepository.save(p);
        return true;
    }

    @Transactional
    public boolean toggleFavorite(Integer userId, Integer gameId) {
        Optional<Purchase> opt = purchaseRepository.findByUserIdAndGameId(userId, gameId);
        if (opt.isEmpty()) return false;
        Purchase p = opt.get();
        p.setFavorite(!Boolean.TRUE.equals(p.getFavorite()));
        purchaseRepository.save(p);
        return true;
    }
}
