package com.tp.equipo4.demo.service;

import com.tp.equipo4.demo.dto.ReviewRequest;
import com.tp.equipo4.demo.dto.ReviewResponse;
import com.tp.equipo4.demo.entity.Review;
import com.tp.equipo4.demo.repository.GameRepository;
import com.tp.equipo4.demo.repository.PurchaseRepository;
import com.tp.equipo4.demo.repository.ReviewRepository;
import com.tp.equipo4.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    public List<ReviewResponse> getReviews(Integer gameId) {
        return reviewRepository.findByGameIdOrderByCreatedAtDesc(gameId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<ReviewResponse> createReview(Integer userId, Integer gameId, ReviewRequest request) {
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            return Optional.empty();
        }
        if (!purchaseRepository.existsByUserIdAndGameIdAndRefundedFalse(userId, gameId)) {
            return Optional.empty();
        }
        var userOpt = userRepository.findById(userId);
        var gameOpt = gameRepository.findById(gameId);
        if (userOpt.isEmpty() || gameOpt.isEmpty()) return Optional.empty();

        Review review = new Review();
        review.setUser(userOpt.get());
        review.setGame(gameOpt.get());
        review.setRating(request.getRating());
        review.setContent(request.getContent());
        return Optional.of(toResponse(reviewRepository.save(review)));
    }

    private ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getUser().getId(),
                review.getUser().getUsername(),
                review.getRating(),
                review.getContent(),
                review.getCreatedAt()
        );
    }
}
