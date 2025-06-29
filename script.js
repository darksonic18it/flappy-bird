const bird = document.getElementById('bird');
const wing = document.getElementById('wing');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const gameOverMessage = document.getElementById('game-over-message');
const finalScore = document.getElementById('final-score');

const jumpSound = document.getElementById('jump-sound');
const pointSound = document.getElementById('point-sound');
const gameoverSound = document.getElementById('gameover-sound');

let birdTop = 250;
let birdVelocity = 0;
const gravity = 0.5;
const jumpStrength = -8;
let isGameOver = false;
let score = 0;
let highScore = localStorage.getItem("flappyHighScore") || 0;

highScoreDisplay.textContent = highScore;

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isGameOver) {
    birdVelocity = jumpStrength;
    jumpSound.play();
  }
});

function createPipe() {
  const pipeGap = 150;
  const topHeight = Math.floor(Math.random() * 250) + 50;
  const bottomHeight = 600 - topHeight - pipeGap;
  const pipeLeft = 400;

  const topPipe = document.createElement('div');
  topPipe.classList.add('pipe', 'pipe-top');
  topPipe.style.setProperty('--top-height', topHeight + 'px');
  topPipe.style.left = pipeLeft + 'px';

  const bottomPipe = document.createElement('div');
  bottomPipe.classList.add('pipe', 'pipe-bottom');
  bottomPipe.style.setProperty('--bottom-height', bottomHeight + 'px');
  bottomPipe.style.left = pipeLeft + 'px';

  document.getElementById('game-container').appendChild(topPipe);
  document.getElementById('game-container').appendChild(bottomPipe);

  let movePipe = setInterval(() => {
    if (isGameOver) {
      clearInterval(movePipe);
      topPipe.remove();
      bottomPipe.remove();
      return;
    }

    let left = parseInt(topPipe.style.left);
    topPipe.style.left = (left - 2) + 'px';
    bottomPipe.style.left = (left - 2) + 'px';

    // Collision
    if (left < 120 && left > 40) {
      if (birdTop < topHeight || birdTop > topHeight + pipeGap) {
        gameOver();
      }
    }

    if (left === 40) {
      score++;
      pointSound.play();
      scoreDisplay.textContent = score;

      if (score > highScore) {
        highScore = score;
        localStorage.setItem("flappyHighScore", highScore);
        highScoreDisplay.textContent = highScore;
      }

      if (score >= 100) {
        gameOver();
      }
    }

    if (left < -60) {
      topPipe.remove();
      bottomPipe.remove();
    }
  }, 20);
}

function updateBird() {
  if (isGameOver) return;

  birdVelocity += gravity;
  birdTop += birdVelocity;

  if (birdTop < 0) birdTop = 0;
  if (birdTop > 560) gameOver();

  bird.style.top = birdTop + 'px';
}

function gameOver() {
  isGameOver = true;
  finalScore.textContent = score;
  gameoverSound.play();
  gameOverMessage.style.display = "block";
}

function restartGame() {
  location.reload();
}

setInterval(updateBird, 20);
setInterval(() => {
  if (!isGameOver) createPipe();
}, 1500);
