package com.library.librarymanagement.service.impl;

import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.service.BookService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
    }

    @Override
    public Book updateBook(Long id, Book book) {

        Book existingBook = getBookById(id);

        existingBook.setTitle(book.getTitle());
        existingBook.setAuthor(book.getAuthor());
        existingBook.setIsbn(book.getIsbn());
        existingBook.setPublicationYear(book.getPublicationYear());
        existingBook.setAvailable(book.getAvailable());
        existingBook.setCategory(book.getCategory());

        return bookRepository.save(existingBook);
    }

    @Override
    public void deleteBook(Long id) {
        Book book = getBookById(id);
        bookRepository.delete(book);
    }


    @Override
    public List<Book> searchBooks(String title, String author, Long categoryId, Boolean available) {

        List<Book> books = bookRepository.findAll();


        if (title != null && !title.isBlank()) {
            books = books.stream().filter(book -> book.getTitle().toLowerCase().contains(title.toLowerCase())).collect(Collectors.toList());
        }


        if (author != null && !author.isBlank()) {
            books = books.stream().filter(book -> book.getAuthor().toLowerCase().contains(author.toLowerCase())).collect(Collectors.toList());
        }


        if (categoryId != null) {
            books = books.stream().filter(book -> book.getCategory().getId().equals(categoryId)).collect(Collectors.toList());
        }


        if (available != null) {
            books = books.stream().filter(book -> book.getAvailable().equals(available)).collect(Collectors.toList());
        }


        return books;
    }
}