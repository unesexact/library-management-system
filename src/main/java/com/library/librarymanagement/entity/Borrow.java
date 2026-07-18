package com.library.librarymanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "borrows")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Borrow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Borrow date is required")
    @Column(nullable = false)
    private LocalDate borrowDate;

    @NotNull(message = "Due date is required")
    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate returnDate;

    @Column(nullable = false)
    private Boolean returned = false;

    @NotNull(message = "User is required")
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull(message = "Book is required")
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;
}