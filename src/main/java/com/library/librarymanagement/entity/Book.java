package com.library.librarymanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Author is required")
    @Column(nullable = false)
    private String author;

    @NotBlank(message = "ISBN is required")
    @Size(min = 10, max = 20, message = "ISBN must be between 10 and 20 characters")
    @Column(nullable = false, unique = true)
    private String isbn;

    @NotNull(message = "Publication year is required")
    @Positive(message = "Publication year must be positive")
    private Integer publicationYear;

    @Column(nullable = false)
    private Boolean available = true;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "book")
    @JsonIgnore
    private List<Borrow> borrowHistory = new ArrayList<>();
}