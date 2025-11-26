package com.projetee.sallesmangement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String asin;

    @NotBlank
    private String title;

    @NotNull
    private Double price;

    private Double rating;

    private Integer reviewCount;

    private Integer rank;

    @ManyToOne(optional = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<LigneVente> lignesVente;
}
