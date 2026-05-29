package com.tp.equipo4.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class FriendResponse {
    private Integer id;
    private String username;
    private LocalDateTime createdAt;
}
