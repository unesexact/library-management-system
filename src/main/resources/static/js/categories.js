loadCategories();


function loadCategories() {

    fetch("/categories")

        .then(response => response.json())

        .then(categories => {


            let tableBody = document.getElementById("categoryTableBody");


            tableBody.innerHTML = "";


            categories.forEach(category => {


                let row = `
<tr>

<td>${category.id}</td>

<td>${category.name}</td>

<td>${category.description}</td>

<td>

<button 
class="btn btn-warning btn-sm me-2"
onclick="editCategory(${category.id}, '${category.name}', '${category.description}')">

Edit

</button>


<button 
class="btn btn-danger btn-sm"
onclick="deleteCategory(${category.id})">

Delete

</button>

</td>

</tr>
`;


                tableBody.innerHTML += row;


            });


        });

}


function addCategory() {


    let name = document.getElementById("categoryName").value;


    let description = document.getElementById("categoryDescription").value;


    fetch("/categories", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },


        body: JSON.stringify({

            name: name,

            description: description

        })

    })


        .then(response => response.json())

        .then(() => {


            alert("Category added!");

            loadCategories();


        });


}

function deleteCategory(id) {


    if (!confirm("Delete this category?")) {
        return;
    }


    fetch("/categories/" + id, {

        method: "DELETE"

    })


        .then(() => {

            alert("Category deleted!");

            loadCategories();

        });


}

let selectedCategoryId = null;



function editCategory(id, name, description) {


    selectedCategoryId = id;


    document.getElementById("categoryName").value = name;

    document.getElementById("categoryDescription").value = description;


    document.getElementById("saveButton").innerText = "Update Category";

    document.getElementById("saveButton").onclick = updateCategory;

}




function updateCategory() {


    let name =
        document.getElementById("categoryName").value;


    let description =
        document.getElementById("categoryDescription").value;



    fetch("/categories/" + selectedCategoryId, {


        method: "PUT",


        headers: {

            "Content-Type": "application/json"

        },


        body: JSON.stringify({

            name: name,

            description: description

        })


    })


        .then(response => response.json())


        .then(() => {


            alert("Category updated!");


            selectedCategoryId = null;


            document.getElementById("saveButton").innerText = "Add Category";


            document.getElementById("saveButton").onclick = addCategory;


            document.getElementById("categoryName").value = "";

            document.getElementById("categoryDescription").value = "";


            loadCategories();


        });

}