const GRID_SIZE = 40;
const TOTAL_CELLS = Math.pow(GRID_SIZE, 2);

let directionChanged = false;
let foodConsumed = 0;

const board = document.getElementById("gameContainer");

const buildBoard = () => {
  let html = "";
  for (let i = 1; i <= TOTAL_CELLS; ++i) {
    html += `<div class="gameBoardPixel" id="pixel${i}"></div>`;
  }
  board.innerHTML = html;
};

let boardPixels;

const spawnFood = () => {
  boardPixels[currentFoodPosition].classList.remove("food");
  currentFoodPosition = Math.floor(Math.random() * TOTAL_CELLS);
  boardPixels[currentFoodPosition].classList.add("food");
};

const LEFT_DIR = 37;
const UP_DIR = 38;
const RIGHT_DIR = 39;
const DOWN_DIR = 40;

let positionArray = [];
let currentDirection = RIGHT_DIR;
let currentSnakeHeadPosition = TOTAL_CELLS / 2 - 1;
let snakeLength = 100;

const setDirection = (newDirectionCode) => {
  if (newDirectionCode === currentDirection || directionChanged) return;

  switch (newDirectionCode) {
    case LEFT_DIR:
      if (currentDirection !== RIGHT_DIR)
        currentDirection = newDirectionCode;
      break;
    case UP_DIR:
      if (currentDirection !== DOWN_DIR)
        currentDirection = newDirectionCode;
      break;
    case RIGHT_DIR:
      if (currentDirection !== LEFT_DIR)
        currentDirection = newDirectionCode;
      break;
    case DOWN_DIR:
      if (currentDirection !== UP_DIR)
        currentDirection = newDirectionCode;
      break;
  }
  directionChanged = true;
};

const updateSnake = () => {
  switch (currentDirection) {
    case LEFT_DIR:
      --currentSnakeHeadPosition;
      if (
        currentSnakeHeadPosition % GRID_SIZE === GRID_SIZE - 1 ||
        currentSnakeHeadPosition < 0
      ) {
        currentSnakeHeadPosition += GRID_SIZE;
      }
      break;
    case UP_DIR:
      currentSnakeHeadPosition -= GRID_SIZE;
      if (currentSnakeHeadPosition < 0) {
        currentSnakeHeadPosition += TOTAL_CELLS;
      }
      break;
    case RIGHT_DIR:
      ++currentSnakeHeadPosition;
      if (currentSnakeHeadPosition % GRID_SIZE === 0) {
        currentSnakeHeadPosition -= GRID_SIZE;
      }
      break;
    case DOWN_DIR:
      currentSnakeHeadPosition += GRID_SIZE;
      if (currentSnakeHeadPosition > TOTAL_CELLS - 1) {
        currentSnakeHeadPosition -= TOTAL_CELLS;
      }
      break;
  }

  const nextSnakeHeadPixel = boardPixels[currentSnakeHeadPosition];

  if (nextSnakeHeadPixel.classList.contains("snakeBodyPixel")) {
    clearInterval(moveSnakeInterval);
    if (!alert(`Your Score is ${foodConsumed}.`)) window.location.reload();
  }

  nextSnakeHeadPixel.classList.add("snakeBodyPixel");

  if (positionArray.length > foodConsumed) {
    const removeMe = positionArray.shift();
    removeMe.classList.remove("snakeBodyPixel");
  }

  positionArray.push(nextSnakeHeadPixel);
  directionChanged = false;

  if (currentSnakeHeadPosition === currentFoodPosition) {
    foodConsumed++;
    document.getElementById("pointsEarned").innerHTML = foodConsumed;
    snakeLength += 100;
    spawnFood();
  }
};

let currentFoodPosition = 0;

buildBoard();
boardPixels = document.getElementsByClassName("gameBoardPixel");
spawnFood();

const moveSnakeInterval = setInterval(updateSnake, 100);

addEventListener("keydown", (e) => setDirection(e.keyCode));

document.getElementById("leftButton").onclick = () => setDirection(LEFT_DIR);
document.getElementById("rightButton").onclick = () =>
  setDirection(RIGHT_DIR);
document.getElementById("upButton").onclick = () => setDirection(UP_DIR);
document.getElementById("downButton").onclick = () => setDirection(DOWN_DIR);
