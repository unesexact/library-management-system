loadDashboard();


function loadDashboard() {

    fetch("/users/me")

        .then(response => response.json())

        .then(user => {


            document.getElementById("welcomeMessage").innerText = "Welcome, " + user.fullName;


            if (user.role === "ADMIN") {

                loadAdminDashboard();

            } else {

                loadUserDashboard(user.id);

            }


        });

}


function loadAdminDashboard() {


    document.getElementById("adminDashboard").style.display = "block";


    fetch("/books")
        .then(res => res.json())
        .then(books => {

            document.getElementById("bookCount").innerText = books.length;

        });


    fetch("/users")
        .then(res => res.json())
        .then(users => {

            document.getElementById("userCount").innerText = users.length;

        });


    fetch("/categories")
        .then(res => res.json())
        .then(categories => {

            document.getElementById("categoryCount").innerText = categories.length;

        });


    fetch("/borrows")
        .then(res => res.json())
        .then(borrows => {


            let active = borrows.filter(borrow => borrow.returned === false);


            document.getElementById("borrowCount").innerText = active.length;

        });


}


function loadUserDashboard(userId) {


    document.getElementById("userDashboard").style.display = "block";


    fetch("/books")
        .then(res => res.json())
        .then(books => {


            let available = books.filter(book => book.available === true);


            document.getElementById("availableBooks").innerText = available.length;


        });


    fetch("/borrows")
        .then(res => res.json())
        .then(borrows => {


            let myBorrows = borrows.filter(borrow => borrow.user.id === userId);


            document.getElementById("myBorrowCount").innerText = myBorrows.length;


        });

}