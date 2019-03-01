const width = 4;
const maxHeight = 10;
const colorAmount = 6;
const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];
const whiteEval = 0;
const blackEval = 1;

let gameEnded = false;
let goal;
let guesses;
let evaluations;

let selectedX;
let selectedY;
let selectedColor;

function setup() {
    createCanvas(640, 480);
    strokeWeight(2);

    initBoard();
}

function initBoard() {
    goal = [];
    for (let i = 0; i < width; i++)
        goal[i] = floor(random(0, colorAmount));
    guesses = [];
    for (let i = 0; i < maxHeight; i++)
        guesses[i] = [];
    evaluations = [];

    selectedX = 0;
    selectedY = 0;
    selectedColor = -1;
}

function evaluateGuess(guessNum) {
    let guess = guesses[guessNum];
    let blacks = [];
    let eval = evaluations[guessNum] = [];
    for (let i = 0; i < width; i++) {
        if (guess[i] === goal[i]) {
            eval.push(blackEval);
            blacks[i] = true;
        }
    }

    if (eval.length >= width)
        return true;

    colors: for (let color = 0; color < colorAmount; color++) {
        let counter = 0;
        for (let i = 0; i < width; i++) {
            if (goal[i] === color)
                counter++;
            if (guess[i] === color)
                counter--;
        }
        if (counter != 0)
            continue;
        for (let i = 0; i < width; i++) {
            if (blacks[i] || goal[i] !== color)
                continue;
            for (let j = 0; j < width; j++) {
                if (goal[i] === guess[j]) {
                    eval.push(whiteEval);
                    continue colors;
                }
            }
        }
    }
    return false;
}

function draw() {
    background(255);
    if (gameEnded) {
        for (let i = 0; i < width; i++) {
            fill(colors[goal[i]]);
            ellipse(20 + i * 35, 20, 30, 30);
        }
    }
    for (let currTry = 0; currTry < maxHeight; currTry++) {
        let currGuess = guesses[currTry];

        for (let i = 0; i < width; i++) {
            if (!gameEnded && selectedX == i && selectedY == currTry)
                stroke(255, 0, 0);
            else
                stroke(0);

            fill(currGuess && currGuess[i] !== undefined ? colors[currGuess[i]] : 255);
            ellipse(20 + i * 35, 75 + currTry * 40, 30, 30);
        }

        stroke(0);
        let currEval = evaluations[currTry];
        for (let i = 0; i < width; i++) {
            fill(currEval && currEval[i] !== undefined ? (currEval[i] === blackEval ? 0 : 180) : 255);
            ellipse(35 * width + 20 + i * 20, 75 + currTry * 40, 15, 15);
        }
    }
}

function keyPressed() {
    if (gameEnded) {
        if (keyCode === ENTER) {
            gameEnded = false;
            initBoard();
        }
    } else {
        if (keyCode === RIGHT_ARROW) {
            selectedX++;
            if (selectedX >= width)
                selectedX = 0;
            updateCurrentColor();
        } else if (keyCode === LEFT_ARROW) {
            selectedX--;
            if (selectedX < 0)
                selectedX = width - 1;
            updateCurrentColor();
        } else if (keyCode === UP_ARROW) {
            selectedColor++;
            if (selectedColor >= colorAmount)
                selectedColor = 0;
            setCurrentColor();
        } else if (keyCode == DOWN_ARROW) {
            selectedColor--;
            if (selectedColor < 0)
                selectedColor = colorAmount - 1;
            setCurrentColor();
        } else if (keyCode == ENTER) {
            for (let i = 0; i < width; i++) {
                if (guesses[selectedY][i] === undefined)
                    return;
            }

            if (evaluateGuess(selectedY))
                gameEnded = true;

            selectedColor = -1;
            selectedY++;
            if (selectedY >= maxHeight)
                gameEnded = true;
        }
    }
}

function updateCurrentColor() {
    let row = guesses[selectedY];
    if (row[selectedX] !== undefined)
        selectedColor = row[selectedX];
    else
        selectedColor = -1;
}

function setCurrentColor() {
    if (selectedColor >= 0) {
        let row = guesses[selectedY];
        row[selectedX] = selectedColor;
    }
}