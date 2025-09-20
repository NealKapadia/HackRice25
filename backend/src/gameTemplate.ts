// Geometry Dash Game Template
export const geometryDashTemplate = `
// Geometry Dash Style Game Template
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Asset URLs (will be populated by AI when images are generated)
const assetUrls = {
  player: null,
  spike: null,
  platform: null
};

// Game state
const game = {
  player: {
    x: 100,
    y: 300,
    width: 30,
    height: 30,
    velocityY: 0,
    jumping: false,
    grounded: true,
    color: "#00ff00",
    sprite: null // Placeholder for AI-generated sprite
  },
  
  obstacles: [],
  ground: {
    height: 50,
    color: "#333333"
  },
  
  scrollSpeed: 5,
  score: 0,
  gameOver: false,
  frameCount: 0
};

// Sprite objects (loaded from assetUrls)
const sprites = {
  player: null,
  spike: null,
  platform: null
};

// Load sprites from URLs if available
function loadAssets() {
  Object.keys(assetUrls).forEach(key => {
    if (assetUrls[key]) {
      loadImage(assetUrls[key], (img) => {
        sprites[key] = img;
      });
    }
  });
}

// Initialize game
function init() {
  // Reset game state
  game.player.y = canvas.height - game.ground.height - game.player.height;
  game.obstacles = [];
  game.score = 0;
  game.gameOver = false;
  game.frameCount = 0;
  
  // Load any available assets
  loadAssets();
  
  // Generate initial obstacles
  generateObstacle();
}

// Generate random obstacles
function generateObstacle() {
  const types = ['spike', 'platform'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const obstacle = {
    type: type,
    x: canvas.width,
    width: 40,
    height: 40,
    color: type === 'spike' ? '#ff0000' : '#0000ff'
  };
  
  if (type === 'spike') {
    obstacle.y = canvas.height - game.ground.height - obstacle.height;
  } else {
    obstacle.y = canvas.height - game.ground.height - 80 - Math.random() * 100;
  }
  
  game.obstacles.push(obstacle);
}

// Handle input
canvas.addEventListener('click', () => {
  if (!game.gameOver && game.player.grounded) {
    game.player.velocityY = -12;
    game.player.jumping = true;
    game.player.grounded = false;
  } else if (game.gameOver) {
    init();
  }
});

document.addEventListener('keydown', (e) => {
  if ((e.key === ' ' || e.key === 'ArrowUp') && !game.gameOver && game.player.grounded) {
    game.player.velocityY = -12;
    game.player.jumping = true;
    game.player.grounded = false;
  } else if (e.key === 'r' && game.gameOver) {
    init();
  }
});

// Update game logic
function update() {
  if (game.gameOver) return;
  
  game.frameCount++;
  
  // Update player
  game.player.velocityY += 0.6; // Gravity
  game.player.y += game.player.velocityY;
  
  // Ground collision
  if (game.player.y + game.player.height >= canvas.height - game.ground.height) {
    game.player.y = canvas.height - game.ground.height - game.player.height;
    game.player.velocityY = 0;
    game.player.grounded = true;
    game.player.jumping = false;
  }
  
  // Update obstacles
  for (let i = game.obstacles.length - 1; i >= 0; i--) {
    const obstacle = game.obstacles[i];
    obstacle.x -= game.scrollSpeed;
    
    // Remove off-screen obstacles
    if (obstacle.x + obstacle.width < 0) {
      game.obstacles.splice(i, 1);
      game.score++;
    }
    
    // Collision detection
    if (checkCollision(game.player, obstacle)) {
      if (obstacle.type === 'spike') {
        game.gameOver = true;
      } else if (obstacle.type === 'platform' && game.player.velocityY > 0) {
        // Land on platform
        if (game.player.y < obstacle.y) {
          game.player.y = obstacle.y - game.player.height;
          game.player.velocityY = 0;
          game.player.grounded = true;
          game.player.jumping = false;
        }
      }
    }
  }
  
  // Generate new obstacles
  if (game.frameCount % 120 === 0) {
    generateObstacle();
  }
  
  // Increase difficulty
  if (game.frameCount % 600 === 0 && game.scrollSpeed < 10) {
    game.scrollSpeed += 0.5;
  }
}

// Collision detection
function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

// Render game
function draw() {
  // Clear canvas
  ctx.fillStyle = '#87CEEB'; // Sky blue background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw ground
  ctx.fillStyle = game.ground.color;
  ctx.fillRect(0, canvas.height - game.ground.height, canvas.width, game.ground.height);
  
// Draw player
  if (sprites.player) {
    try {
      ctx.drawImage(sprites.player, game.player.x, game.player.y, game.player.width, game.player.height);
    } catch (e) {
      // Fallback if image fails to draw
      ctx.fillStyle = game.player.color;
      ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
    }
  } else {
    ctx.fillStyle = game.player.color;
    ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
  }
  
  // Draw obstacles
  for (const obstacle of game.obstacles) {
    if (sprites[obstacle.type]) {
      try {
        ctx.drawImage(sprites[obstacle.type], obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      } catch (e) {
        // Fallback if image fails to draw
        ctx.fillStyle = obstacle.color;
        if (obstacle.type === 'spike') {
          // Draw triangle for spike
          ctx.beginPath();
          ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
          ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
          ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
      }
    } else {
      ctx.fillStyle = obstacle.color;
      if (obstacle.type === 'spike') {
        // Draw triangle for spike
        ctx.beginPath();
        ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
        ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    }
  }
  
  // Draw score
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('Score: ' + game.score, 20, 40);
  
  // Draw game over message
  if (game.gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = '24px Arial';
    ctx.fillText('Final Score: ' + game.score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Click or press R to restart', canvas.width / 2, canvas.height / 2 + 60);
    ctx.textAlign = 'left';
  }
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Helper function to load images from URLs (for AI-generated assets)
function loadImage(url, callback) {
  const img = new Image();
  img.onload = () => callback(img);
  img.onerror = () => callback(null);
  img.src = url;
}

// Start game
init();
gameLoop();
`;