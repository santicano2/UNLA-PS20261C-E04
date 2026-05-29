package com.tp.equipo4.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameResponse {
    private Integer id;
    private String title;
    private String description;
    private String genre;
    private BigDecimal price;
    private String imageUrl;
    private String publisher;
    private LocalDateTime createdAt;
    private Integer discount;
    private BigDecimal discountedPrice;
}
