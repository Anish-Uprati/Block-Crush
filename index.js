
const board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
const width = 8;
const colors = ["red", "yellow", "blue", "green", "purple"];
let squares = [];
let firstClicked = null;
let score = 0;

function createBoard() {
  board.innerHTML = "";
  squares = [];

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.setAttribute("data-id", i);
    square.classList.add("candy");
    square.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    board.appendChild(square);
    squares.push(square);
    square.addEventListener("click", handleClick);
  }
}

function handleClick() {
  if (!firstClicked) {
    firstClicked = this;
    this.classList.add("selected");
  } else {
    let secondClicked = this;

    if (isAdjacent(firstClicked, secondClicked)) {
      swap(firstClicked, secondClicked);

      if (!checkMatches()) {
        swap(firstClicked, secondClicked);
      }
    }

    firstClicked.classList.remove("selected");
    firstClicked = null;
  }
}

function isAdjacent(a, b) {
  const id1 = parseInt(a.dataset.id);
  const id2 = parseInt(b.dataset.id);

  return (
    id1 === id2 - 1 ||
    id1 === id2 + 1 ||
    id1 === id2 - width ||
    id1 === id2 + width
  );
}

function swap(a, b) {
  let temp = a.style.backgroundColor;
  a.style.backgroundColor = b.style.backgroundColor;
  b.style.backgroundColor = temp;
}

function checkMatches() {
  let matched = false;

  // Check rows
  for (let i = 0; i < width * width; i++) {
    if (i % width > width - 3) continue;

    let row = [i, i+1, i+2];
    let color = squares[i].style.backgroundColor;

    if (color !== "" &&
        row.every(index => squares[index].style.backgroundColor === color)) {
      row.forEach(index => squares[index].style.backgroundColor = "");
      score += 10;
      matched = true;
    }
  }

  // Check columns
  for (let i = 0; i < width * width - 2 * width; i++) {
    let column = [i, i+width, i+width*2];
    let color = squares[i].style.backgroundColor;

    if (color !== "" &&
        column.every(index => squares[index].style.backgroundColor === color)) {
      column.forEach(index => squares[index].style.backgroundColor = "");
      score += 10;
      matched = true;
    }
  }

  // Check 2x2
  for (let i = 0; i < width * width; i++) {
    if (i % width === width - 1) continue;
    if (i + width + 1 >= width * width) continue;

    let block = [i, i+1, i+width, i+width+1];
    let color = squares[i].style.backgroundColor;

    if (color !== "" &&
        block.every(index => squares[index].style.backgroundColor === color)) {
      block.forEach(index => squares[index].style.backgroundColor = "");
      score += 20;
      matched = true;
    }
  }

  if (matched) {
    scoreDisplay.textContent = score;
    setTimeout(dropCandies, 200);
  }

  return matched;
}

function dropCandies() {
  for (let col = 0; col < width; col++) {
    let column = [];

    for (let row = 0; row < width; row++) {
      let index = row * width + col;
      if (squares[index].style.backgroundColor !== "") {
        column.push(squares[index].style.backgroundColor);
      }
    }

    for (let row = width - 1; row >= 0; row--) {
      let index = row * width + col;

      if (column.length > 0) {
        squares[index].style.backgroundColor = column.pop();
      } else {
        squares[index].style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
      }
    }
  }

  setTimeout(checkMatches, 200);
}

function resetGame() {
  score = 0;
  scoreDisplay.textContent = score;
  createBoard();
}

createBoard();