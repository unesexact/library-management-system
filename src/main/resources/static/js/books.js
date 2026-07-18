let currentRole = null;
let selectedBookId = null;

loadUserRole();

function loadUserRole() {

    fetch("/users/me")
        .then(response => response.json())
        .then(user => {

            currentRole = user.role;

            if (currentRole !== "ADMIN") {

                let addBookCard = document.querySelector(".card.mt-4");

                if (addBookCard) {
                    addBookCard.style.display = "none";
                }

            }

            loadBooks();
            loadCategories();

        })
        .catch(() => {

            showMessage("Cannot load user information!", "danger");

            loadBooks();
            loadCategories();

        });

}

function loadBooks() {
    fetch("/books")
        .then(response => response.json())
        .then(books => {
            displayBooks(books);
        })
        .catch(() => {
            showMessage("Cannot load books!", "danger");
        });
}

function displayBooks(books) {
    let tableBody = document.getElementById("bookTableBody");
    tableBody.innerHTML = "";

    books.forEach(book => {
        let row = `
<tr>
<td>${book.id}</td>
<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.isbn}</td>
<td>${book.publicationYear ?? ""}</td>
<td>${book.category ? book.category.name : "No category"}</td>
<td>${book.available ? "Available" : "Not available"}</td>
<td>

${currentRole === "ADMIN" ? `
<button class="btn btn-warning btn-sm me-2" onclick="editBook(${book.id})">Edit</button>
<button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
` : ""}

</td>
</tr>
`;
        tableBody.innerHTML += row;
    });
}

function searchBooks() {
    let title = document.getElementById("searchTitle").value.trim();
    let author = document.getElementById("searchAuthor").value.trim();
    let categoryId = document.getElementById("searchCategory").value;
    let available = document.getElementById("searchAvailable").value;

    let params = new URLSearchParams();

    if (title) {
        params.append("title", title);
    }

    if (author) {
        params.append("author", author);
    }

    if (categoryId) {
        params.append("categoryId", categoryId);
    }

    if (available !== "") {
        params.append("available", available);
    }

    let url = "/books/search";

    if (params.toString()) {
        url += "?" + params.toString();
    }

    fetch(url)
        .then(response => response.json())
        .then(books => {
            displayBooks(books);
        })
        .catch(() => {
            showMessage("Cannot search books!", "danger");
        });
}

function loadCategories() {
    fetch("/categories")
        .then(response => response.json())
        .then(categories => {

            let bookCategory = document.getElementById("bookCategory");
            let searchCategory = document.getElementById("searchCategory");

            searchCategory.innerHTML = `<option value="">All Categories</option>`;

            if (bookCategory) {
                bookCategory.innerHTML = "";
            }

            categories.forEach(category => {

                if (bookCategory) {
                    bookCategory.innerHTML += `<option value="${category.id}">${category.name}</option>`;
                }

                searchCategory.innerHTML += `<option value="${category.id}">${category.name}</option>`;
            });

        })
        .catch(() => {
            showMessage("Cannot load categories!", "danger");
        });
}

function addBook() {
    let title = document.getElementById("bookTitle").value.trim();
    let author = document.getElementById("bookAuthor").value.trim();
    let isbn = document.getElementById("bookIsbn").value.trim();
    let category = document.getElementById("bookCategory").value;

    if (!title || !author || !isbn || !category) {
        showMessage("Please fill all book fields!", "warning");
        return;
    }

    let book = {
        title: title,
        author: author,
        isbn: isbn,
        publicationYear: document.getElementById("bookYear").value,
        available: document.getElementById("bookAvailable").checked,
        category: {
            id: category
        }
    };

    fetch("/books", {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify(book)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(() => {
            showMessage("Book added successfully!", "success");
            clearForm();
            loadBooks();
        })
        .catch(() => {
            showMessage("Cannot add book!", "danger");
        });
}

function deleteBook(id) {
    if (!confirm("Delete this book?")) {
        return;
    }

    fetch("/books/" + id, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
        })
        .then(() => {
            showMessage("Book deleted successfully!", "success");
            loadBooks();
        })
        .catch(() => {
            showMessage("Cannot delete book!", "danger");
        });
}

function editBook(id) {
    fetch("/books/" + id)
        .then(response => response.json())
        .then(book => {
            selectedBookId = id;

            document.getElementById("bookTitle").value = book.title;
            document.getElementById("bookAuthor").value = book.author;
            document.getElementById("bookIsbn").value = book.isbn;
            document.getElementById("bookYear").value = book.publicationYear ?? "";
            document.getElementById("bookAvailable").checked = book.available;

            if (book.category) {
                document.getElementById("bookCategory").value = book.category.id;
            }

            document.getElementById("saveButton").innerText = "Update Book";
            document.getElementById("saveButton").onclick = updateBook;
        })
        .catch(() => {
            showMessage("Cannot load book details!", "danger");
        });
}

function updateBook() {
    let book = {
        title: document.getElementById("bookTitle").value,
        author: document.getElementById("bookAuthor").value,
        isbn: document.getElementById("bookIsbn").value,
        publicationYear: document.getElementById("bookYear").value,
        available: document.getElementById("bookAvailable").checked,
        category: {
            id: document.getElementById("bookCategory").value
        }
    };

    fetch("/books/" + selectedBookId, {
        method: "PUT", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify(book)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(() => {
            showMessage("Book updated successfully!", "success");
            selectedBookId = null;
            document.getElementById("saveButton").innerText = "Add Book";
            document.getElementById("saveButton").onclick = addBook;
            clearForm();
            loadBooks();
        })
        .catch(() => {
            showMessage("Cannot update book!", "danger");
        });
}

function clearForm() {
    document.getElementById("bookTitle").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookIsbn").value = "";
    document.getElementById("bookYear").value = "";
    document.getElementById("bookAvailable").checked = true;
}