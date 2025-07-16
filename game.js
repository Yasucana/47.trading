function createCard() {
  return {
    hp: 10 + Math.floor(Math.random() * 6),
    atk: 3 + Math.floor(Math.random() * 4),
    alive: true
  };
}

let deck1 = Array.from({length: 5}, createCard);
let deck2 = Array.from({length: 5}, createCard);
let currentPlayer = 1;

function render() {
  const p1 = document.getElementById("player1");
  const p2 = document.getElementById("player2");
  p1.innerHTML = deck1.map((c, i) =>
    `<div class="card ${!c.alive ? 'dead' : ''}" onclick="playTurn(1,${i})">HP:${c.hp}<br>ATK:${c.atk}</div>`).join('');
  p2.innerHTML = deck2.map((c, i) =>
    `<div class="card ${!c.alive ? 'dead' : ''}" onclick="playTurn(2,${i})">HP:${c.hp}<br>ATK:${c.atk}</div>`).join('');
}

function playTurn(player, index) {
  if (player !== currentPlayer) return;
  let attacker = (player === 1 ? deck1 : deck2)[index];
  if (!attacker.alive) return;

  let opponentDeck = player === 1 ? deck2 : deck1;
  let target = opponentDeck.find(c => c.alive);
  if (!target) return;

  target.hp -= attacker.atk;
  log(`Player ${player} attacks for ${attacker.atk} damage!`);
  if (target.hp <= 0) {
    target.alive = false;
    log(`A card was defeated!`);
  }

  if (!opponentDeck.some(c => c.alive)) {
    log(`Player ${player} wins!`);
    disableAll();
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  render();
}

function log(msg) {
  const log = document.getElementById("log");
  log.innerHTML += msg + "<br>";
  log.scrollTop = log.scrollHeight;
}

function disableAll() {
  document.querySelectorAll('.card').forEach(c => c.onclick = null);
}

render();
