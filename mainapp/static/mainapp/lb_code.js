document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#replay2").onclick = mainpage_redirect;
    document.querySelector("#my_score").onclick = show_my_score;
    document.querySelector("#replay3").onclick = mainpage_redirect;
    document.querySelector("#global_score").onclick = show_global_score;
})

function mainpage_redirect() {
    window.location.href = "redirect/";
}

function show_my_score() {
    document.querySelector("#lb_page_1").style.display = "none";
    document.querySelector("#lb_page_2").style.display = "block";
}

function show_global_score() {
    document.querySelector("#lb_page_1").style.display = "block";
    document.querySelector("#lb_page_2").style.display = "none";
}