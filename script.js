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
    text: "This quest can only be completed by my favourite person to game, laugh, snack, and exist with.",
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
  const noButton = document.getElementById("noButton");
  const noMessage = document.getElementById("noMessage");

  if (!noButton || !noMessage) return;

  noMessage.textContent = noMessages[noCount % noMessages.length];

  // Small avoidance animation only on the first No click
  if (noCount === 0) {
    noButton.classList.add("avoid-once");

    setTimeout(() => {
      noButton.classList.remove("avoid-once");
    }, 450);
  }

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

renderScreen();
setTimeout(() => createSparkles(35), 400);

renderScreen();
