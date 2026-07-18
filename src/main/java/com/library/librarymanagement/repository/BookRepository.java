package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByTitleContainingIgnoreCase(String title);

    List<Book> findByAuthorContainingIgnoreCase(String author);

    List<Book> findByCategoryId(Long categoryId);

    List<Book> findByAvailable(Boolean available);

    long countByAvailable(Boolean available);

}