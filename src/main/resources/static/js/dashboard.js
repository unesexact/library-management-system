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


            fetch("/dashboard")
                .then(response => {
                    if (!response.ok) {
                        throw new Error();
                    }
                    return response.json();
                })
                .then(data => {


                    if (user.role === "ADMIN") {

                        document.getElementById("adminDashboard").style.display = "block";

                        document.getElementById("bookCount").innerText = data.totalBooks;

                        document.getElementById("userCount").innerText = data.totalUsers;

                        document.getElementById("categoryCount").innerText = data.totalCategories;

                        document.getElementById("borrowCount").innerText = data.borrowedBooks;


                    } else {


                        document.getElementById("userDashboard").style.display = "block";

                        document.getElementById("availableBooks").innerText = data.availableBooks;

                        document.getElementById("myBorrowCount").innerText = data.myBorrows;

                    }

                });

        })
        .catch(() => {

            showMessage("Cannot load dashboard!", "danger");

        });

}


loadDashboard();