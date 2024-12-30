const seedrandom = require("seedrandom");
const fs = require("fs");

// Hash from block #13836000
const hash =
  "0x7fe1c1bcfdc18d98e5f9e3d667f1f552f890df5d6ad45e8d771e6b4e6d6f24ef";

// isolate all numeric values from hash. ouput: '07111898593667155289056458771646624'

const seed = hash.replace(/[a-zA-Z]/g, "");

console.log("seed", seed);

const rng = seedrandom(seed);

const raffle = JSON.parse(fs.readFileSync("dremica-raffle-2024-12-29.json"));

const list = raffle.filter((item) => item.head > 0);

// sort by amount in descending order
list.sort((a, b) => b.amount - a.amount);

// extracting names and weights list
const names = [];
const weights = [];
list
  .filter((item) => item["head"] !== "0")
  .map((item) => {
    names.push(item["gamerTag"]);
    weights.push(item["head"]);
  });

// draw 1 unique winner
const winnersList = [];
for (let round = 0; round < 1; round++) {
  const rnd = rng();

  let random = rnd * weights.reduce((a, b) => a + b, 0);

  let i = 0;
  for (i; i < weights.length; i++) {
    if (random < weights.slice(0, i + 1).reduce((a, b) => a + b, 0)) {
      const winner = names[i];
      if (winnersList.includes(winner)) {
        // continue drawing until unique winner is found
        round--;
        break;
      } else {
        winnersList.push(winner);
        break;
      }
    }
  }
}

// count winners
const winners = {};
winnersList.map((winner) => {
  if (winners[winner]) {
    winners[winner]++;
  } else {
    winners[winner] = 1;
  }
});

// sort winner list from high to low
const sortedWinners = Object.entries(winners)
  .sort((a, b) => b[1] - a[1])
  .reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});

fs.writeFileSync("Dremica_drawing_winner.json", JSON.stringify(sortedWinners, null, 2));
