package com.tp.equipo4.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LibraryItemResponse {
    private Integer gameId;
    private String title;
    private String genre;
    private String imageUrl;
    private String downloadUrl;
    private String publisher;
    private LocalDateTime purchasedAt;
    private boolean installed;
    private boolean favorite;
}
