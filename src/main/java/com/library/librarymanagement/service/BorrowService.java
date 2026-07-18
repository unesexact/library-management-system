package com.library.librarymanagement.service;

import com.library.librarymanagement.entity.Borrow;

import java.util.List;

public interface BorrowService {

    Borrow createBorrow(Borrow borrow);

    List<Borrow> getAllBorrows();

    Borrow getBorrowById(Long id);

    Borrow updateBorrow(Long id, Borrow borrow);

    void deleteBorrow(Long id);

    Borrow borrowBook(Long userId, Long bookId);

    Borrow returnBook(Long borrowId);

    List<Borrow> getMyBorrows(String username);

}