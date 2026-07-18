function showMessage(message, type = "success") {
    let alertBox = document.getElementById("messageBox");

    if (!alertBox) {
        alert(message);
        return;
    }

    alertBox.className = `alert alert-${type}`;
    alertBox.innerText = message;
    alertBox.style.display = "block";

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 3000);
}