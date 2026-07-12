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

<td>
${book.available ? "Available" : "Not available"}
</td>


<td>


<button
class="btn btn-warning btn-sm me-2"
onclick="editBook(${book.id})">

Edit

</button>


<button
class="btn btn-danger btn-sm"
onclick="deleteBook(${book.id})">

Delete

</button>


</td>

</tr>
`;


                tableBody.innerHTML += row;


            });


        });

}


function loadCategories() {


    fetch("/categories")

        .then(response => response.json())

        .then(categories => {


            let select = document.getElementById("bookCategory");


            select.innerHTML = "";


            categories.forEach(category => {


                select.innerHTML += `

<option value="${category.id}">
${category.name}
</option>

`;

            });


        });


}


function addBook() {


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


    fetch("/books", {


        method: "POST",


        headers: {

            "Content-Type": "application/json"

        },


        body: JSON.stringify(book)


    })


        .then(response => response.json())


        .then(() => {


            alert("Book added!");


            clearForm();

            loadBooks();


        });


}


function deleteBook(id) {


    if (!confirm("Delete this book?")) {

        return;

    }


    fetch("/books/" + id, {


        method: "DELETE"


    })


        .then(() => {


            alert("Book deleted!");

            loadBooks();


        });


}

let selectedBookId = null;


function editBook(id) {


    fetch("/books/" + id)

        .then(response => response.json())

        .then(book => {


            selectedBookId = id;


            document.getElementById("bookTitle").value = book.title;


            document.getElementById("bookAuthor").value = book.author;


            document.getElementById("bookIsbn").value = book.isbn;


            document.getElementById("bookYear").value = book.publicationYear;


            document.getElementById("bookAvailable").checked = book.available;


            document.getElementById("bookCategory").value = book.category.id;


            document.getElementById("saveButton").innerText = "Update Book";


            document.getElementById("saveButton").onclick = updateBook;


        });


}


function clearForm() {


    document.getElementById("bookTitle").value = "";

    document.getElementById("bookAuthor").value = "";

    document.getElementById("bookIsbn").value = "";

    document.getElementById("bookYear").value = "";


}

function updateBook() {


    let book = {


        title:
        document.getElementById("bookTitle").value,


        author:
        document.getElementById("bookAuthor").value,


        isbn:
        document.getElementById("bookIsbn").value,


        publicationYear:
        document.getElementById("bookYear").value,


        available:
        document.getElementById("bookAvailable").checked,


        category: {

            id:
            document.getElementById("bookCategory").value

        }

    };



    fetch("/books/" + selectedBookId, {


        method:"PUT",


        headers:{

            "Content-Type":"application/json"

        },


        body:JSON.stringify(book)


    })


        .then(response=>response.json())


        .then(()=>{


            alert("Book updated!");


            selectedBookId = null;


            document.getElementById("saveButton").innerText =
                "Add Book";


            document.getElementById("saveButton").onclick =
                addBook;


            clearForm();


            loadBooks();


        });


}