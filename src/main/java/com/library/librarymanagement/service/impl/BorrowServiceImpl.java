package com.library.librarymanagement.service.impl;

import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.entity.Borrow;
import com.library.librarymanagement.entity.User;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.repository.BorrowRepository;
import com.library.librarymanagement.repository.UserRepository;
import com.library.librarymanagement.service.BorrowService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowServiceImpl implements BorrowService {

    private final BorrowRepository borrowRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BorrowServiceImpl(BorrowRepository borrowRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.borrowRepository = borrowRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Borrow createBorrow(Borrow borrow) {
        return borrowRepository.save(borrow);
    }

    @Override
    public List<Borrow> getAllBorrows() {
        return borrowRepository.findAll();
    }

    @Override
    public Borrow getBorrowById(Long id) {
        return borrowRepository.findById(id).orElseThrow(() -> new RuntimeException("Borrow not found"));
    }

    @Override
    public Borrow updateBorrow(Long id, Borrow borrow) {
        Borrow existingBorrow = getBorrowById(id);

        existingBorrow.setBorrowDate(borrow.getBorrowDate());
        existingBorrow.setDueDate(borrow.getDueDate());
        existingBorrow.setReturnDate(borrow.getReturnDate());
        existingBorrow.setReturned(borrow.getReturned());

        return borrowRepository.save(existingBorrow);
    }

    @Transactional
    @Override
    public void deleteBorrow(Long id) {
        Borrow borrow = getBorrowById(id);
        borrowRepository.delete(borrow);
    }

    @Transactional
    @Override
    public Borrow borrowBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (Boolean.FALSE.equals(book.getAvailable())) {
            throw new RuntimeException("Book is already borrowed");
        }

        Borrow borrow = new Borrow();

        borrow.setUser(user);
        borrow.setBook(book);
        borrow.setBorrowDate(LocalDate.now());
        borrow.setDueDate(LocalDate.now().plusDays(14));
        borrow.setReturned(false);

        book.setAvailable(false);
        bookRepository.save(book);

        return borrowRepository.save(borrow);
    }

    @Transactional
    @Override
    public Borrow returnBook(Long borrowId) {
        Borrow borrow = getBorrowById(borrowId);

        if (borrow.getReturned()) {
            throw new RuntimeException("Book already returned");
        }

        borrow.setReturned(true);
        borrow.setReturnDate(LocalDate.now());

        Book book = borrow.getBook();
        book.setAvailable(true);
        bookRepository.save(book);

        return borrowRepository.save(borrow);
    }

    @Override
    public List<Borrow> getMyBorrows(String username) {
        return borrowRepository.findByUserUsername(username);
    }

}