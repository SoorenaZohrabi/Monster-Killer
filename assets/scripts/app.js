const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let monsterHealth = 100;
let playerHealth = 100;
let bonusLife = true;
let isPlayerTurn = true;
let boostedAttack = false;

// Inventory
const inventory = {
  healthPotion: 2,
  powerBoost: 1
};

// Displayed health for animation
let displayedMonsterHealth = 100;
let displayedPlayerHealth = 100;

// Draw health bars
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

// Animate health bar transitions
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

// Game over check
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

// Reset game state
function resetGame() {
  monsterHealth = 100;
  playerHealth = 100;
  bonusLife = true;
  isPlayerTurn = true;
  boostedAttack = false;
  inventory.healthPotion = 2;
  inventory.powerBoost = 1;
}

// Damage calculation with critical/miss/boost
function getDamage(base) {
  const roll = Math.random();
  let damage;

  if (roll < 0.1) {
    logEvent('❌ Your attack missed!');
    damage = 0;
  } else if (roll > 0.9) {
    logEvent('💥 Critical hit!');
    damage = base * 2;
  } else {
    damage = base;
  }

  if (boostedAttack) {
    damage *= 2;
    logEvent('⚡ Boosted attack!');
    boostedAttack = false;
  }

  return damage;
}

// Player attack
function attackMonster(baseDamage) {
  if (!isPlayerTurn) return;

  const damage = getDamage(baseDamage);
  monsterHealth = Math.max(0, monsterHealth - damage);
  logEvent(`You attacked for ${damage} damage.`);
  isPlayerTurn = false;
  setTimeout(monsterAction, 1000);
  checkGameOver();
}

// Player heal
function healPlayer(amount) {
  if (!isPlayerTurn) return;

  playerHealth = Math.min(100, playerHealth + amount);
  logEvent(`You healed for ${amount} HP.`);
  isPlayerTurn = false;
  setTimeout(monsterAction, 1000);
}

// Monster turn
function monsterAction() {
  const roll = Math.random();
  let damage;

  if (roll < 0.1) {
    logEvent('😅 Monster missed its attack!');
    damage = 0;
  } else if (roll > 0.9) {
    damage = Math.floor(Math.random() * 15) + 10;
    logEvent('🔥 Monster lands a critical hit!');
  } else {
    damage = Math.floor(Math.random() * 10) + 5;
    logEvent(`Monster attacks for ${damage} damage.`);
  }

  playerHealth = Math.max(0, playerHealth - damage);
  isPlayerTurn = true;
  checkGameOver();
}

// Use health potion
function useHealthPotion() {
  if (!isPlayerTurn) return;
  if (inventory.healthPotion > 0) {
    inventory.healthPotion--;
    playerHealth = Math.min(100, playerHealth + 30);
    logEvent('🧪 Used Health Potion (+30 HP)');
    isPlayerTurn = false;
    setTimeout(monsterAction, 1000);
  } else {
    logEvent('❌ No Health Potions left!');
  }
}

// Use power boost
function usePowerBoost() {
  if (!isPlayerTurn) return;
  if (inventory.powerBoost > 0) {
    inventory.powerBoost--;
    boostedAttack = true;
    logEvent('⚡ Power Boost activated! Next attack doubled.');
  } else {
    logEvent('❌ No Power Boosts left!');
  }
}

// Log output
function logEvent(message) {
  const logOutput = document.getElementById('log-output');
  const entry = document.createElement('div');
  entry.textContent = message;
  logOutput.appendChild(entry);
  logOutput.scrollTop = logOutput.scrollHeight;
}

// Button listeners
document.getElementById('attack-btn').addEventListener('click', () => attackMonster(10));
document.getElementById('strong-attack-btn').addEventListener('click', () => attackMonster(17));
document.getElementById('heal-btn').addEventListener('click', () => healPlayer(20));
document.getElementById('potion-btn').addEventListener('click', useHealthPotion);
document.getElementById('boost-btn').addEventListener('click', usePowerBoost);
document.getElementById('log-btn').addEventListener('click', () => {
  logEvent(`Monster Health: ${monsterHealth}`);
  logEvent(`Player Health: ${playerHealth}`);
  logEvent(`Bonus Life: ${bonusLife ? 'Active' : 'Used'}`);
  logEvent(`Potions: ${inventory.healthPotion}, Boosts: ${inventory.powerBoost}`);
});

animateHealthBars();
