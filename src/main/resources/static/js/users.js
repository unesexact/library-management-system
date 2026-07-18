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
        })
        .catch(() => {
            showMessage("Cannot load users!", "danger");
        });
}

function addUser() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let fullName = document.getElementById("fullName").value.trim();
    let role = document.getElementById("role").value;

    if (!username || !password || !fullName) {
        showMessage("Please fill all user fields!", "warning");
        return;
    }

    if (password.length < 6) {
        showMessage("Password must be at least 6 characters!", "warning");
        return;
    }

    let user = {
        username: username, password: password, fullName: fullName, role: role
    };

    fetch("/users", {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify(user)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(() => {
            showMessage("User added successfully!", "success");
            clearForm();
            loadUsers();
        })
        .catch(() => {
            showMessage("Cannot add user. Username may already exist!", "danger");
        });
}

function deleteUser(id) {
    if (!confirm("Delete this user?")) {
        return;
    }

    fetch("/users/" + id, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
        })
        .then(() => {
            showMessage("User deleted successfully!", "success");
            loadUsers();
        })
        .catch(() => {
            showMessage("Cannot delete user!", "danger");
        });
}

function editUser(id) {
    fetch("/users/" + id)
        .then(response => response.json())
        .then(user => {
            selectedUserId = id;
            document.getElementById("username").value = user.username;
            // Do not show password
            document.getElementById("password").value = "";
            document.getElementById("fullName").value = user.fullName;
            document.getElementById("role").value = user.role;
            document.getElementById("saveButton").innerText = "Update User";
            document.getElementById("saveButton").onclick = updateUser;
        });
}

function updateUser() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let fullName = document.getElementById("fullName").value.trim();
    let role = document.getElementById("role").value;

    if (!username || !fullName) {
        showMessage("Username and full name are required!", "warning");
        return;
    }

    let user = {
        username: username, fullName: fullName, role: role
    };

    if (password !== "") {
        if (password.length < 6) {
            showMessage("Password must be at least 6 characters!", "warning");
            return;
        }

        user.password = password;
    }

    fetch("/users/" + selectedUserId, {
        method: "PUT", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify(user)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(() => {
            showMessage("User updated successfully!", "success");

            selectedUserId = null;
            clearForm();

            document.getElementById("saveButton").innerText = "Add User";
            document.getElementById("saveButton").onclick = addUser;

            loadUsers();
        })
        .catch(() => {
            showMessage("Cannot update user!", "danger");
        });
}

function clearForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("fullName").value = "";
    document.getElementById("role").value = "USER";
}