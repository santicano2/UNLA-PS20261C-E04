package com.tp.equipo4.demo.service;

import com.tp.equipo4.demo.dto.FriendResponse;
import com.tp.equipo4.demo.entity.Friend;
import com.tp.equipo4.demo.entity.User;
import com.tp.equipo4.demo.repository.FriendRepository;
import com.tp.equipo4.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendService {

    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private UserRepository userRepository;

    public List<FriendResponse> getFriends(Integer userId) {
        return friendRepository.findByUserId(userId).stream()
                .map(f -> new FriendResponse(f.getFriend().getId(), f.getFriend().getUsername(), f.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<FriendResponse> addFriend(Integer userId, Integer friendId) {
        if (userId.equals(friendId)) return Optional.empty();
        if (friendRepository.existsByUserIdAndFriendId(userId, friendId)) return Optional.empty();
        var userOpt = userRepository.findById(userId);
        var friendOpt = userRepository.findById(friendId);
        if (userOpt.isEmpty() || friendOpt.isEmpty()) return Optional.empty();

        Friend f1 = new Friend();
        f1.setUser(userOpt.get());
        f1.setFriend(friendOpt.get());
        friendRepository.save(f1);

        if (!friendRepository.existsByUserIdAndFriendId(friendId, userId)) {
            Friend f2 = new Friend();
            f2.setUser(friendOpt.get());
            f2.setFriend(userOpt.get());
            friendRepository.save(f2);
        }

        return Optional.of(new FriendResponse(friendOpt.get().getId(), friendOpt.get().getUsername(), f1.getCreatedAt()));
    }

    @Transactional
    public boolean removeFriend(Integer userId, Integer friendId) {
        if (!friendRepository.existsByUserIdAndFriendId(userId, friendId)) return false;
        friendRepository.deleteByUserIdAndFriendId(userId, friendId);
        friendRepository.deleteByUserIdAndFriendId(friendId, userId);
        return true;
    }
}
