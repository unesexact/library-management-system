package com.library.librarymanagement.controller;

import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.service.BookService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }


    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }


    // Search must be before /{id}
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public List<Book> searchBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean available
    ) {

        return bookService.searchBooks(
                title,
                author,
                categoryId,
                available
        );
    }


    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Book getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Book createBook(@Valid @RequestBody Book book) {
        return bookService.createBook(book);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Book updateBook(
            @PathVariable Long id,
            @Valid @RequestBody Book book
    ) {
        return bookService.updateBook(id, book);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

}