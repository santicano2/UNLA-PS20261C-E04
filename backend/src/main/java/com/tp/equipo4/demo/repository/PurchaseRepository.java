package com.tp.equipo4.demo.repository;

import com.tp.equipo4.demo.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {
    List<Purchase> findByUserId(Integer userId);
    boolean existsByUserIdAndGameId(Integer userId, Integer gameId);
    Optional<Purchase> findByUserIdAndGameId(Integer userId, Integer gameId);
}
