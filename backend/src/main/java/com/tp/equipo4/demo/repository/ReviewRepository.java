package com.tp.equipo4.demo.repository;

import com.tp.equipo4.demo.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByGameIdOrderByCreatedAtDesc(Integer gameId);
}
