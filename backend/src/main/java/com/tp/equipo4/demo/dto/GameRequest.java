package com.tp.equipo4.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameRequest {
    private String title;
    private String description;
    private String genre;
    private BigDecimal price;
    private String imageUrl;
}
