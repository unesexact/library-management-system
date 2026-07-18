loadBooks();
loadCategories();

function loadBooks() {
    fetch("/books")
        .then(response => response.json())
        .then(books => {
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
<button class="btn btn-warning btn-sm me-2" onclick="editBook(${book.id})">Edit</button>
<button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
</td>
</tr>
`;
                tableBody.innerHTML += row;
            });
        })
        .catch(() => {
            showMessage("Cannot load books!", "danger");
        });
}

function loadCategories() {
    fetch("/categories")
        .then(response => response.json())
        .then(categories => {
            let select = document.getElementById("bookCategory");
            select.innerHTML = "";

            categories.forEach(category => {
                select.innerHTML += `<option value="${category.id}">${category.name}</option>`;
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
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
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
            showMessage("Cannot add book. ISBN may already exist!", "danger");
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

let selectedBookId = null;

function editBook(id) {
    fetch("/books/" + id)
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
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

function clearForm() {
    document.getElementById("bookTitle").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookIsbn").value = "";
    document.getElementById("bookYear").value = "";
    document.getElementById("bookAvailable").checked = true;
}

function updateBook() {
    let title = document.getElementById("bookTitle").value.trim();
    let author = document.getElementById("bookAuthor").value.trim();
    let isbn = document.getElementById("bookIsbn").value.trim();

    if (!title || !author || !isbn) {
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
            id: document.getElementById("bookCategory").value
        }
    };

    fetch("/books/" + selectedBookId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
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