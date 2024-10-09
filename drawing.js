const seedrandom = require("seedrandom");
const fs = require("fs");

// Hash from block #12410000
const hash =
  "0x9b5b5adde42ed7175428fc4f6331219565b9e339954c9730bd3009f80d9f65cf";

// isolate all numeric values from hash. ouput: '09554271754284633121956593399549730300980965'

const seed = hash.replace(/[a-zA-Z]/g, "");

console.log("seed", seed);

const rng = seedrandom(seed);

const raffle = JSON.parse(fs.readFileSync("dremica-raffle-2024-10-06.json"));

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
