package com.tp.equipo4.demo.repository;

import com.tp.equipo4.demo.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Integer> {
    List<WishlistItem> findByUserId(Integer userId);
    boolean existsByUserIdAndGameId(Integer userId, Integer gameId);
    Optional<WishlistItem> findByUserIdAndGameId(Integer userId, Integer gameId);
    void deleteByUserIdAndGameId(Integer userId, Integer gameId);
}
