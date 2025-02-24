let counter = 0;
let multiplier = 1;
let bonus = 0;
let cookies_per_click = multiplier + bonus;
let upgrades_purchased = 0;

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#start_game").onclick = startGame;
    document.querySelector("#cookie").onclick = addScore;
})


function startGame() {

    // Hide instructions
    document.querySelector("#cookie_instructions").style.display = "none";

    // Disable start_game button
    document.querySelector("#start_game").onclick = () => {};

    // Display game + shop interface and provide functionality for stop_game button
    document.querySelector("#cookie_game_interface").style.display = "block";
    activateShop()
    document.querySelector("#cookie_other_buttons").style.display = "block";
    document.querySelector("#stop_game").onclick = stopGame;
}


function addScore() {
    // Add cookies_per_click to score and display new score
    counter = counter + cookies_per_click;
    document.querySelector("#cookie_score").innerHTML = `Score: ${counter}`;
}


function activateShop() {
    document.querySelector("#cookie_game_shop_0").style.display = "block";
    document.querySelector("#cookie_game_shop_1").style.display = "block";
    document.querySelector("#cookie_game_shop_2").style.display = "block";
    document.querySelectorAll(".shop_button_add").forEach(button => {
        button.onclick = () => {
            purchase_add(Number(button.getAttribute("data-value1")), Number(button.getAttribute("data-value2")), button);
        };
    });
    document.querySelectorAll(".shop_button_mult").forEach(button => {
        button.onclick = () => {
            purchase_mult(Number(button.getAttribute("data-value1")), Number(button.getAttribute("data-value2")), button);
        };
    });

    function purchase_add(cost, add, button) {
        if (counter >= cost) {
            counter -= cost;
            bonus += add;
            cookies_per_click = multiplier + bonus;

            document.querySelector("#cookie_score").innerHTML = `Score: ${counter}`;
            document.querySelector("#cookie_bonus").innerHTML = `Current Bonus: +${bonus}`;
            document.querySelector("#cookies_per_click").innerHTML = `Cookies Per Click: +${cookies_per_click}`;

            refreshShop(button);
        }
    }

    function purchase_mult(cost, mult, button) {
        if (counter >= cost) {
            counter -= cost;
            multiplier *= mult;
            cookies_per_click = multiplier + bonus;

            document.querySelector("#cookie_score").innerHTML = `Score: ${counter}`;
            document.querySelector("#cookie_multiplier").innerHTML = `Current Multiplier: x${multiplier}`;
            document.querySelector("#cookies_per_click").innerHTML = `Cookies Per Click: +${cookies_per_click}`;

            refreshShop(button);
        }
    }

    function refreshShop(button) {
        button.disabled = true;
        button.style.backgroundColor = "lightgray";

        upgrades_purchased++;
        if (upgrades_purchased === 10) {
            document.querySelector("#shop_title").innerHTML = "Shop (Page 2/2)";
            document.querySelector("#cookie_game_shop_1").style.display = "none";
            document.querySelector("#cookie_game_shop_2").style.display = "none";
            document.querySelector("#cookie_game_shop_3").style.display = "block";
            document.querySelector("#cookie_game_shop_4").style.display = "block";
        }
    }
}


function stopGame() {
    // Save user's score to database
    csrf_token = document.getElementById("csrf_token").value;
    fetch('http://127.0.0.1:8000/save_score/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf_token
        },
        body: JSON.stringify({
            game_name: "cookieclicker2",
            score: counter
        })
    })
    .then(response => {
        console.log(response);
    }); 

    // Disable all existing buttons
    document.querySelector("#cookie").onclick = () => {};
    document.querySelector("#stop_game").onclick = () => {};
    document.querySelectorAll(".shop_button_add").forEach(button => {
        button.onclick = () => {};
    });
    document.querySelectorAll(".shop_button_mult").forEach(button => {
        button.onclick = () => {};
    });

    // Change user interface
    document.querySelector("#cookie_score").innerHTML = `Final Score: ${counter}`;
    document.querySelector("#cookie_other_buttons").style.display = "none";
    document.querySelectorAll(".cookie_game_shop").forEach(cookie_game_shop => {
        cookie_game_shop.style.display = "none";
    });

    // Enable the relevant buttons
    document.querySelector("#cookie_other_buttons_2").style.display = "block";
    document.querySelector("#replay").onclick = replay;
    document.querySelector("#leaderboards").onclick = leaderboards;

    function replay() {
        window.location.href = window.location.href;
    }
     
    function leaderboards() {
        window.location.href = "leaderboards/";
    }
}
