document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#user_password").onkeyup = () => {
        document.querySelector("#password_strength").style.display = "block";
    }
});