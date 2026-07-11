package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.Borrow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowRepository extends JpaRepository<Borrow, Long> {

}