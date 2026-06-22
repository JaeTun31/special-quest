const screen = document.getElementById("screen");

const screens = [
  {
    badge: "IZYPENGU DETECTED",
    title: "Welcome!",
    text: "An important quest has appeared.",
    button: "Continue"
  },
  {
    badge: "NEW QUEST AVAILABLE",
    title: "Special Quest",
    text: "This quest can only be completed by my favourite person to exist with.",
    button: "Open quest"
  },
  {
    badge: "QUEST DETAILS",
    title: "Main Objective",
    text: "Accept a lifetime co-op campaign with me.",
    quest: [
      "Difficulty: Easy",
      "Rewards: Unlimited cuddles, food, bum-bum playtime, and love",
      "Required party members: You + me"
    ],
    button: "Review choice"
  },
  {
    badge: "FINAL CONFIRMATION",
    title: "Will you be my forever duo partner?",
    text: "Choose carefully. This may affect the entire storyline.",
    proposal: true
  }
];

const noMessages = [
  "No option temporarily unavailable.",
  "Incorrect input. Please try again.",
  "Error 404: Rejection not found.",
  "The No button has left the lobby.",
  "Please consult your heart and try again."
];

let currentScreen = 0;
let noCount = 0;

function renderScreen() {
  const data = screens[currentScreen];

  if (data.game) {
    screen.innerHTML = `
      <span class="badge">${data.badge}</span>
      <h1>${data.title}</h1>
      <p>${data.text}</p>

      <div class="game-wrap">
        <canvas id="questGame" width="720" height="420"></canvas>
      </div>

      <p class="game-hint">← → move &nbsp; | &nbsp; Space / ↑ jump</p>
    `;

    startPlatformer();
    return;
  }

  screen.innerHTML = `
    <span class="badge">${data.badge}</span>
    <h1>${data.title}</h1>
    <p>${data.text}</p>
    ${data.quest ? `
      <div class="quest-box">
        ${data.quest.map(item => `<p>✦ ${item}</p>`).join("")}
      </div>
    ` : ""}
    ${
      data.proposal
        ? `
        <div class="proposal-buttons">
          <button class="primary" onclick="acceptQuest()">Yes, I accept</button>
          <button id="noButton" class="secondary no-button" onclick="rejectQuest()">No</button>
        </div>
        <p id="noMessage" class="no-message"></p>
      `
        : `
        <div class="buttons">
          <button class="primary" onclick="nextScreen()">${data.button}</button>
        </div>
      `
    }
  `;
}

function nextScreen() {
  currentScreen++;
  renderScreen();
}

function rejectQuest() {
  const noMessage = document.getElementById("noMessage");

  if (!noMessage) return;

  noMessage.textContent = noMessages[noCount % noMessages.length];

  noCount++;
}

function acceptQuest() {
  screen.innerHTML = `
    <span class="badge">QUEST ACCEPTED</span>
    <h1 class="final-message">Please turn around.</h1>
    <p>Your next reward is waiting in the living room.</p>
  `;
}

function createSparkles(amount) {
  const icons = ["✨", "⭐", "💖", "🎮", "🌸", "💫", "💕"];

  for (let i = 0; i < amount; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.textContent = icons[Math.floor(Math.random() * icons.length)];

    sparkle.style.left = Math.random() * window.innerWidth + "px";
    sparkle.style.top = Math.random() * window.innerHeight + "px";

    sparkle.style.setProperty("--move-x", `${Math.random() * 240 - 120}px`);
    sparkle.style.setProperty("--move-y", `${Math.random() * 240 - 120}px`);
    sparkle.style.setProperty("--rotate", `${Math.random() * 360}deg`);
    sparkle.style.setProperty("--size", `${18 + Math.random() * 18}px`);

    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 1800);
  }
}

/* -----------------------------
   Platforming Quest Game
----------------------------- */

let platformGameActive = false;
let platformAnimationId = null;

const gameKeys = {
  left: false,
  right: false,
  jump: false
};

window.addEventListener("keydown", (event) => {
  if (!platformGameActive) return;

  if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === "ArrowLeft") gameKeys.left = true;
  if (event.key === "ArrowRight") gameKeys.right = true;
  if (event.key === "ArrowUp" || event.key === " ") gameKeys.jump = true;

  // Hidden emergency shortcut: Shift + P completes the game
  if (event.shiftKey && event.key.toLowerCase() === "p") {
    completePlatformQuest();
  }
});

window.addEventListener("keyup", (event) => {
  if (!platformGameActive) return;

  if (event.key === "ArrowLeft") gameKeys.left = false;
  if (event.key === "ArrowRight") gameKeys.right = false;
  if (event.key === "ArrowUp" || event.key === " ") gameKeys.jump = false;
});

function startPlatformer() {
  const canvas = document.getElementById("questGame");
  const ctx = canvas.getContext("2d");

  if (platformAnimationId) {
    cancelAnimationFrame(platformAnimationId);
  }

  platformGameActive = true;

  const world = {
    width: 720,
    height: 2750
  };

  const player = {
    x: 70,
    y: world.height - 100,
    width: 44,
    height: 54,
    vx: 0,
    vy: 0,
    speed: 0.72,
    maxSpeed: 6.4,
    jumpPower: 14.5,
    gravity: 0.62,
    friction: 0.82,
    onGround: false,
    spawnX: 70,
    spawnY: world.height - 100
  };

  const ring = {
    x: 590,
    y: 72,
    radius: 28
  };

  const platforms = [
    { x: 0, y: 2715, width: 720, height: 35 },

    { x: 55, y: 2575, width: 210, height: 22 },
    { x: 360, y: 2445, width: 185, height: 22 },
    { x: 110, y: 2315, width: 170, height: 22 },
    { x: 420, y: 2185, width: 190, height: 22 },

    { x: 250, y: 2045, width: 165, height: 22 },
    { x: 45, y: 1905, width: 175, height: 22 },
    { x: 335, y: 1775, width: 160, height: 22 },
    { x: 530, y: 1645, width: 145, height: 22 },

    { x: 305, y: 1510, width: 150, height: 22 },
    { x: 70, y: 1375, width: 175, height: 22 },
    { x: 355, y: 1240, width: 195, height: 22 },
    { x: 150, y: 1105, width: 150, height: 22 },

    { x: 475, y: 970, width: 170, height: 22 },
    { x: 265, y: 835, width: 160, height: 22 },
    { x: 55, y: 700, width: 165, height: 22 },
    { x: 335, y: 565, width: 175, height: 22 },

    { x: 525, y: 430, width: 150, height: 22 },
    { x: 315, y: 295, width: 185, height: 22 },
    { x: 510, y: 160, width: 170, height: 22 }
  ];

  const playerImg = new Image();
  playerImg.src = "chopper.png";

  const helperImg = new Image();
  helperImg.src = "serapine.png";

  let cameraY = world.height - canvas.height;

  function update() {
    const previousY = player.y;

    if (gameKeys.left) {
      player.vx -= player.speed;
    }

    if (gameKeys.right) {
      player.vx += player.speed;
    }

    player.vx = Math.max(-player.maxSpeed, Math.min(player.maxSpeed, player.vx));

    if (gameKeys.jump && player.onGround) {
      player.vy = -player.jumpPower;
      player.onGround = false;
    }

    player.vy += player.gravity;
    player.x += player.vx;
    player.y += player.vy;

    player.vx *= player.friction;

    if (player.x < 0) {
      player.x = 0;
      player.vx = 0;
    }

    if (player.x + player.width > world.width) {
      player.x = world.width - player.width;
      player.vx = 0;
    }

    player.onGround = false;

    for (const platform of platforms) {
      const wasAbove = previousY + player.height <= platform.y;
      const isFalling = player.vy >= 0;
      const overlapsX =
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width;
      const landsOnPlatform =
        player.y + player.height >= platform.y &&
        player.y + player.height <= platform.y + platform.height + 18;

      if (wasAbove && isFalling && overlapsX && landsOnPlatform) {
        player.y = platform.y - player.height;
        player.vy = 0;
        player.onGround = true;

        // Checkpoint only updates when she reaches a higher platform
        if (platform.y < player.spawnY) {
          player.spawnX = platform.x + 20;
          player.spawnY = platform.y - player.height;
        }
      }
    }

    // If she falls too far, return to the last checkpoint
    if (player.y > player.spawnY + 520) {
      player.x = player.spawnX;
      player.y = player.spawnY;
      player.vx = 0;
      player.vy = 0;
    }

    const targetCameraY = Math.max(
      0,
      Math.min(world.height - canvas.height, player.y - canvas.height * 0.55)
    );

    cameraY += (targetCameraY - cameraY) * 0.09;

    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    const distanceToRing = Math.hypot(playerCenterX - ring.x, playerCenterY - ring.y);

    if (distanceToRing < 50) {
      completePlatformQuest();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGameBackground(ctx, canvas);

    ctx.save();
    ctx.translate(0, -cameraY);

    drawStars(ctx, world.height);

    for (const platform of platforms) {
      drawPlatform(ctx, platform);
    }

    drawRing(ctx, ring.x, ring.y);

    drawHelper(ctx, helperImg, 70, 72);

    drawPlayer(ctx, player, playerImg);

    ctx.restore();

    drawGameUI(ctx, canvas, player, world);
  }

  function loop() {
    if (!platformGameActive) return;

    update();
    draw();

    platformAnimationId = requestAnimationFrame(loop);
  }

  loop();
}

function completePlatformQuest() {
  platformGameActive = false;

  if (platformAnimationId) {
    cancelAnimationFrame(platformAnimationId);
  }

  currentScreen++;
  renderScreen();
}

function drawGameBackground(ctx, canvas) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#31183d");
  gradient.addColorStop(0.55, "#4a274f");
  gradient.addColorStop(1, "#6b3a68");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStars(ctx, worldHeight) {
  ctx.save();
  ctx.fillStyle = "rgba(255, 220, 235, 0.55)";

  for (let i = 0; i < 90; i++) {
    const x = (i * 83) % 720;
    const y = (i * 179) % worldHeight;
    const size = 1.5 + (i % 3);

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawPlatform(ctx, platform) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 209, 220, 0.95)";
  roundRect(ctx, platform.x, platform.y, platform.width, platform.height, 12);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
  roundRect(ctx, platform.x + 8, platform.y + 4, platform.width - 16, 5, 6);
  ctx.fill();

  ctx.restore();
}

function drawRing(ctx, x, y) {
  ctx.save();

  ctx.font = "42px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("💍", x, y);

  ctx.restore();
}

function drawHelper(ctx, image, x, y) {
  ctx.save();

  if (image.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, x, y, 82, 82);
  } else {
    ctx.fillStyle = "rgba(255, 209, 220, 0.8)";
    roundRect(ctx, x, y, 82, 82, 22);
    ctx.fill();

    ctx.fillStyle = "#402236";
    ctx.font = "12px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText("Helper", x + 41, y + 45);
  }

  ctx.restore();
}

function drawPlayer(ctx, player, image) {
  ctx.save();

  if (image.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, player.x - 8, player.y - 10, player.width + 16, player.height + 16);
  } else {
    ctx.fillStyle = "#ffd1dc";
    roundRect(ctx, player.x, player.y, player.width, player.height, 14);
    ctx.fill();

    ctx.fillStyle = "#402236";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("♡", player.x + player.width / 2, player.y + 34);
  }

  ctx.restore();
}

function drawGameUI(ctx, canvas, player, world) {
  const progress = Math.max(
    0,
    Math.min(100, Math.round(((world.height - player.y) / world.height) * 100))
  );

  ctx.save();

  ctx.fillStyle = "rgba(38, 22, 46, 0.65)";
  roundRect(ctx, 18, 18, 190, 42, 16);
  ctx.fill();

  ctx.fillStyle = "#fff7fb";
  ctx.font = "700 16px Trebuchet MS";
  ctx.textAlign = "left";
  ctx.fillText(`Quest progress: ${progress}%`, 34, 45);

  ctx.fillStyle = "rgba(255, 209, 220, 0.95)";
  roundRect(ctx, canvas.width - 160, 18, 138, 42, 16);
  ctx.fill();

  ctx.fillStyle = "#402236";
  ctx.font = "700 15px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("Reach the ring", canvas.width - 91, 45);

  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

renderScreen();
setTimeout(() => createSparkles(35), 400);
