loadDashboard();

function loadDashboard() {
    fetch("/users/me")
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(user => {
            document.getElementById("welcomeMessage").innerText = "Welcome, " + user.fullName;

            if (user.role === "ADMIN") {
                loadAdminDashboard();
            } else {
                loadUserDashboard(user.id);
            }
        })
        .catch(() => {
            showMessage("Cannot load dashboard!", "danger");
        });
}

function loadAdminDashboard() {
    document.getElementById("adminDashboard").style.display = "block";

    fetch("/books")
        .then(res => res.json())
        .then(books => {
            document.getElementById("bookCount").innerText = books.length;
        })
        .catch(() => {
            showMessage("Cannot load books count!", "danger");
        });

    fetch("/users")
        .then(res => res.json())
        .then(users => {
            document.getElementById("userCount").innerText = users.length;
        })
        .catch(() => {
            showMessage("Cannot load users count!", "danger");
        });

    fetch("/categories")
        .then(res => res.json())
        .then(categories => {
            document.getElementById("categoryCount").innerText = categories.length;
        })
        .catch(() => {
            showMessage("Cannot load categories count!", "danger");
        });

    fetch("/borrows")
        .then(res => res.json())
        .then(borrows => {
            let active = borrows.filter(borrow => !borrow.returned);
            document.getElementById("borrowCount").innerText = active.length;
        })
        .catch(() => {
            showMessage("Cannot load borrows count!", "danger");
        });
}

function loadUserDashboard(userId) {
    document.getElementById("userDashboard").style.display = "block";

    fetch("/books")
        .then(res => res.json())
        .then(books => {
            let available = books.filter(book => book.available);
            document.getElementById("availableBooks").innerText = available.length;
        })
        .catch(() => {
            showMessage("Cannot load available books!", "danger");
        });

    fetch("/borrows")
        .then(res => res.json())
        .then(borrows => {
            let myBorrows = borrows.filter(borrow => borrow.user.id === userId);
            document.getElementById("myBorrowCount").innerText = myBorrows.length;
        })
        .catch(() => {
            showMessage("Cannot load your borrows!", "danger");
        });
}