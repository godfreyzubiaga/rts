const colorArray = ['rgb(244, 67, 54)', 'pink', 'purple', 'blue', 'deeppink', 'idigo', 'lightblue', 'cyan',
  'teal', 'lightgreen', 'lime', '#00E676', '#FFC107', '#E65100', '#546E7A'];
let gameStart = false;
const rectHeight = 20;
let rects = [];
let movingRect = {};
let origRect = {};
let speedX;
let interval;
let score = 0;
let highScore = 0;
window.onload = function () {
  const c = document.getElementById('canvas');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  document.body.onclick = function (e) {
    if (!gameStart) {
      document.body.style.background = 'black';
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      gameStart = true;
      reset();
      document.getElementById('content').innerHTML = '';
      createOrigRect();
      createMovingRect();
      interval = setInterval(showMovingRect, 1);
      atHelpPage = false;
      showScore();
    } else if (gameStart) {
      drawCurrentRect(movingRect);
      clearInterval(interval);
      createMovingRect();
      interval = setInterval(showMovingRect, 1);
      showScore();
    }
  }
}

function createOrigRect() {
  const c = document.getElementById('canvas');
  const ctx = c.getContext("2d");
  origRect.x = Math.floor(window.innerWidth / 4);
  origRect.y = 0;
  origRect.width = Math.floor(window.innerWidth / 2);
  origRect.height = rectHeight;
  origRect.color = getRandomColor();
  ctx.fillStyle = origRect.color;
  ctx.fillRect(origRect.x, origRect.y, origRect.width, origRect.height);
  rects.push(origRect);
}

function showMovingRect() {
  const c = document.getElementById('canvas');
  const ctx = c.getContext("2d");
  ctx.fillStyle = movingRect.color;
  ctx.clearRect(0, movingRect.y, window.innerWidth, window.innerHeight);
  ctx.fillRect(movingRect.x, movingRect.y, movingRect.width, movingRect.height);
  movingRect.x += speedX;
  if (movingRect.x + movingRect.width >= window.innerWidth) {
    speedX = -speedX;
  } else if (movingRect.x <= 0) {
    speedX = -speedX;
  }
}

function createMovingRect() {
  speedX = 1;
  movingRect.x = 0;
  movingRect.y = rects.length * 20;
  movingRect.width = rects[rects.length - 1].width;
  movingRect.height = rectHeight;
  movingRect.color = getRandomColor();
}

function drawCurrentRect(rect) {
  const newRect = {};
  const prevRect = rects[rects.length - 1];
  newRect.x = rect.x;
  newRect.y = rect.y;
  newRect.width = rect.width;
  newRect.height = rect.height;
  newRect.color = rect.color;
  const c = document.getElementById('canvas');
  const ctx = c.getContext("2d");
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  if (prevRect.x > newRect.x && newRect.x + newRect.width > prevRect.x) {
    ctx.clearRect(0, newRect.y, prevRect.x, window.innerHeight);
    newRect.width -= prevRect.x - newRect.x;
    newRect.x = prevRect.x;
  } else if (prevRect.x + prevRect.width < newRect.x + newRect.width && prevRect.x + prevRect.width > newRect.x) {
    ctx.clearRect(prevRect.x + prevRect.width, rect.y, window.innerWidth, window.innerHeight);
    newRect.width -= (newRect.x + newRect.width) - (prevRect.x + prevRect.width);
  } else if (newRect.x + newRect.width < prevRect.x ||
    prevRect.x + prevRect.width < newRect.x) {
    gameOver();
  }
  score++;
  rects.push(newRect);
}

function gameOver() {
  const c = document.getElementById('canvas');
  document.body.style.background = '#1a82f7';
  const content = document.getElementById('content');
  content.innerHTML =
    `<div id="title">
      Reverse Tower Stacking
    </div>
    <div id="gameOver">
      Game Over. Try again!
    </div>
    <div id="subtitle">
      Tap to Restart the game.
    </div>`;
  c.height = 0;
  gameStart = false;
  if (score > highScore) {
    highScore = score;
  }
}

function reset() {
  clearInterval(interval);
  movingRect = {};
  origRect = {};
  rects = [];
  speedX = 1;
  score = 0;
}

function showScore() {
  const c = document.getElementById('canvas');
  const ctx = c.getContext("2d");
  ctx.font = '20px Calibri bold';
  ctx.fillStyle = 'white';
  ctx.clearRect(0, 0, window.innerWidth / 4, 17);
  ctx.fillText('Score = ' + score, 10, 17);
  ctx.fillText('High Score = ' + highScore, 100, 17);
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.trunc(Math.random() * 16)];
  }
  return color;
}