
const play_area = document.querySelectorAll(".info, .main");
// show play area
play_area.forEach((section) => {
    section.style.display = "flex";
});

// select space class
const spaces = document.querySelectorAll(".space");
// add event listener to each space
spaces.forEach((space) => {
    space.addEventListener('click', function () {
        handleClick(this);
    });
});

// turn indicator changer
const indicator = document.querySelector(".indicator");

let whose_turn = 0;
let space_taken = 0;

function handleClick(space) {
    // alternate between x and o
    if (whose_turn === 0) {
        whose_turn = 1;
        space_taken++;
        // add class to space depending on the symbol
        space.classList.add("x"); // class contains the symbol
        // make user unable to click the space again
        space.style.pointerEvents = "none";
        // change indicator
        indicator.src = "./images/bilog.png";
    } else {
        whose_turn = 0;
        space_taken++;
        space.classList.add("o");
        space.style.pointerEvents = "none";
        indicator.src = "./images/ekis.png";
    }
    checkWinner();
}

const win_screen = document.querySelector(".win-screen");
const win_screen_bg = document.getElementsByClassName("win-screen-bg");
const winning_icon = document.getElementById("winning-icon");
const win_message = document.getElementById("win-message");
const draw_message = document.getElementById("draw-message");

function checkWinner() {
    // check if there are 3 in a row
    pointChecker(".a1", ".a2", ".a3");
    pointChecker(".b1", ".b2", ".b3");
    pointChecker(".c1", ".c2", ".c3");

    // check if there are 3 in a column
    pointChecker(".a1", ".b1", ".c1");
    pointChecker(".a2", ".b2", ".c2");
    pointChecker(".a3", ".b3", ".c3");

    // check if there are 3 in a diagonal
    pointChecker(".a1", ".b2", ".c3");
    pointChecker(".a3", ".b2", ".c1");

    // check if draw
    if (space_taken === 9) {
        console.log("Draw");
        draw = true;
        win_screen_bg[0].style.display = "block";
        win_screen.style.display = "flex";
        draw_message.style.display = "block";
    }
}

function pointChecker(id1, id2, id3) {
    let win = false;
    let symbol = "";
    const line = document.querySelectorAll(`${id1}, ${id2}, ${id3}`);

    if (line[0].classList.contains("x") && line[1].classList.contains("x") && line[2].classList.contains("x")) {
        console.log("X wins");
        win = true;
        symbol = "X";
    } else if (line[0].classList.contains("o") && line[1].classList.contains("o") && line[2].classList.contains("o")) {
        console.log("O wins");
        win = true;
        symbol = "O";
    }
    // disable clicking when there is a winner
    if (win) {
        win_screen.style.display = "flex";

        spaces.forEach((space) => {
            space.style.pointerEvents = "none";
            space_taken = 0;
        });

        if (symbol === "X") {
            winning_icon.src = "./images/ekis_higherres.png";
        } else {
            winning_icon.src = "./images/bilog_higherres.png";
        }
        const audio = new Audio("./sound/win.wav");
        audio.play();
        
        win_screen_bg[0].style.display = "block";
        win_message.style.display = "block";
        winning_icon.style.display = "block";
    }
}

function goBack() {
    const audio = new Audio("./sound/button.wav");
    audio.play();

    setTimeout(() => {
        history.back();
    }, 250);
}
function goToOnePlayer() {
    const audio = new Audio("./sound/button.wav");
    audio.play();

    setTimeout(() => {
        window.location.href = "./onePlayer.html";
    }, 250);
}
function goToTwoPlayer() {
    const audio = new Audio("./sound/button.wav");
    audio.play();

    setTimeout(() => {
        window.location.href = "./twoPlayer.html";
    }, 250);
}

function playSound() {
    let playMe = "";
    // Create a new Audio object
    if (whose_turn === 0) {
        playMe = "./sound/pop1.mp3";
    } else if (whose_turn === 1) {
        playMe = "./sound/pop2.mp3";
    }

    const audio = new Audio(playMe);
    // Play the sound
    audio.play();
}