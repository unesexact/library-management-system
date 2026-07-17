loadUsers();

let selectedUserId = null;

function loadUsers() {
    fetch("/users")
        .then(response => response.json())
        .then(users => {
            let tableBody = document.getElementById("userTableBody");
            tableBody.innerHTML = "";

            users.forEach(user => {
                let row = `
<tr>
<td>${user.id}</td>
<td>${user.username}</td>
<td>${user.fullName}</td>
<td>${user.role}</td>
<td>
<button class="btn btn-warning btn-sm me-2" onclick="editUser(${user.id})">Edit</button>
<button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
</td>
</tr>
`;
                tableBody.innerHTML += row;
            });
        });
}

function addUser() {
    let user = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        fullName: document.getElementById("fullName").value,
        role: document.getElementById("role").value
    };

    fetch("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(() => {
            alert("User added!");
            clearForm();
            loadUsers();
        });
}

function deleteUser(id) {
    if (!confirm("Delete this user?")) {
        return;
    }

    fetch("/users/" + id, {
        method: "DELETE"
    })
        .then(() => {
            alert("User deleted!");
            loadUsers();
        });
}

function editUser(id) {
    fetch("/users/" + id)
        .then(response => response.json())
        .then(user => {
            selectedUserId = id;
            document.getElementById("username").value = user.username;
            document.getElementById("password").value = user.password;
            document.getElementById("fullName").value = user.fullName;
            document.getElementById("role").value = user.role;
            document.getElementById("saveButton").innerText = "Update User";
            document.getElementById("saveButton").onclick = updateUser;
        });
}

function updateUser() {
    let user = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        fullName: document.getElementById("fullName").value,
        role: document.getElementById("role").value
    };

    fetch("/users/" + selectedUserId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(() => {
            alert("User updated!");
            selectedUserId = null;
            clearForm();
            document.getElementById("saveButton").innerText = "Add User";
            document.getElementById("saveButton").onclick = addUser;
            loadUsers();
        });
}

function clearForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("fullName").value = "";
    document.getElementById("role").value = "USER";
}