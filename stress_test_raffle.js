const seedrandom = require("seedrandom");
const fs = require("fs");

// Hash from block #14150000
const hash =
  "0x6bb1a0f434b7b2a13c25c7758b3aa4599e1cd12ff71c9b202aa0d7b65f0214f8";

// isolate all numeric values from hash. ouput: '0610434721325775834599112719202076502148'

const seed = hash.replace(/[a-zA-Z]/g, "");

console.log("seed", seed);

const rng = seedrandom(seed);

const raffle = JSON.parse(fs.readFileSync("dremica_test_players.json"));

const list = raffle.filter((item) => item.present > 0);

// sort by amount in descending order
list.sort((a, b) => b.present - a.present);

// extracting names and weights list
const names = [];
const weights = [];
list
  .filter((item) => item["present"] !== "0")
  .map((item) => {
    names.push(item["GamerTag"]);
    weights.push(item["present"]);
    });

// draw 3 unique winner
const winnersList = [];
for (let round = 0; round < 3; round++) {
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

fs.writeFileSync("Dremica_stress_winner.json", JSON.stringify(sortedWinners, null, 2));
