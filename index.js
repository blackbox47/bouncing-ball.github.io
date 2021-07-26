const canvas = document.querySelector("canvas");
canvas.width = 500;
canvas.height = 500;

const ctx = canvas.getContext("2d");
let canvasH = canvas.height;
let canvasW = canvas.width;
let x,
  y,
  dx,
  dy,
  radius = 15,
  interval,
  paddleW,
  paddleH,
  paddleX,
  paddleY,
  brickH,
  brickW,
  brickOffset,
  score;
let rightPressed = false;
let leftPressed = false;
const bricks = [];
let modalEL = document.getElementById("modalEl");

setVariables();
drawBall();
drawPaddle();
paddleNavigation();
createBrickArray();
drawBricks();
// startGame();

function loadGame() {
  console.log("jfjdfk");
  modalEL.style.display = "none";
  setVariables();
  drawBall();
  drawPaddle();
  paddleNavigation();
  createBrickArray();
  drawBricks();
}

function createBrickArray() {
  for (let j = 0; j < 3; j++) {
    bricks[j] = [];
    for (let i = 0; i < 7; i++) {
      bricks[j][i] = { x: 0, y: 0, isVisible: true };
    }
  }
}

function drawBricks() {
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 7; i++) {
      if (bricks[j][i].isVisible) {
        const brickX = i * (brickW + brickOffset);
        const brickY = (10 + brickOffset) * j;
        bricks[j][i].x = brickX;
        bricks[j][i].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickW, brickH);
        ctx.fillStyle = "#3797a4";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

function paddleNavigation() {
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      rightPressed = true;
    }
    if (e.key === "ArrowLeft") {
      leftPressed = true;
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "ArrowRight") {
      rightPressed = false;
    }
    if (e.key === "ArrowLeft") {
      leftPressed = false;
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#790c5a";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleW, paddleH);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function startGame() {
  modalEL.style.display = "none";
  if (!interval) {
    interval = setInterval(() => {
      ctx.clearRect(0, 0, canvasW, canvasH);
      x = x + dx;
      y = y + dy;
      if (rightPressed) paddleX = paddleX + 5;
      if (leftPressed) paddleX = paddleX - 5;
      if (paddleX < 0) paddleX = 0;
      if (paddleX > canvasW - paddleW) paddleX = canvasW - paddleW;

      detectCoalition();
      checkGameOver();
      drawBall();
      drawPaddle();
      drawBricks();
    }, 20);
  }
}

function setVariables() {
  ////// ball values
  x = canvasW / 2;
  y = canvasH - 20;
  dx = 5;
  dy = -5;
  ///// paddle Values
  paddleW = 80;
  paddleH = 10;
  paddleX = canvasW / 2 - paddleW / 2;
  paddleY = canvasH - 10;

  //// paddle movement values
  rightPressed = false;
  leftPressed = false;

  ////// bricks values

  brickH = 20;
  brickW = 60;
  brickOffset = 13;

  score = 0;
}

function checkGameOver() {
  if (y === canvasH) {
    modalEL.style.display = "block";
    document.getElementById("finalScore").innerHTML = score;
    clearInterval(interval);
    interval = null;

    setVariables();
    createBrickArray();
  }
}

function detectCoalition() {
  //// coalition between side walls and ball
  if (x + dx >= canvasW || x + dx < 0) {
    dx = -dx;
  }
  if (y + dy < 0) {
    dy = -dy;
  }

  ///// coalition between paddle and ball

  if (y + dy > canvasH - radius) {
    if (x + dx > paddleX && x + dx < paddleX + paddleW) {
      dy = -dy;
      dx = dx + (x + dx - paddleX) / 100;
    }
  }

  ///// coalition between bricks and ball

  for (let j = 0; j < bricks.length; j++) {
    for (let i = 0; i < bricks[j].length; i++) {
      const brick = bricks[j][i];
      if (
        x > brick.x &&
        x < brick.x + brickW &&
        y > brick.y &&
        y < brick.y + brickH
      ) {
        if (bricks[j][i].isVisible) {
          bricks[j][i].isVisible = false;
          dy = -dy;
          score += 1;
        }
      }
    }
  }
}
