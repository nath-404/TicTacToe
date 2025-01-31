// difficulty selector
const difficulty = document.querySelectorAll(".button");
const difficulty_selector = document.querySelector(".difficulty-selector");
const play_area = document.querySelectorAll(".info, .main");
let selected_diff;
let disableAI = false;
difficulty.forEach((button) => {
    button.addEventListener('click', function () {
        if (button.classList.contains("easy")) {
            selected_diff = 1;
        } else if (button.classList.contains("medium")) {
            selected_diff = 2;
        } else if (button.classList.contains("hard")) {
            selected_diff = 3;
        } else {
            console.log("no such difficulty exists.")
        }

        const audio = new Audio("./sound/button.wav");
        audio.play();

        setTimeout(() => {
            // hide difficulty selector
            difficulty_selector.style.display = "none";
            // show play area
            play_area.forEach((section) => {
                section.style.display = "flex";
            });
        }, 300);
    });
});

// identify spaces
// array for empty spaces
const spaces2 = document.querySelectorAll(".space");
let emptySpaces = [];

// add all spaces to array
for (let i = 0; i < spaces2.length; i++) {
    emptySpaces.push(spaces2[i].classList[0]);
}

// event listener for each space
spaces2.forEach((space) => {
    space.addEventListener('click', function () {
        handleClick(space);
    });
});

const indicator = document.querySelector(".indicator");
let whose_turn = 0;
let space_taken = 0;
let win = false;
let draw = false;
let valueToRemove;

function handleClick(space) {
    // alternate between x and o
    // player's turn
    whose_turn = 1;
    space_taken++;
    // add class to space depending on the symbol
    space.classList.add("x"); // class contains the symbol
    playSound();
    // make user unable to click the space again
    space.style.pointerEvents = "none";
    // change indicator
    indicator.src = "./images/bilog.png";
    // remove the space from the emptyspaces array
    valueToRemove = space.classList[0];
    emptySpaces = emptySpaces.filter(item => item !== valueToRemove);
    
    // disable click for all spaces with x or o classes
    spaces2.forEach((space) => {
        if (space.classList.contains("x") || space.classList.contains("o")) {
            space.style.pointerEvents = "none";
        }
    });
    // check if player won
    checkWinner();
    
    // AI's turn
    // add if else for which difficulty is selected
    if (selected_diff === 1) {
        easyAI();
    } else if (selected_diff === 2) {
        mediumAI();
    } else if (selected_diff === 3) {
        hardAI();
    } else {
        console.log("how tf did u see this message?");
    }
}

// put space indexes into an array to put in winningCombosArray
let spaceIndex = [];
spaces2.forEach((space) => {
    let x = space.classList[0];
    spaceIndex.push(`${x}`);
})
let a1 = spaces2[0];
let a2 = spaces2[1];
let a3 = spaces2[2];
let b1 = spaces2[3];
let b2 = spaces2[4];
let b3 = spaces2[5];
let c1 = spaces2[6];
let c2 = spaces2[7];
let c3 = spaces2[8];
// array itself
const winningCombos = [
    // rows
    [a1, a2, a3],
    [b1, b2, b3],
    [c1, c2, c3],
    // columns
    [a1, b1, c1],
    [a2, b2, c2],
    [a3, b3, c3],
    // diagonals
    [a1, b2, c3],
    [a3, b2, c1]
];

function easyAI() {
    whose_turn = 0;
    // disable click when AI's turn
    spaces2.forEach((space) => {
        space.style.pointerEvents = "none";
    });

    // since easy, just randomize the choice
    let random = Math.floor(Math.random() * emptySpaces.length);
    let aiMove = emptySpaces[random];
    // stop ai from placing a move if there is a win
    if (disableAI) {
        return;
    }

    // add the symbol to the chosen space
    const aiChoice = document.getElementsByClassName(`${aiMove}`);
    // set delay for AI's turn
    
    setTimeout(() => {
        space_taken++;
        aiChoice[0].classList.add("o");
        playSound();
        indicator.src = "./images/ekis.png";
        aiChoice[0].style.pointerEvents = "none";
        valueToRemove = aiChoice[0].classList[0];
        emptySpaces = emptySpaces.filter(item => item !== valueToRemove);
        
        // check if ai won
        checkWinner();

        // enable click after AI's turn
        spaces2.forEach((space) => {
            if (!space.classList.contains("x") && !space.classList.contains("o")) {
                space.style.pointerEvents = "auto";
            }
        });
    }, 1000);
}

function mediumAI() {
    whose_turn = 0;
    // disable click when AI's turn
    spaces2.forEach((space) => {
        space.style.pointerEvents = "none";
    });
    // stop ai from placing a move if there is a win
    if (disableAI) {
        return;
    }
    // start of medium ai thinking
    let aiMove;
    let calculatedChoiceForAttack = attackOrDefend("attack");
    let calculatedChoiceForDefend;
    // outer if: check if there is an opportunity for an attack
    if (calculatedChoiceForAttack === "noOpportunity") {
        // if no opportunity, find defensive approach
        calculatedChoiceForDefend = attackOrDefend("defend");
        if (calculatedChoiceForDefend === "noOpportunity") {
            // if no defensive approach found, randomize the next move
            let random = Math.floor(Math.random() * emptySpaces.length);
            aiMove = emptySpaces[random];
            console.log("IT WILL RANDOMIZE");
        } else {
            // if defensive approach found, assign that space to aiMove
            console.log('calculatedChoiceForDefend is ' + calculatedChoiceForDefend);
            console.log("IT WILL TAKE ACTION")
            aiMove = calculatedChoiceForDefend;
        }
    } else { // if offensive approach found, assign that space to aiMove
        console.log('calculatedChoiceForAttack is ' + calculatedChoiceForAttack);
        console.log("IT WILL TAKE ACTION")
        aiMove = calculatedChoiceForAttack; 
    }
    // end of medium ai thinking

    // add the symbol to the chosen space
    const aiChoice = document.getElementsByClassName(aiMove);
    // set delay for AI's turn
    setTimeout(() => {
        space_taken++;
        aiChoice[0].classList.add("o");
        playSound();
        indicator.src = "./images/ekis.png";
        aiChoice[0].style.pointerEvents = "none";
        valueToRemove = aiChoice[0].classList[0];
        emptySpaces = emptySpaces.filter(item => item !== valueToRemove);

        // check if ai won
        checkWinner();

        // enable click after AI's turn
        spaces2.forEach((space) => {
            if (!space.classList.contains("x") && !space.classList.contains("o")) {
                space.style.pointerEvents = "auto";
            }
        });
    }, 1000);
}

function hardAI() {
    whose_turn = 0;
    // disable click when AI's turn
    spaces2.forEach((space) => {
        space.style.pointerEvents = "none";
    });
    // stop ai from placing a move if there is a win
    if (disableAI) {
        return;
    }
    // start of medium ai thinking
    let aiMove;

    // check if middle is occupied. if not, but the symbol there
    if (!b2.classList.contains('x') && !b2.classList.contains('o')) {
        aiMove = b2.classList[0];
    } else {
        let calculatedChoiceForAttack = attackOrDefend("attack");
        let calculatedChoiceForDefend;
        // outer if: check if there is an opportunity for an attack
        if (calculatedChoiceForAttack === "noOpportunity") {
            // if no opportunity, find defensive approach
            calculatedChoiceForDefend = attackOrDefend("defend");
            if (calculatedChoiceForDefend === "noOpportunity") {
                // if no defensive approach found, counter
                if ((a2.classList.contains('x') && b1.classList.contains('x')) && (!a1.classList.contains('x') && !a1.classList.contains('o'))) {
                    console.log("IT WILL COUNTER AGAIN");
                    aiMove = a1.classList[0];
                } else if ((a2.classList.contains('x') && b3.classList.contains('x')) && (!a3.classList.contains('x') && !a3.classList.contains('o'))) {
                    console.log("IT WILL COUNTER AGAIN");
                    aiMove = a3.classList[0];
                } else if ((c2.classList.contains('x') && b1.classList.contains('x')) && (!c1.classList.contains('x') && !c1.classList.contains('o'))) {
                    console.log("IT WILL COUNTER AGAIN");
                    aiMove = c1.classList[0];
                } else if ((c2.classList.contains('x') && b3.classList.contains('x')) && (!c3.classList.contains('x') && !c3.classList.contains('o'))) {
                    console.log("IT WILL COUNTER AGAIN");
                    aiMove = c3.classList[0];
                } else {
                    if (a2.classList.contains('x') && (!b1.classList.contains('x') && !b1.classList.contains('o'))) {
                        console.log("IT WILL COUNTER");
                        aiMove = b1.classList[0];
                    } else if (b1.classList.contains('x') && (!c2.classList.contains('x') && !c2.classList.contains('o'))) {
                        console.log("IT WILL COUNTER");
                        aiMove = c2.classList[0];
                    } else if (c2.classList.contains('x') && (!b3.classList.contains('x') && !b3.classList.contains('o'))) {
                        console.log("IT WILL COUNTER");
                        aiMove = b3.classList[0];
                    } else if (b3.classList.contains('x') && (!a2.classList.contains('x') && !a2.classList.contains('o'))) {
                        console.log("IT WILL COUNTER");
                        aiMove = a2.classList[0];
                    } else {
                        console.log('b2 is taken so IT WILL COUNTER');
                        if (b2.classList.contains('x') && space_taken === 1) {
                            aiMove = c1.classList[0];
                        } else if (a3.classList.contains('x') && space_taken === 3) {
                            console.log(space_taken);
                            aiMove = c3.classList[0];
                        } else {
                            console.log("IT WILL RANDOMIZE");
                            let random = Math.floor(Math.random() * emptySpaces.length);
                            aiMove = emptySpaces[random];
                        }
                    }
                }

                // a2
                // b1
                
                // c2
                // b3
            } else {
                // if defensive approach found, assign that space to aiMove
                console.log('calculatedChoiceForDefend is ' + calculatedChoiceForDefend);
                console.log("IT WILL TAKE ACTION")
                aiMove = calculatedChoiceForDefend;
            }
        } else { // if offensive approach found, assign that space to aiMove
            console.log('calculatedChoiceForAttack is ' + calculatedChoiceForAttack);
            console.log("IT WILL TAKE ACTION")
            aiMove = calculatedChoiceForAttack; 
        }
    }
    // end of medium ai thinking

    // add the symbol to the chosen space
    const aiChoice = document.getElementsByClassName(aiMove);
    // set delay for AI's turn
    setTimeout(() => {
        space_taken++;
        aiChoice[0].classList.add("o");
        playSound();
        indicator.src = "./images/ekis.png";
        aiChoice[0].style.pointerEvents = "none";
        valueToRemove = aiChoice[0].classList[0];
        emptySpaces = emptySpaces.filter(item => item !== valueToRemove);
        
        // check if ai won
        checkWinner();

        // enable click after AI's turn
        spaces2.forEach((space) => {
            if (!space.classList.contains("x") && !space.classList.contains("o")) {
                space.style.pointerEvents = "auto";
            }
        });
    }, 1000);
}

// function for checking if there is an offensive and defensive approach for the AI
function attackOrDefend(action) {
    let symbol;
    if (action === "attack") {
        symbol = 'o';
    } else if (action === "defend") {
        symbol = 'x';
    } else {
        console.log("Neither attack nor defend.");
        return "noOpportunity";
    }

    for (let i = 0; i < winningCombos.length; i++) {
        const combo = winningCombos[i];
        let noSymbol = null;
        let counter = 0;

        for (let j = 0; j < combo.length; j++) {
            const space = combo[j];
            if (space.classList.contains(symbol)) {
                counter++;
            } else if (!space.classList.contains('o') && !space.classList.contains('x')) {
                noSymbol = space; // Store the empty space
            }
        }

        if (counter === 2 && noSymbol !== null) {
            // If two symbols are found and there's an empty space, return the empty space
            return noSymbol.classList[0];
        }
    }

    // If no combo with two symbols and an empty space is found, return "noOpportunity"
    return "noOpportunity";
}

// DONT DELETE THIS (requirements for the game)

const win_screen = document.querySelector(".win-screen");
const win_screen_bg = document.getElementsByClassName("win-screen-bg");
const winning_icon = document.getElementById("winning-icon");
const win_message = document.getElementById("win-message");
const draw_message = document.getElementById("draw-message");
let symbol;
// check if theres a winner
function checkWinner() { 
    if (
        // check if there are 3 in a row
        pointChecker(".a1", ".a2", ".a3") ||
        pointChecker(".b1", ".b2", ".b3") ||
        pointChecker(".c1", ".c2", ".c3") ||

        // check if there are 3 in a column
        pointChecker(".a1", ".b1", ".c1") ||
        pointChecker(".a2", ".b2", ".c2") ||
        pointChecker(".a3", ".b3", ".c3") ||

        // check if there are 3 in a diagonal
        pointChecker(".a1", ".b2", ".c3") ||
        pointChecker(".a3", ".b2", ".c1")
    ) {
        win = true;
    } else {
        win = false;
    }

    // if someone won, display winning screen
    if (win) {
        win_screen.style.display = "flex";
        // disable clicking
        spaces2.forEach((space) => {
            space.style.pointerEvents = "none";
            space_taken = 0;
        });
        // set winning indicator depending on winning symbol
        if (symbol === "X") {
            winning_icon.src = "./images/ekis_higherres.png";
        } else if (symbol === "O") {
            winning_icon.src = "./images/bilog_higherres.png";
        }
        win_screen_bg[0].style.display = "block";
        win_message.style.display = "block";
        winning_icon.style.display = "block";
        // set emptyspaces to empty to stop ai on placing a move
        disableAI = true;
    }

    // if all spaces is taken, consider it a draw
    if (space_taken === 9 && !win) { 
        console.log("Draw");
        draw = true;
        disableAI = true;
        win_screen_bg[0].style.display = "block";
        win_screen.style.display = "flex";
        draw_message.style.display = "block";
    }
    return;
}

// check if there is a 3 in a row
function pointChecker(id1, id2, id3) {
    const line = document.querySelectorAll(`${id1}, ${id2}, ${id3}`);

    if (line[0].classList.contains("x") && line[1].classList.contains("x") && line[2].classList.contains("x")) {
        console.log("X wins");
        symbol = "X";
        return true;
    } else if (line[0].classList.contains("o") && line[1].classList.contains("o") && line[2].classList.contains("o")) {
        console.log("O wins");
        symbol = "O";
        return true;
    } else {
        return false;
    }
}

function goBack() {
    const audio = new Audio("./sound/button.wav");
    audio.play();

    setTimeout(() => {
        history.back();
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