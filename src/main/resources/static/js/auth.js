loadUserRole();

function loadUserRole() {
    fetch("/users/me")
        .then(response => response.json())
        .then(user => {
            if (user.role === "USER") {
                document.querySelectorAll(".admin-link")
                    .forEach(link => {
                        link.style.display = "none";
                    });
            }
        })
        .catch(error => {
            console.log("Not logged in");
        });
}