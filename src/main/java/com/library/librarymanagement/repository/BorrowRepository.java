package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.Borrow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowRepository extends JpaRepository<Borrow, Long> {
    List<Borrow> findByUserUsername(String username);
    List<Borrow> findByReturned(Boolean returned);
}