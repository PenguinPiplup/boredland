let counter = 0;

function addScore() {
    counter++;
    document.querySelector("#cookie_score").innerHTML = `Score: ${counter}`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#cookie").onclick = addScore;
});