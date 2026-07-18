package com.library.librarymanagement.controller;

import com.library.librarymanagement.entity.Borrow;
import com.library.librarymanagement.service.BorrowService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/borrows")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }


    // ADMIN ONLY - see all borrow history
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Borrow> getAllBorrows() {
        return borrowService.getAllBorrows();
    }


    // USER + ADMIN - see own history
    @GetMapping("/my")
    public List<Borrow> getMyBorrows(Authentication authentication) {

        String username = authentication.getName();

        return borrowService.getMyBorrows(username);
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Borrow getBorrowById(@PathVariable Long id) {
        return borrowService.getBorrowById(id);
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Borrow createBorrow(@Valid @RequestBody Borrow borrow) {
        return borrowService.createBorrow(borrow);
    }


    @PostMapping("/{userId}/{bookId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Borrow borrowBook(
            @PathVariable Long userId,
            @PathVariable Long bookId
    ) {
        return borrowService.borrowBook(userId, bookId);
    }


    @PutMapping("/{id}/return")
    @PreAuthorize("hasRole('ADMIN')")
    public Borrow returnBook(@PathVariable Long id) {
        return borrowService.returnBook(id);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBorrow(@PathVariable Long id) {
        borrowService.deleteBorrow(id);
    }
}