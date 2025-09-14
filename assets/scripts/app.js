const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let monsterHealth = 100;
let playerHealth = 100;
let bonusLife = true;

let displayedMonsterHealth = 100;
let displayedPlayerHealth = 100;

function drawHealthBars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.font = '20px Segoe UI';
  ctx.fillText('Monster Health', 50, 40);
  ctx.fillStyle = '#4caf50';
  ctx.fillRect(50, 50, displayedMonsterHealth * 5, 20);

  ctx.fillStyle = '#fff';
  ctx.fillText('Player Health', 50, 100);
  ctx.fillStyle = '#f44336';
  ctx.fillRect(50, 110, displayedPlayerHealth * 5, 20);

  if (bonusLife) {
    ctx.fillStyle = '#ff0062';
    ctx.font = 'bold 18px Segoe UI';
    ctx.fillText('Bonus Life: 1', 650, 40);
  }
}

function animateHealthBars() {
  const speed = 1;

  if (displayedMonsterHealth !== monsterHealth) {
    displayedMonsterHealth += Math.sign(monsterHealth - displayedMonsterHealth) * Math.min(Math.abs(monsterHealth - displayedMonsterHealth), speed);
  }

  if (displayedPlayerHealth !== playerHealth) {
    displayedPlayerHealth += Math.sign(playerHealth - displayedPlayerHealth) * Math.min(Math.abs(playerHealth - displayedPlayerHealth), speed);
  }

  drawHealthBars();
  requestAnimationFrame(animateHealthBars);
}

function checkGameOver() {
  if (monsterHealth <= 0) {
    logEvent('🎉 You defeated the monster!');
    alert('🎉 You defeated the monster!');
    resetGame();
  } else if (playerHealth <= 0) {
    if (bonusLife) {
      bonusLife = false;
      playerHealth = 100;
      logEvent('🛡️ Bonus life saved you!');
      alert('🛡️ Bonus life saved you!');
    } else {
      logEvent('💀 Game Over! The monster wins.');
      alert('💀 Game Over! The monster wins.');
      resetGame();
    }
  }
}

function resetGame() {
  monsterHealth = 100;
  playerHealth = 100;
  bonusLife = true;
}

function attackMonster(damage) {
  monsterHealth = Math.max(0, monsterHealth - damage);
  playerHealth = Math.max(0, playerHealth - 14);
  logEvent(`You attacked for ${damage} damage. Monster retaliated.`);
  checkGameOver();
}

function healPlayer(amount) {
  playerHealth = Math.min(100, playerHealth + amount);
  logEvent(`You healed for ${amount} HP.`);
}

function logEvent(message) {
  const logOutput = document.getElementById('log-output');
  const entry = document.createElement('div');
  entry.textContent = message;
  logOutput.appendChild(entry);
}

document.getElementById('attack-btn').addEventListener('click', () => attackMonster(10));
document.getElementById('strong-attack-btn').addEventListener('click', () => attackMonster(17));
document.getElementById('heal-btn').addEventListener('click', () => healPlayer(20));
document.getElementById('log-btn').addEventListener('click', () => {
  logEvent(`Monster Health: ${monsterHealth}`);
  logEvent(`Player Health: ${playerHealth}`);
  logEvent(`Bonus Life: ${bonusLife ? 'Active' : 'Used'}`);
});

animateHealthBars();
