package com.tp.equipo4.demo.controller;

import com.tp.equipo4.demo.dto.ReviewRequest;
import com.tp.equipo4.demo.dto.ReviewResponse;
import com.tp.equipo4.demo.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/games/{gameId}/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable Integer gameId) {
        return ResponseEntity.ok(reviewService.getReviews(gameId));
    }

    @PostMapping
    public ResponseEntity<?> createReview(@PathVariable Integer gameId,
                                           @RequestBody ReviewRequest request,
                                           Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        var result = reviewService.createReview((Integer) auth.getPrincipal(), gameId, request);
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Rating debe ser 1-5"));
    }
}
