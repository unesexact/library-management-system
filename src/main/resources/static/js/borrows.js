let currentRole = null;

fetch("/users/me")
    .then(response => response.json())
    .then(user => {
        currentRole = user.role;

        if (currentRole === "ADMIN") {
            loadUsers();
            loadBooks();
        } else {
            document.querySelector(".admin-column").style.display = "none";
            let adminBox = document.querySelector(".admin-only");
            if (adminBox) {
                adminBox.style.display = "none";
            }
        }

        loadBorrows();
    })
    .catch(() => {
        showMessage("Cannot load user information!", "danger");
    });

function loadUsers() {
    fetch("/users")
        .then(response => response.json())
        .then(users => {
            let select = document.getElementById("borrowUser");
            select.innerHTML = "";

            users.forEach(user => {
                select.innerHTML += `<option value="${user.id}">${user.fullName}</option>`;
            });
        })
        .catch(() => {
            showMessage("Cannot load users!", "danger");
        });
}

function loadBooks() {
    fetch("/books")
        .then(response => response.json())
        .then(books => {
            let select = document.getElementById("borrowBook");
            select.innerHTML = "";

            let availableBooks = books.filter(book => book.available);

            if (availableBooks.length === 0) {
                select.innerHTML = `<option value="">No available books</option>`;
                return;
            }

            availableBooks.forEach(book => {
                select.innerHTML += `<option value="${book.id}">${book.title}</option>`;
            });
        })
        .catch(() => {
            showMessage("Cannot load books!", "danger");
        });
}

function loadBorrows() {
    let url = currentRole === "ADMIN"
        ? "/borrows"
        : "/borrows/my";

    fetch(url)
        .then(response => response.json())
        .then(borrows => {
            let table = document.getElementById("borrowTableBody");
            table.innerHTML = "";

            borrows.forEach(borrow => {
                let status = borrow.returned ? "Returned" : "Borrowed";
                let action = "";

                if (currentRole === "ADMIN" && !borrow.returned) {
                    action += `<button class="btn btn-success btn-sm me-2" onclick="returnBook(${borrow.id})">Return</button>`;
                }

                if (currentRole === "ADMIN") {
                    action += `<button class="btn btn-danger btn-sm" onclick="deleteBorrow(${borrow.id})">Delete</button>`;
                }

                let userColumn = currentRole === "ADMIN"
                    ? `<td>${borrow.user.fullName}</td>`
                    : "";

                table.innerHTML += `<tr>
<td>${borrow.id}</td>
${userColumn}
<td>${borrow.book.title}</td>
<td>${borrow.borrowDate}</td>
<td>${borrow.dueDate}</td>
<td>${status}</td>
<td>${action}</td>
</tr>`;
            });
        })
        .catch(() => {
            showMessage("Cannot load borrows!", "danger");
        });
}

function borrowBook() {
    if (currentRole !== "ADMIN") {
        showMessage("Only admins can borrow books!", "warning");
        return;
    }

    let userId = document.getElementById("borrowUser").value;
    let bookId = document.getElementById("borrowBook").value;

    if (!userId || !bookId) {
        showMessage("Please select user and book!", "warning");
        return;
    }

    fetch(`/borrows/${userId}/${bookId}`, {
        method: "POST"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(() => {
            showMessage("Book borrowed successfully!", "success");
            loadBooks();
            loadBorrows();
        })
        .catch(() => {
            showMessage("Cannot borrow this book!", "danger");
        });
}

function returnBook(id) {
    fetch(`/borrows/${id}/return`, {
        method: "PUT"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(() => {
            showMessage("Book returned successfully!", "success");
            loadBooks();
            loadBorrows();
        })
        .catch(() => {
            showMessage("Cannot return book!", "danger");
        });
}

function deleteBorrow(id) {
    if (!confirm("Delete this borrow?")) {
        return;
    }

    fetch(`/borrows/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
        })
        .then(() => {
            showMessage("Borrow deleted successfully!", "success");
            loadBorrows();
        })
        .catch(() => {
            showMessage("Cannot delete borrow!", "danger");
        });
}