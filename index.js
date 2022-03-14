///////////////////////////////////////////////////////////
///                                                     ///
///                      CS PREP                        ///
///                      cohort 39                      ///
///                     BLACK JACK                      ///
///                                                     ///
///////////////////////////////////////////////////////////

/*
 

 
  ❤︎ ♦︎ ♣︎ ♠︎ ❤︎ ♦︎ ♣︎ ♠︎ ❤︎ ♦︎ ♣︎ Blackjack ♠︎ ❤︎ ♦︎ ♣︎ ♠︎ ❤︎ ♦︎ ♣︎ ♠︎ ❤︎ 



Objective: 
You have two cards face up in front of your bet. To play your hand, first you add the card values together and get a hand total anywhere from 4 to 21. If you're dealt a ten-value card and an Ace as your first two cards that means you got a Blackjack!


Rules:
Deal two cards to user and house(computer) in the beginning 
Prompt the user with yes or no to add cards
If yes than grab another card from the deck
If no then add the sum of the user cards and continue
Add conditions to check if user is over 21, than the user lose
Deal the hand for the house(computer), after the user declines the accepting cards
Compare the user hand with the dealer hand to see who is closer to 21
If both tie than its a ‘Draw’
If the player won than add money to player account
If the player lost than subtract from his account
Have a prompt to ask the user if they want to play again */


// global variables

// Our base deck to reference new deck objects from
const deckOfCards = {
'2 ❤︎': 4,
'3 ♦︎': 4,
'4 ♣︎': 4,
'5 ♦︎': 4,
'6 ❤︎': 4,
'7 ♣︎': 4,
'8 ♠︎': 4,
'9 ♦︎': 4,
'10 ❤︎': 4,
'jack': 4,
'queen': 4,
'king' : 4,
'ace ' : 4
}
const blackJackWinAmount = 21;
const faceValue = 10;
const aceValue = 11;

// User and computer cards
let userCards =[];
let computerCards = [];

// end of global variables

// create new deck object
function createDeckObject() {
  const deck = new Object();
  deck.deck = deckOfCards;
  deck.clean = function() {
    // iterate through the deck to remove any keys that have a value of 0
    for(let key in this.deck) {
      if(this.deck[key] <= 0) {
        delete this.deck[key];
      }
    }
  };
  deck.getDeckLength = function() {
    return Object.keys(this.deck).length;
  };
  deck.grabKeyFromIndex = function (index) {
    // declare an array of object keys for our deck
    const deckKeys = Object.keys(this.deck);
    // return the key at index
    return deckKeys[index];
  };
  deck.grabCard = function (index) {
    // declare a object that will hold our card data
    const card = new Object();
    // keep track of the current card key
    let currentCardKey = this.grabKeyFromIndex(index);

    // populate the card object with data from deckOfCards object
    card.type = currentCardKey;
    // convert the key string to a number and check if its a number
    if(Number.isInteger(parseInt(currentCardKey))) {
      card.value = parseInt(currentCardKey);
    } else {
      // set ace cards to 11 and the other face cards to 10
      card.value = (currentCardKey === 'ace') ? aceValue : faceValue;
    }
    // decrement the card count by 1
    this.deck[currentCardKey]--;

    // clean the deck after grabbing a card
    this.clean();

    return card;
  };
  return deck;
}

// create a new user object
function createUserObject(name) {
  const user = new Object();
  user.name = name;
  user.hand = [];
  user.cash = 500;
  user.bet = 0;

  user.populateHands = function(array) {
    this.hand = array;
  }

  user.pushCardToHands = function(card) {
    this.hand.push(card);
  }

  user.printHandKeys = function() {
    const userCards = [];
    for(let card of this.hand) {
      userCards.push(card.type);
    }

    console.log(userCards);
  }

  user.addWinnings = function(winningAmount) {
    this.cash+=winningAmount;
  }

  user.deductLoss = function(deductAmount) {
    this.cash-=deductAmount;
  } 
  
  user.getCash = function () {
    return this.cash;
  }
  
  user.updateBet = function (userBet) {
    this.bet = userBet;
  }
  user.resetHand = function (){
    this.hand = [];
  }
  return user;
}

// compares all the hands to see who is closer to 21
function compareHands(callback, user, computer) {
  let userSum = callback(user.hand);
  let compSum = callback(computer.hand);

  if(userSum > blackJackWinAmount) {
    user.deductLoss(user.bet);
    return `${user.name} has bust, ${computer.name} wins 🏆. Cash 💰: $${user.cash}`;
  }
  if(compSum > blackJackWinAmount) {
    user.addWinnings(user.bet);
    return `${computer.name} has bust, ${user.name} wins 🏆. Cash 💰: $${user.cash}`;
  }

  if(userSum === compSum) return 'It\'s a tie';
  if(userSum === blackJackWinAmount) {
    //added user getting winnings -Richard
    user.addWinnings(user.bet*1.5);
    return `${user.name} wins 🏆, Black Jack!  Cash 💰: $${user.cash}`;
  }
  if(compSum === blackJackWinAmount) {
    //added user getting winnings -Richard
    user.deductLoss(user.bet);
    return `${computer.name} wins 🏆, Black Jack!  Cash 💰: $${user.cash}`;
  }
  //I added the user getting their bet money*1.5 here since if user
  //had 18 and house had 17, it would not trigger any of the conditions
  //above -Richard // i just remembered this and came back to do it, thanks for adding - Rea
    user.addWinnings(user.bet);
  return (userSum > compSum) ? `${user.name} wins 🏆.  Cash 💰: $${user.cash}` : `${computer.name} wins 🏆.   Cash 💰: $${user.cash}`;
}

//fill the house's hands after user is done
function fillHouseHands (houseHand, deck){
  //base case
  //console.log(houseHand)
  if(calcHandSum(houseHand) > 17){
    return;
  }
  //adds card to computer's hand 
  computerCards.push(deck.grabCard(randomIndex(deck)));
  //call itself again
  return fillHouseHands (computerCards, deck);
}

// calculate the sum of the hand values
function calcHandSum(hand) {
  let sum = 0;
  // store 'ace' value cards to be added at the end
  const aceCards = [];
  // iterate through the hand to find sum of all card values
  hand.forEach((card) => { 
    if(card.type !== 'ace') {
      sum += card.value; 
    } else {
      aceCards.push(card);
    }
  });
  // iterate through our ace cards to determine whether we should add 11 or 1 to the sum
  aceCards.forEach((card) => {
    let addAmount = (sum <= Math.floor(blackJackWinAmount/2)) ? 11 : 1;
    card.value = addAmount;
    sum += addAmount;
  });
  
  return sum;
}

// index generator
function randomIndex(param) {
  return Math.floor(Math.random() * param.getDeckLength()); 
}

// setup the deal hands for user and computer
function createDealHands(param, playerObj, houseObj) {
  /* *******************************************
  Notes: Might be beneficial to re-factor this function to accept an array and the index.
         You can also create another function that accepts an array and index than call it from this function
         We need a condition check if the card type is null than grab a new card from the deck with a new randomIndex
  ******************************************* */
  userCards.push(param.grabCard(randomIndex(param)));
  userCards.push(param.grabCard(randomIndex(param)));
  playerObj.populateHands(userCards);
  computerCards.push(param.grabCard(randomIndex(param)));
  computerCards.push(param.grabCard(randomIndex(param)));
  houseObj.populateHands(computerCards);
  console.log("Your Cards:")
  playerObj.printHandKeys();
  console.log("House got 2 cards")
  //console.log(computerCards);
}

//Hit or Stand, if user chose Hit, another card will be given
function hitOrStand(param, playerObj, houseObj) {
  let option = prompt("Hit or Stand?").toLowerCase();

  while (option === "hit") {
    userCards.push(param.grabCard(randomIndex(param)));
    playerObj.populateHands(userCards);
    console.log("Your Cards:")
    playerObj.printHandKeys();
    if(calcHandSum(playerObj.hand) < 21) {
      option = prompt("Hit or Stand?");
    } else {
      fillHouseHands(computerCards, param);
      houseObj.populateHands(computerCards);
      return compareHands(calcHandSum, playerObj, houseObj);
    }
  }
  fillHouseHands(computerCards, param);
  houseObj.populateHands(computerCards);
  console.log("Your Cards: " + calcHandSum(playerObj.hand))
  playerObj.printHandKeys();
  console.log(`${houseObj.name} Cards: ${calcHandSum(houseObj.hand)}`)
  houseObj.printHandKeys();
  return compareHands(calcHandSum, playerObj, houseObj);
}


// main function
/* 
 This function is our main function, where we initalize all of our other functions. You can think of it as our global execution context.
*/
function main() {
  let name = prompt("What is the player's name?");
  alert(`Hi ${name}! Let's Play Black Jack!  ♠︎  ❤︎  ♦︎  ♣︎`);
  alert("The goal of blackjack is to beat the dealer's hand \n without going over 21.\n Face Cards are worth 10. \n  Aces are worth 11 or 1.\n To 'Hit' is to ask for another card.\n To 'Stand' is to hold your total and end your turn.\n If you go over 21 you bust, the house wins.\n If you have 21 from the start (Ace & 10), you got a BLACKJACK.\n Blackjack means you win 1.5 the amount of your bet.\n \n \n Let’s begin... \n\n")

  console.log('You have $500 initially on your account.')
  // let bet = prompt("You have $500 initially on your account,\n how much you want to bet?");

  // create player and computer user objects
  const playerObj = createUserObject(name);
  // playerObj.updateBet(Number(bet));
  const houseObj = createUserObject('House');

  // create a new deck and deal the hands to the user and computer
  let anotherRound = true;
  let isValidAnswer = true;
  let goAgain;
  
  while(anotherRound){
    if(isValidAnswer) {
      //reset user hands
      userCards = [];
      playerObj.resetHand();
      //reset house hands
      computerCards = [];
      houseObj.resetHand();

      bet = prompt("how much you want to bet?");
      playerObj.updateBet(Number(bet));
      const deck = createDeckObject();
      createDealHands(deck, playerObj, houseObj);

      // Check if the starting hands equal to black Jack
      if(calcHandSum(userCards) !== blackJackWinAmount && calcHandSum(computerCards) !== blackJackWinAmount) {
        console.log(hitOrStand(deck, playerObj, houseObj));
      } else {
        console.log(compareHands(calcHandSum, playerObj, houseObj));
      } 
    }

    goAgain = prompt('Do you want to play again?');

    if(goAgain.toLowerCase() === 'yes'){
      anotherRound = true;
      isValidAnswer = true;
    } else if(goAgain.toLowerCase() === 'no'){
      // end game
      anotherRound = false;
      console.log('Thanks for playing!');
    } else {
      goAgain = prompt('Please enter yes or no?');
      anotherRound = true;
      isValidAnswer = false;
    }
  }
}

// invoke our main function
main();



