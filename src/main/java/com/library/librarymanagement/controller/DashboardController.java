package com.library.librarymanagement.controller;


import com.library.librarymanagement.dto.DashboardResponse;
import com.library.librarymanagement.repository.*;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/dashboard")
public class DashboardController {


    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BorrowRepository borrowRepository;


    public DashboardController(BookRepository bookRepository, UserRepository userRepository, CategoryRepository categoryRepository, BorrowRepository borrowRepository) {

        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.borrowRepository = borrowRepository;

    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardResponse getDashboard() {


        long totalBooks = bookRepository.count();


        long availableBooks = bookRepository.findByAvailable(true).size();


        long borrowedBooks = borrowRepository.findByReturned(false).size();


        long users = userRepository.count();


        long categories = categoryRepository.count();


        return new DashboardResponse(totalBooks, availableBooks, borrowedBooks, users, categories);

    }

}