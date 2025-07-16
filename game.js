let playerDeck = [], aiDeck = [], selected = null, aiLevel = 1;

function startGame() {
  document.getElementById("game").style.display = "flex";
  aiLevel = parseInt(document.getElementById("difficulty").value);
  playerDeck = generateDeck();
  aiDeck = generateDeck();
  selected = null;
  log("Game Started!");
  render();
}

function generateDeck() {
  const types = ["attack", "defense", "magic", "trap"];
  return Array.from({ length: 5 }, () => {
    const maxHp = 10 + Math.floor(Math.random() * 6);
    return {
      maxHp,
      currentHp: maxHp,
      atk: 3 + Math.floor(Math.random() * 4),
      type: types[Math.floor(Math.random() * types.length)],
      alive: true
    };
  });
}

function render() {
  const playerDiv = document.getElementById("player");
  const aiDiv = document.getElementById("ai");
  const selectedDiv = document.getElementById("selectedCard");

  playerDiv.innerHTML = "";
  aiDiv.innerHTML = "";
  selectedDiv.innerHTML = "";

  playerDeck.forEach((card, i) => {
    const div = createCardDiv(card, i, true);
    if (i === selected) div.classList.add("selected");
    playerDiv.appendChild(div);
  });

  aiDeck.forEach((card, i) => {
    const div = createCardDiv(card, i, false);
    aiDiv.appendChild(div);
  });

  if (selected !== null && playerDeck[selected]) {
    const selDiv = createCardDiv(playerDeck[selected], selected, true);
    selDiv.classList.add("selected");
    selectedDiv.appendChild(selDiv);
  }
}

function createCardDiv(card, index, isPlayer) {
  const div = document.createElement("div");
  div.className = `card ${card.type}`;
  if (!card.alive) div.classList.add("dead");

  div.innerHTML = `
    <strong>${card.type.toUpperCase()}</strong><br>
    HP: ${card.currentHp}/${card.maxHp}<br>
    ATK: ${card.atk}
  `;

  if (card.alive) {
    if (isPlayer) {
      div.onclick = () => {
        selected = index;
        render();
      };
    } else if (selected !== null) {
      div.onclick = () => attack(selected, index);
    }
  }

  return div;
}

function attack(playerIndex, aiIndex) {
  const pCard = playerDeck[playerIndex];
  const aCard = aiDeck[aiIndex];
  if (!pCard.alive || !aCard.alive) return;

  aCard.currentHp -= pCard.atk;
  log(`You attacked AI's ${aCard.type} for ${pCard.atk} damage!`);

  if (aCard.currentHp <= 0) {
    aCard.alive = false;
    log("AI card defeated!");
  }

  selected = null;
  render();

  if (aiDeck.every(c => !c.alive)) {
    winGame();
    return;
  }

  setTimeout(aiTurn, 1000);
}

function aiTurn() {
  const aiCard = chooseAICard();
  const target = playerDeck.find(c => c.alive);
  if (!target || !aiCard) return;

  target.currentHp -= aiCard.atk;
  log(`AI attacks with ${aiCard.type} for ${aiCard.atk} damage!`);
  if (target.currentHp <= 0) {
    target.alive = false;
    log("Your card was defeated!");
  }

  if (playerDeck.every(c => !c.alive)) {
    log("AI wins!");
    disable();
  }

  render();
}

function chooseAICard() {
  const alive = aiDeck.filter(c => c.alive);
  if (aiLevel <= 3) return alive[Math.floor(Math.random() * alive.length)];
  return alive.sort((a, b) => b.atk - a.atk)[0];
}

function winGame() {
  log("You win!");
  const available = aiDeck.filter(c => c.alive);
  if (available.length) {
    const reward = JSON.parse(JSON.stringify(available[Math.floor(Math.random() * available.length)]));
    reward.currentHp = reward.maxHp;
    playerDeck.push(reward);
    log(`You gained a card: ${reward.type.toUpperCase()}!`);
  }
  disable();
}

function disable() {
  document.querySelectorAll(".card").forEach(c => c.onclick = null);
}

function log(msg) {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML += msg + "<br>";
  logDiv.scrollTop = logDiv.scrollHeight;
}
