let counter = 0;

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#start_game").onclick = startGame;
    document.querySelector("#cookie").onclick = addScore;
})


function startGame() {

    // Hide instructions
    document.querySelector("#cookie_instructions").style.display = "none";

    // Display game interface and provide functionality for stop_game button
    document.querySelector("#cookie_game_interface").style.display = "block";
    document.querySelector("#cookie_other_buttons").style.display = "block";
    document.querySelector("#stop_game").onclick = stopGame;
}


function addScore() {
    // Add 1 to score and display new score
    counter++;
    document.querySelector("#cookie_score").innerHTML = `Score: ${counter}`;

    // Display popup message
    if (counter == 10) {
        let popup = document.querySelector("#cookie_game_popup")
        popup.innerHTML = "You're getting the hang of it!";
        popup.style.color = "palevioletred";
        popup.style.display = "block";
    }
    else if (counter % 25 == 0) {
        let popup = document.querySelector("#cookie_game_popup");

        if (counter == 25) {
            popup.innerHTML = "You're doing great!";
            popup.style.color = "purple";
        }
        else if (counter == 50) {
            popup.innerHTML = "Halfway to 100! Keep it up!";
            popup.style.color = "brown";
        }
        else if (counter == 75) {
            popup.innerHTML = "Almost at 100! Keep it up!";
            popup.style.color = "darkgreen";
        }
        else if (counter % 100 == 0) {
            popup.innerHTML = `${counter}!`;
            popup.style.color = "goldenrod";
        }
        else if (counter % 100 == 50) {
            popup.innerHTML = `${counter}!`;
            popup.style.color = "red";
        }
    } 
}


function stopGame() {
    // Save user's score to database
    csrf_token = document.getElementById("csrf_token").value
    fetch('http://127.0.0.1:8000/save_score/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({
            game_name: "cookieclicker",
            score: counter
        })
    })
    .then(response => {
        console.log(response);
    }); 

    // Disable existing buttons
    document.querySelector("#cookie").onclick = () => {};
    document.querySelector("#stop_game").onclick = () => {};

    // Enable the relevant buttons
    document.querySelector("#cookie_other_buttons_2").style.display = "block";
    document.querySelector("#replay").onclick = replay;
    document.querySelector("#leaderboards").onclick = leaderboards;

    // Change user interface
    document.querySelector("#cookie_score").innerHTML = `Final Score: ${counter}`;
    document.querySelector("#cookie_other_buttons").style.display = "none";
}


function replay() {
    window.location.href = window.location.href;
}


function leaderboards() {
    window.location.href = "leaderboards/"
}
