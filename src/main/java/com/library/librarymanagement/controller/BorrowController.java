package com.library.librarymanagement.controller;

import com.library.librarymanagement.entity.Borrow;
import com.library.librarymanagement.service.BorrowService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/borrows")
public class BorrowController {

    private final BorrowService borrowService;


    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }


    @GetMapping
    public List<Borrow> getAllBorrows() {
        return borrowService.getAllBorrows();
    }


    @GetMapping("/{id}")
    public Borrow getBorrowById(@PathVariable Long id) {
        return borrowService.getBorrowById(id);
    }


    @PostMapping
    public Borrow createBorrow(@RequestBody Borrow borrow) {
        return borrowService.createBorrow(borrow);
    }


    @PutMapping("/{id}")
    public Borrow updateBorrow(@PathVariable Long id, @RequestBody Borrow borrow) {
        return borrowService.updateBorrow(id, borrow);
    }


    @DeleteMapping("/{id}")
    public void deleteBorrow(@PathVariable Long id) {
        borrowService.deleteBorrow(id);
    }
}