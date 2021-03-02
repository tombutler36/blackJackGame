const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
const faceCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];


//Empty Card Object Constructor

class Card {
    constructor(suit, faceCard, value) {
        this.suit = suit;
        this.faceCard = faceCard;
        this.value = value;
    }

    isAce() {
        if (this.faceCard === "A") {
            return true;
        }
    }

    aceValueChange() {
        if (this.isAce()) {
            this.value = 1;
        }
    }
}



//Deck and methods;
class Deck {
    constructor() {
        this.deckArray = [];
    }

    initializeDeck() {
        for (let suit of suits) {
            for (let faceCard of faceCards) {
                let value = 0;
                if (faceCard === "J" || faceCard === "Q" || faceCard === "K") {
                    value = 10;
                }
                else if (faceCard === "A") {
                    value = 11;
                }
                else {
                    value = parseInt(faceCard);
                }
                let newCard = new Card(suit, faceCard, value);
                this.deckArray.push(newCard);

            }
        }

    }

    // Fisher - Yates shuffle

    shuffle() {
        let currIndex = this.deckArray.length;

        while (0 !== currIndex) {
            let randIndex = Math.floor(Math.random() * currIndex);
            currIndex -= 1;

            let temp = this.deckArray[currIndex];
            this.deckArray[currIndex] = this.deckArray[randIndex];
            this.deckArray[randIndex] = temp;
        }

    }

}

//Players and House at table (house is always at last index of player array)
class Table {
    constructor() {
        this.numberOfPlayers = 1;
        this.playerArray = [];
    }

    initializeTable() {
        for (let i = 0; i < this.numberOfPlayers + 1; i++) {
            if (i != this.numberOfPlayers) {
                let newPlayer = new Player();
                newPlayer.name = `Player${i + 1}`
                this.playerArray.push(newPlayer);
            }
            else {
                let house = new House();
                house.name = "House"
                this.playerArray.push(house);
            }


        }
    }

    dealCards(deck) {
        for (let i = 0; i < 2; i++) {
            for (let i = 0; i < this.numberOfPlayers + 1; i++) {
                let topCard = deck.deckArray.pop();
                if (topCard.faceCard === "A") {
                    this.playerArray[i].aceCount++;
                }
                this.playerArray[i].hand.push(topCard);
                this.playerArray[i].updatePoints();
            }
        }

    }

    resetTable() {
        this.playerArray = [];
    }





}

class Player {
    constructor() {
        this.hand = [];
        this.points = 0;
        this.liveBet = 0;
        this.bankroll = 0;
        this.bust = false;
        this.aceCount = 0;
        this.stand = false;

    }

    updatePoints() {
        let sum = 0;
        for (let card of this.hand) {
            sum += card.value;
        }
        this.points = sum;
    }

    addBankroll(money) {
        this.bankroll += money;
    }

    addBet(bet) {
        this.liveBet += bet;
        this.bankroll -= bet;
    }

    checkBust() {
        if (this.points > 21) {
            this.bust = true;
        }
    }

    containsAce() {
        if (this.aceCount !== 0) {
            return true;
        }
        else {
            return false;
        }
    }

    hit(deck) {
        let topCard = deck.deckArray.pop()
        this.hand.push(topCard);
        this.checkBust();
        this.updatePoints();
    }

    split() {
        this.splitHand = [];
        let splitCard = this.hand.pop();
        this.splitHand.push(splitCard);
        let splitBet = liveBet / 2;
        this.splitBet = splitBet;
        this.liveBet -= splitBet;


    }

    stay() {
        this.stand = true;
    }

    doubleDown() {
        if (this.bankroll >= this.liveBet) {
            this.bankroll -= this.liveBet;
            this.liveBet = this.liveBet * 2;
        }
    }

}


// Similar to player class but with added decision making
class House {
    constructor() {
        this.hand = [];
        this.points = 0;
        this.liveBet = 0;
        this.bankroll = 0;
        this.bust = false;
        this.aceCount = 0;
        this.stand = false;
        this.blackjack = false;
    }

    makeDecision() {
        if (this.points === 21) {
            this.blackjack = true;
            this.stay();
        }

        else if (this.points < 17) {
            this.hit(deck);
        }

        else if (this.points > 21 && this.aceCount === 0) {
            this.bust = true;
        }

        else if (this.points > 21 && this.aceCount !== 0) {
            for (let card of this.hand) {
                if (card.isAce()) {
                    card.aceValueChange();
                    this.hand.updatePoints();
                }
            }
            this.makeDecision();
        }

        else {
            this.stay();
        }
    }

    updatePoints() {
        let sum = 0;
        for (let card of this.hand) {
            sum += card.value;
        }
        this.points = sum;
    }

    hit(deck) {
        let topCard = deck.deckArray.pop()
        this.hand.push(topCard);
        this.checkBust();
        this.updatePoints();
    }

    checkBust() {
        if (this.points > 21) {
            this.bust = true;
        }
    }

    stay() {
        this.stand = true;
    }

}



const deck = new Deck();
const table = new Table();

function startGame() {
    gameOver = false;
    let startingBankroll = parseInt(prompt("How much money are you starting with?"))

    deck.initializeDeck();
    deck.shuffle();
    table.initializeTable();
    table.dealCards(deck);

    let player = table.playerArray[0];

    player.bankroll = startingBankroll;
    console.log(table);
    
    while (gameOver === false) {
        if (player.bust === true) {
            console.log("You Busted");
            player.liveBet = 0;
            gameOver = true;
        }

        let input = prompt("What would you like to do?");

        if (input === "Hit") {
            player.hit(deck);

        }

        else if (input === "Bet") {
            let betAmount = -1;
            while (betAmount <= 0 || betAmount > player.bankroll) {
                betAmount = parseInt(prompt("How much would you like to bet?"));
            }
            player.liveBet += betAmount;
            player.bankroll -= betAmount;
            prompt(`Your bet is now ${player.liveBet}`);
            prompt(`Your bankroll is now ${player.bankroll}`)

        }

        else if (input === "Stay") {
            player.stay()
        }


        else if (input === "See Hand"){

        }

        else if (input === "Quit"){
            console.log("You Are quitting the game, you lose all your money");
            gameOver = true;
        }
        







    }
}

const startGameButton = document.querySelector("#startGame");

startGameButton.addEventListener("click", startGame);







// table.initializeTable();
// console.log(table.players);
// table.dealCards();
// console.log(table.players);