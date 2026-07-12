loadUsers();

loadBooks();

loadBorrows();


function loadUsers() {


    fetch("/users")


        .then(response => response.json())


        .then(users => {


            let select = document.getElementById("borrowUser");


            select.innerHTML = "";


            users.forEach(user => {


                select.innerHTML += `

<option value="${user.id}">
${user.fullName}
</option>

`;


            });


        });


}


function loadBooks() {


    fetch("/books")


        .then(response => response.json())


        .then(books => {


            let select = document.getElementById("borrowBook");


            select.innerHTML = "";


            books.forEach(book => {


                let status = book.available ? "" : " (Unavailable)";


                select.innerHTML += `

<option value="${book.id}">

${book.title}${status}

</option>

`;


            });


        });


}


function loadBorrows() {


    fetch("/borrows")


        .then(response => response.json())


        .then(borrows => {


            let table = document.getElementById("borrowTableBody");


            table.innerHTML = "";


            borrows.forEach(borrow => {


                let status = borrow.returned ? "Returned" : "Borrowed";


                let action = borrow.returned ? "" : `
<button
class="btn btn-success btn-sm"
onclick="returnBook(${borrow.id})">

Return

</button>
`;


                table.innerHTML += `

<tr>

<td>${borrow.id}</td>

<td>${borrow.user.fullName}</td>

<td>${borrow.book.title}</td>

<td>${borrow.borrowDate}</td>

<td>${borrow.dueDate}</td>

<td>${status}</td>

<td>

${action}

<button
class="btn btn-danger btn-sm"
onclick="deleteBorrow(${borrow.id})">

Delete

</button>

</td>

</tr>

`;


            });


        });


}


function borrowBook() {


    let userId = document.getElementById("borrowUser").value;


    let bookId = document.getElementById("borrowBook").value;


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


            alert("Book borrowed!");


            loadBooks();

            loadBorrows();


        });


}


function returnBook(id) {


    fetch(`/borrows/${id}/return`, {


        method: "PUT"


    })


        .then(response => response.json())


        .then(() => {


            alert("Book returned!");


            loadBooks();

            loadBorrows();


        });


}


function deleteBorrow(id) {


    if (!confirm("Delete this borrow?")) {

        return;

    }


    fetch(`/borrows/${id}`, {


        method: "DELETE"


    })


        .then(() => {


            alert("Borrow deleted!");


            loadBorrows();


        });


}