package com.tp.equipo4.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportItem {
    private String gameTitle;
    private String buyerUsername;
    private LocalDateTime purchasedAt;
    private BigDecimal price;
    private BigDecimal discountedPrice;
    private boolean refunded;
}
