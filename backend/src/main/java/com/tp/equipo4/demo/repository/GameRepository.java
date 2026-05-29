package com.tp.equipo4.demo.repository;

import com.tp.equipo4.demo.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {
    List<Game> findAllByOrderByCreatedAtDesc();
    List<Game> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String title);
    List<Game> findByGenreOrderByCreatedAtDesc(String genre);
    List<Game> findByTitleContainingIgnoreCaseAndGenreOrderByCreatedAtDesc(String title, String genre);
}
