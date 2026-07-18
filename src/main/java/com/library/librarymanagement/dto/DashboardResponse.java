package com.library.librarymanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardResponse {

    private long totalBooks;

    private long availableBooks;

    private long borrowedBooks;

    private long totalUsers;

    private long totalCategories;

}