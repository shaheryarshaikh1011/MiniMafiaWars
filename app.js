const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let money = 1000;
let health = 100;
const inventory = [];
let equippedWeapon = null;
let equippedClothes = null;
let gamesPlayed = 0;


const weapons = [
  { name: "Knife", damage: 20 },
  { name: "Pistol", damage: 40 },
  { name: "Shotgun", damage: 60 }
];
const foods = [
    { name: "Apple", healing: 10 },
    { name: "Burger", healing: 20 },
    { name: "Pizza", healing: 30 }
  ];
  function displayStatus() {
    console.log(`Current money: $${money}`);
    console.log(`Health: ${health}%`);
    console.log("Inventory:", inventory.join(', '));
    if (equippedWeapon) console.log("Equipped Weapon:", equippedWeapon);
    if (equippedClothes) console.log("Equipped Clothes:", equippedClothes);
  }
  function handleGameOver() {
    console.log("Your health has reached 0%. Game over!");
    rl.question('Do you want to play again? (yes/no): ', (answer) => {
      if (answer.toLowerCase() === 'yes') {
        money = 1000;
        health = 100;
        inventory.length = 0;
        equippedWeapon = null;
        equippedClothes = null;
        gamesPlayed++;
        startGame();
      } else {
        console.log("Thanks for playing!");
        rl.close();
      }
    });
  }
function buyItem(itemName, cost) {
    if (money >= cost) {
      money -= cost;
      inventory.push(itemName);
      console.log(`You bought ${itemName} for $${cost}.`);
      displayStatus();
    } else {
      console.log("You don't have enough money.");
    }
  }
  
  function equipItem(itemName) {
    if (inventory.includes(itemName)) {
      if (weapons.some(weapon => weapon.name === itemName)) {
        equippedWeapon = itemName;
        console.log(`You equipped ${itemName}.`);
      } else if (itemName.includes("Clothes")) {
        equippedClothes = itemName;
        console.log(`You equipped ${itemName}.`);
      } else {
        console.log("You can't equip that item.");
      }
    } else {
      console.log("You don't have that item.");
    }
    displayStatus();
  }
  function eatFood(foodName) {
    const selectedFood = foods.find(food => food.name.toLowerCase() === foodName.toLowerCase());
    if (selectedFood) {
      if (health < 100) {
        health = Math.min(100, health + selectedFood.healing);
        console.log(`You ate ${foodName} and gained ${selectedFood.healing}% health.`);
      } else {
        console.log("Your health is already at 100%.");
      }
    } else {
      console.log("Invalid food choice.");
    }
    displayStatus();
  }
  
  function sleep() {
    if (health < 100) {
      health = Math.min(100, health + 20); // Sleeping restores 20% health
      console.log("You slept and regained 20% health.");
    } else {
      console.log("You're already at full health.");
    }
    displayStatus();
  }
  
function casino() {
  const gambleAmount = Math.floor(Math.random() * 100) + 1;
  const win = Math.random() < 0.5;

  if (win) {
    money += gambleAmount;
    console.log(`You won $${gambleAmount} at the casino!`);
  } else {
    money -= gambleAmount;
    console.log(`You lost $${gambleAmount} at the casino.`);
  }

  displayStatus();
}

function fightEnemy() {
  let playerPower = Math.floor(Math.random() * 50) + 1; // Base player power
  const enemyPower = Math.floor(Math.random() * 50) + 1;

  if (playerPower > enemyPower) {
    money += 50;
    console.log("You defeated the enemy and earned $50.");
  } else {
    health -= 20;
    console.log("You were defeated by the enemy and lost 20% health.");
    if (health <= 0) {
      handleGameOver();
      return;
    }
  }

  displayStatus();
}

function rouletteGame() {
    const betAmount = 50;
    const betOptions = ["red", "black"];
    const winningOption = betOptions[Math.floor(Math.random() * betOptions.length)];
  
    rl.question(`Place your bet (${betAmount}$) on red or black: `, (userChoice) => {
      if (betOptions.includes(userChoice)) {
        if (userChoice === winningOption) {
          money += betAmount;
          console.log(`Congratulations! You won ${betAmount}$.`);
        } else {
          money -= betAmount;
          console.log(`Sorry, you lost ${betAmount}$.`);
        }
      } else {
        console.log("Invalid bet option.");
      }
  
      displayStatus();
      startGame();
    });
  }
  
function slotMachineGame() {
    const slotSymbols = ["cherry", "lemon", "orange", "plum", "bell", "bar", "7"];
    const betAmount = 25;
  
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(slotSymbols[Math.floor(Math.random() * slotSymbols.length)]);
    }
  
    const uniqueSymbols = new Set(result);
    const winAmount = uniqueSymbols.size === 1 ? 3 * betAmount : 0;
  
    console.log(`Result: ${result.join(' | ')}`);
    if (winAmount > 0) {
      money += winAmount;
      console.log(`Congratulations! You won ${winAmount}$.`);
    } else {
      money -= betAmount;
      console.log(`Sorry, you lost ${betAmount}$.`);
    }
  
    displayStatus();
    startGame();
  }
  
function blackjackGame() {
    const betAmount = 100;
    const deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const playerHand = [];
    const dealerHand = [];
  
    function calculateHandValue(hand) {
      let sum = 0;
      let numAces = 0;
      for (const card of hand) {
        if (card === "A") {
          numAces++;
          sum += 11;
        } else if (card === "K" || card === "Q" || card === "J") {
          sum += 10;
        } else {
          sum += parseInt(card);
        }
      }
      while (sum > 21 && numAces > 0) {
        sum -= 10;
        numAces--;
      }
      return sum;
    }
  
    function dealInitialHands() {
      playerHand.push(deck[Math.floor(Math.random() * deck.length)]);
      playerHand.push(deck[Math.floor(Math.random() * deck.length)]);
      dealerHand.push(deck[Math.floor(Math.random() * deck.length)]);
      console.log(`Your hand: ${playerHand.join(', ')}`);
    }
  
    dealInitialHands();
  
    rl.question('Do you want to "hit" or "stand"? ', (choice) => {
      if (choice === "hit") {
        playerHand.push(deck[Math.floor(Math.random() * deck.length)]);
        console.log(`Your hand: ${playerHand.join(', ')}`);
        const playerValue = calculateHandValue(playerHand);
        if (playerValue > 21) {
          console.log("Bust! You lost.");
          money -= betAmount;
          displayStatus();
          startGame();
        } else {
          blackjackGame();
        }
      } else if (choice === "stand") {
        while (calculateHandValue(dealerHand) < 17) {
          dealerHand.push(deck[Math.floor(Math.random() * deck.length)]);
        }
        console.log(`Dealer's hand: ${dealerHand.join(', ')}`);
        const dealerValue = calculateHandValue(dealerHand);
  
        if (dealerValue > 21 || playerHand.length === 2 && calculateHandValue(playerHand) === 21) {
          console.log("You won!");
          money += betAmount;
        } else if (dealerValue > calculateHandValue(playerHand)) {
          console.log("Dealer won.");
          money -= betAmount;
        } else if (dealerValue === calculateHandValue(playerHand)) {
          console.log("It's a tie.");
        } else {
          console.log("You won!");
          money += betAmount;
        }
  
        displayStatus();
        startGame();
      } else {
        console.log("Invalid choice.");
        blackjackGame();
      }
    });
  }
  function casino() {
    rl.question('Welcome to the casino! Choose a game to play:\n1. Roulette\n2. Slot Machine\n3. Blackjack\n4. Back to Main Menu\n', (choice) => {
      switch (choice) {
        case '1':
          rouletteGame();
          break;
        case '2':
          slotMachineGame();
          break;
        case '3':
          blackjackGame();
          break;
        case '4':
          console.log("Leaving the casino.");
          startGame();
          break;
        default:
          console.log("Invalid choice.");
          casino();
          break;
      }
    });
  }

  function explore() {
    const chance = Math.random();
    if (chance < 0.6) {
      const foundMoney = Math.floor(Math.random() * 50) + 1;
      money += foundMoney;
      console.log(`You found $${foundMoney} while exploring.`);
    } else {
      console.log("You didn't find anything while exploring.");
    }
    startGame();
  }
  
function startGame() {
    rl.question('Welcome to Mafia Wars! What would you like to do?\n1. Buy Weapon\n2. Equip Item\n3. Eat Food\n4. Sleep\n5. Go to Casino\n6. Fight Enemy\n7. Quit\n8. Explore \n * Stats\n', (choice) => {
      switch (choice) {
        case '*': // Pressing "*" key displays status
          displayStatus();
          startGame();
        break;
        case '1':
          rl.question('Choose a weapon to buy: Knife, Pistol, Shotgun: ', (weaponChoice) => {
            const selectedWeapon = weapons.find(weapon => weapon.name.toLowerCase() === weaponChoice.toLowerCase());
            if (selectedWeapon) {
              buyItem(selectedWeapon.name, 200);  // Weapons cost $200
            } else {
              console.log("Invalid weapon choice.");
            }
            startGame();
          });
          return;
        case '2':
            if (inventory.length === 0) {
                console.log("Your inventory is empty. Buy items first.");
              } else {
                rl.question('Enter the name of the item you want to equip: ', (itemName) => {
                  equipItem(itemName);
                  startGame();
                });
                return;
                }
                break;
        case '3':
          rl.question('Choose a food to eat: Apple, Burger, Pizza: ', (foodChoice) => {
            eatFood(foodChoice);
            startGame();
          });
          return;
        case '4':
          sleep();
          startGame();
          return;
        case '5':
          casino();
          startGame();
          break;
        case '6':
          fightEnemy();
          startGame();
          break;
        case '7':
          console.log("Thanks for playing!");
          rl.close();
          break;
        case '8':
          console.log("Lets Explore");
          explore()
          startGame()
          break;
        default:
          console.log("Invalid choice.");
          break;
      }
      startGame();
    });
  }
  

startGame();

