function loadAdminDashboard(){

    document.getElementById("adminDashboard").style.display="block";


    fetch("/dashboard")

        .then(res=>res.json())

        .then(data=>{


            document.getElementById("bookCount").innerText=data.totalBooks;

            document.getElementById("userCount").innerText=data.totalUsers;

            document.getElementById("categoryCount").innerText=data.totalCategories;

            document.getElementById("borrowCount").innerText=data.borrowedBooks;


        })


        .catch(()=>{

            showMessage("Cannot load dashboard!","danger");

        });


}