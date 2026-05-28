package com.tp.equipo4.demo.repository;

import com.tp.equipo4.demo.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUserIdOrderByCreatedAtDesc(Integer userId);
    Optional<CartItem> findByUserIdAndGameId(Integer userId, Integer gameId);
    boolean existsByUserIdAndGameId(Integer userId, Integer gameId);
    void deleteByUserIdAndGameId(Integer userId, Integer gameId);
}
