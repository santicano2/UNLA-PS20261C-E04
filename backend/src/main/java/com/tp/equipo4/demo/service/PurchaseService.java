package com.tp.equipo4.demo.service;

import com.tp.equipo4.demo.dto.HistoryItemResponse;
import com.tp.equipo4.demo.dto.LibraryItemResponse;
import com.tp.equipo4.demo.dto.PurchaseResponse;
import com.tp.equipo4.demo.dto.SalesReportItem;
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
                .filter(item -> !purchaseRepository.existsByUserIdAndGameIdAndRefundedFalse(userId, item.getGame().getId()))
                .map(item -> {
                    var existing = purchaseRepository.findByUserIdAndGameId(userId, item.getGame().getId());
                    if (existing.isPresent() && existing.get().getRefunded()) {
                        Purchase p = existing.get();
                        p.setRefunded(false);
                        purchaseRepository.save(p);
                        return new PurchaseResponse(item.getGame().getId(), item.getGame().getTitle());
                    }
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
        return purchaseRepository.findByUserIdAndRefundedFalse(userId).stream()
                .map(p -> p.getGame().getId())
                .collect(Collectors.toList());
    }

    public List<LibraryItemResponse> getLibrary(Integer userId) {
        return purchaseRepository.findByUserIdAndRefundedFalse(userId).stream()
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

    public List<HistoryItemResponse> getPurchaseHistory(Integer userId) {
        return purchaseRepository.findByUserId(userId).stream()
                .map(p -> {
                    Game g = p.getGame();
                    return new HistoryItemResponse(
                            g.getId(),
                            g.getTitle(),
                            g.getGenre(),
                            g.getImageUrl(),
                            g.getPrice(),
                            g.getPublisher().getUsername(),
                            p.getPurchasedAt(),
                            p.getRefunded() != null && p.getRefunded()
                    );
                })
                .collect(Collectors.toList());
    }

    public List<SalesReportItem> getSalesReport(Integer publisherId) {
        return purchaseRepository.findByGamePublisherId(publisherId).stream()
                .map(p -> new SalesReportItem(
                        p.getGame().getTitle(),
                        p.getUser().getUsername(),
                        p.getPurchasedAt(),
                        p.getGame().getPrice(),
                        p.getRefunded() != null && p.getRefunded()
                ))
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

    @Transactional
    public boolean refund(Integer userId, Integer gameId) {
        Optional<Purchase> opt = purchaseRepository.findByUserIdAndGameId(userId, gameId);
        if (opt.isEmpty()) return false;
        Purchase p = opt.get();
        p.setRefunded(true);
        p.setInstalled(false);
        purchaseRepository.save(p);
        return true;
    }
}
