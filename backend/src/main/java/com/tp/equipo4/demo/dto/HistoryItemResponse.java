package com.tp.equipo4.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoryItemResponse {
    private Integer gameId;
    private String title;
    private String genre;
    private String imageUrl;
    private BigDecimal price;
    private String publisher;
    private LocalDateTime purchasedAt;
    private boolean refunded;
    private Integer discount;
    private BigDecimal discountedPrice;
}
