let score = 0;
let correct_guesses = 0;
let level = 1;
let game_stopped = false;

// Used to determine the range and hidden number
/*  Level 1: 0 to 100 (10 guesses)
    Level 2: 0 to 300 (11 guesses)
    Level 3: 0 to 1000 (12 guesses)
    Level 4: 0 to 4000 (13 guesses)
    Level 5: 0 to 10000 (14 guesses)
    Level 6: 0 to 100000 (17 guesses)
*/
const difficulties = [
    [21, 21, 60],
    [61, 61, 180],
    [201, 201, 600],
    [801, 801, 2400],
    [1001, 1001, 8000],
    [5001, 5001, 90000]
];

// Used to determine number of correct guesses given per level
const tries_per_level = [10, 11, 12, 13, 14, 17];

// Used to determine number of correct guesses needed to advance to next level
const reqs_to_adv = [5, 10, 15, 20, 30, null];

// Minimum score for guessing each level's hidden number correctly
const score_bonus = [100, 150, 200, 300, 400, 500];

// Level Heading Colours
const colours = ["darkorchid", "darkcyan", "midnightblue", "crimson", "darkgreen", "darkgoldenrod"]

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#start_game").onclick = startGame;
})

function startGame() {

    // Hide instructions and disable start_game button
    document.querySelector("#gtn_instructions").style.display = "none";
    document.querySelector("#start_game").onclick = () => {};

    // Display game interface and provide functionality for stop_game button
    document.querySelector("#game_interface").style.display = "block";
    document.querySelector("#gtn_level").style.color = colours[0];
    document.querySelector("#other_buttons").style.display = "block";
    document.querySelector("#stop_game").onclick = stopGame;

    // Generate first level
    generate_level()  
}

function generate_level() {
    let start_range = Math.floor(Math.random() * difficulties[level - 1][0]);
    let end_range = start_range + Math.floor(Math.random() * difficulties[level - 1][1]) + difficulties[level - 1][2];
    let hidden_number = Math.floor(Math.random() * (end_range - start_range + 1)) + start_range;
    let tries = tries_per_level[level - 1];

    document.querySelector("#gtn_guesses").innerHTML = `Tries Left: ${tries}`;
    document.querySelector("#guess_range").innerHTML = `Guess a hidden number between ${start_range} and ${end_range} inclusive.`;
    let guess_field = document.querySelector("#user_guess");
    guess_field.focus();

    function check_key (event) {
        if (event.key === "Enter") {
            verify_guess();
        }
    }
    guess_field.addEventListener('keypress', check_key);
    document.querySelector("#verify_guess").onclick = () => {verify_guess()};

    let time_left = 60000;
    let now = new Date().getTime();
    let future = now + time_left;
    let timeinterval = setInterval(() => {
        now = new Date().getTime();
        time_left = future - now;
        let seconds_left = Math.max(Math.floor(time_left / 1000), 0);
        let partial_seconds_left = Math.max(Math.floor((time_left % 1000) / 100), 0);
        document.querySelector("#timer").innerHTML = `${seconds_left}.${partial_seconds_left} seconds`;
        
        if (time_left < 0) {
            guess_field.removeEventListener('keypress', check_key);
            clearInterval(timeinterval);
            stopGame();
        }
    }, 100)

    function verify_guess() {
        // Check if guess is correct, and updates game state accordingly
        let user_guess = Number(document.querySelector("#user_guess").value);
        if (user_guess > hidden_number) {
            tries -= 1;
            document.querySelector("#gtn_guesses").innerHTML = `Tries Left: ${tries}`;
            if (tries === 0) {
                document.querySelector("#higher_or_lower").innerHTML = `You ran out of tries. Hidden number is ${hidden_number}.`
                document.querySelector("#higher_or_lower").style.color = "red";
                guess_field.removeEventListener('keypress', check_key);
                clearInterval(timeinterval);
                stopGame();
            }
            else {
                document.querySelector("#higher_or_lower").innerHTML = `Hidden number is lower than ${user_guess}.`
                document.querySelector("#higher_or_lower").style.color = "blue";
                guess_field.focus();
            }
        }
        else if (user_guess < hidden_number) {
            tries -= 1;
            document.querySelector("#gtn_guesses").innerHTML = `Tries Left: ${tries}`;
            if (tries === 0) {
                document.querySelector("#higher_or_lower").innerHTML = `You ran out of tries. Hidden number is ${hidden_number}.`
                document.querySelector("#higher_or_lower").style.color = "red";
                guess_field.removeEventListener('keypress', check_key);
                clearInterval(timeinterval);
                stopGame();
            }
            else {
                document.querySelector("#higher_or_lower").innerHTML = `Hidden number is higher than ${user_guess}.`
                document.querySelector("#higher_or_lower").style.color = "blueviolet";
                guess_field.focus();
            }
        }
        else if (user_guess === hidden_number) {
            document.querySelector("#higher_or_lower").innerHTML = "Correct Guess!"
            document.querySelector("#higher_or_lower").style.color = "green";
            let score_added = score_bonus[level - 1] + tries * 5 * level + Math.floor(time_left * level / 2000);
            score += score_added;
            correct_guesses += 1;
            if (correct_guesses === reqs_to_adv[level - 1]) {
                level += 1;
                let gtn_level_text = document.querySelector("#gtn_level");
                gtn_level_text.innerHTML = `Level: ${level}`;
                gtn_level_text.style.color = colours[level - 1];
            }
            document.querySelector("#gtn_score").innerHTML = `Score: ${score} (+ ${score_added})`;
            guess_field.value = ""
            guess_field.removeEventListener('keypress', check_key);
            clearInterval(timeinterval);
            generate_level();
        }
        else {
            document.querySelector("#higher_or_lower").innerHTML = "Unknown Error. Please contact BoredLand Admin for assistance."
        }
    }
}  


function stopGame() {
    // Prevent double submission of score
    if (game_stopped) {
        return;
    }
    game_stopped = true;

    // Save user's score to database
    csrf_token = document.getElementById("csrf_token").value;
    fetch('http://127.0.0.1:8000/save_score/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({
            game_name: "guessthenumber",
            score: score
        })
    })
    .then(response => {
        console.log(response);
    }); 

    // Disable all existing buttons
    document.querySelector("#verify_guess").onclick = () => {};
    document.querySelector("#stop_game").onclick = () => {};

    // Change user interface
    document.querySelector("#gtn_score").innerHTML = `Final Score: ${score}`;
    document.querySelector("#other_buttons").style.display = "none";

    // Enable the relevant buttons
    document.querySelector("#other_buttons_2").style.display = "block";
    document.querySelector("#replay").onclick = replay;
    document.querySelector("#leaderboards").onclick = leaderboards;

    function replay() {
        window.location.href = window.location.href;
    }
     
    function leaderboards() {
        window.location.href = "leaderboards/";
    }
}
