package com.tp.equipo4.demo.repository;

import com.tp.equipo4.demo.entity.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Integer> {
    List<Friend> findByUserId(Integer userId);
    Optional<Friend> findByUserIdAndFriendId(Integer userId, Integer friendId);
    boolean existsByUserIdAndFriendId(Integer userId, Integer friendId);
    void deleteByUserIdAndFriendId(Integer userId, Integer friendId);
}
