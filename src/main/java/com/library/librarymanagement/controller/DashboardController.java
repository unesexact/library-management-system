package com.library.librarymanagement.controller;


import com.library.librarymanagement.dto.DashboardResponse;
import com.library.librarymanagement.repository.*;
import com.library.librarymanagement.service.BorrowService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/dashboard")
public class DashboardController {


    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BorrowRepository borrowRepository;
    private final BorrowService borrowService;


    public DashboardController(
            BookRepository bookRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            BorrowRepository borrowRepository,
            BorrowService borrowService
    ) {

        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.borrowRepository = borrowRepository;
        this.borrowService = borrowService;

    }


    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public DashboardResponse getDashboard(Authentication authentication) {


        long totalBooks = bookRepository.count();

        long availableBooks = bookRepository.countByAvailable(true);

        long borrowedBooks = borrowRepository.countByReturned(false);

        long users = userRepository.count();

        long categories = categoryRepository.count();


        long myBorrows = borrowService
                .getMyBorrows(authentication.getName())
                .size();


        return new DashboardResponse(
                totalBooks,
                availableBooks,
                borrowedBooks,
                users,
                categories,
                myBorrows
        );

    }

}