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
            let newPlayer = new Player();

            if (i != this.numberOfPlayers) {
                newPlayer.name = `Player${i + 1}`
            }
            else {
                newPlayer.name = "House"
            }

            this.playerArray.push(newPlayer);
        }
    }

    dealCards() {
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
            if (this.containsAce()) {

            }
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

    hit() {
        this.hand.push(deck.pop());
        this.checkBust();
        this.updatePoints();
    }

    split() {
        this.splitHand = [];
        let splitCard = this.hand.pop();
        this.splitHand.push(splitCard);

    }

    stay() {
        this.stand = true;
    }

    doubleDown() {
        if (this.bankroll >= this.liveBet) {
            this.bankroll -= this.liveBet;
            this.liveBet = this.livebet * 2;
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
            this.hit();
        }

        else if (this.points >= 17 && this.aceCount === 1) {
            for (let card of hand) {
                if (card.isAce()) {
                    card.aceValueChange();
                    this.hand.updatePoints();
                }
            }
            this.makeDecision();
            
        }

        else if (this.points >= 17 && this.aceCount === 2){
            
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

    hit() {
        this.hand.push(deck.pop());
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
deck.initializeDeck();
deck.shuffle();
table.initializeTable();
table.dealCards();

console.log(table);


// table.initializeTable();
// console.log(table.players);
// table.dealCards();
// console.log(table.players);