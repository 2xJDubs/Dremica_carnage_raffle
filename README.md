# Dremica-carnage-raffle

To pick the Bigger Boy Head raffle winners via a publicly verifiable random seed - we’ll be using the hash from Exosama network block #13836000. The alphabetic values will be stripped from the hash and only the numeric values will be used as the seed.

https://explorer.exosama.com/block/13836000/transactions

```
yarn
node drawing.js
```

Then check [drawing_winner](./drawing_winner.json).

Added Stress Test Raffle to be used for other Dremica raffles not related to Bigger Boy.  This raffle will use a publicly verifiable random seed - we’ll be using the hash from Exosama network block #14150000.  The alphabetic values will be stripped from the hash and only the numeric values will be used as the seed.

https://explorer.exosama.com/block/14150000/transactions

```
yarn
node stres_test_raffle.js
```

Then check [raffle_winner](./raffle_winner.json).