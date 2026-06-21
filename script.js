const screen = document.getElementById("screen");

const screens = [
  {
    badge: "IZYPENGU DETECTED",
    title: "Welcome back.",
    text: "An important quest has appeared.",
    button: "Continue"
  },
  {
    badge: "NEW QUEST AVAILABLE",
    title: "Special Quest",
    text: "This quest can only be completed by my favourite person to game, laugh, snack, and exist with.",
    button: "Open quest"
  },
  {
    badge: "QUEST DETAILS",
    title: "Main Objective",
    text: "Accept a lifetime co-op campaign with me.",
    quest: [
      "Difficulty: Cozy",
      "Rewards: Unlimited hugs, snacks, inside jokes, and love",
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
  "Are you sure? The quest rewards are really good.",
  "Incorrect input. Please try again.",
  "Error 404: Rejection not found.",
  "The No button has left the lobby.",
  "Please consult your heart and try again."
];

let currentScreen = 0;
let noCount = 0;

function renderScreen() {
  const data = screens[currentScreen];

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
          <div class="button-row">
            <button class="primary" onclick="acceptQuest()">Yes, I accept</button>
          </div>
          <div class="no-zone">
            <button id="noButton" class="secondary no-button" onclick="rejectQuest()">No</button>
          </div>
        </div>
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
  createSparkles(8);
}

function rejectQuest() {
  const noButton = document.getElementById("noButton");
  const zone = document.querySelector(".no-zone");

  if (!noButton || !zone) return;

  noButton.textContent = noMessages[noCount % noMessages.length];

  const zoneWidth = zone.clientWidth;
  const zoneHeight = zone.clientHeight;

  const buttonWidth = Math.min(noButton.offsetWidth || 220, zoneWidth - 10);
  const buttonHeight = noButton.offsetHeight || 50;

  const maxX = Math.max(0, zoneWidth - buttonWidth);
  const maxY = Math.max(0, zoneHeight - buttonHeight);

  const randomX = Math.floor(Math.random() * (maxX + 1));
  const randomY = Math.floor(Math.random() * (maxY + 1));

  noButton.style.left = `${randomX}px`;
  noButton.style.top = `${randomY}px`;
  noButton.style.transform = "none";

  noCount++;
  createSparkles(4);
}

function acceptQuest() {
  screen.innerHTML = `
    <span class="badge">QUEST ACCEPTED</span>
    <h1 class="final-message">Please turn around.</h1>
    <p>Your next reward is waiting in the living room.</p>
  `;
  createSparkles(24);
}

function createSparkles(amount) {
  for (let i = 0; i < amount; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.textContent = ["✨", "⭐", "💖", "🎮"][Math.floor(Math.random() * 4)];
    sparkle.style.left = Math.random() * window.innerWidth + "px";
    sparkle.style.top = window.innerHeight - 80 + Math.random() * 40 + "px";
    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 1500);
  }
}

renderScreen();
