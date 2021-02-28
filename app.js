const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
const faceCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];




//Empty Card Object Constructor
function Card(suit, faceCard, value){
    this.suit = suit;
    this.faceCard = faceCard;
    this.value = value;
}



//Deck and methods;
var deck = {
    deckArray: [],

    initializeDeck: function () {
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
                newCard = new Card(suit, faceCard, value);
                this.deckArray.push(newCard);

            }
        }
    },

    // Fisher - Yates shuffle

    shuffle: function () {
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

//Players and House at table (house is always at index 0)
var table = {
    numberOfPlayers: 2,
    players: [],

    initializeTable: function () {
        for (let i = 0; i < this.numberOfPlayers; i++) {
            newPlayer = new player();
            newPlayer.hand = [];
            newPlayer.points = 0;
            newPlayer.bankroll = 0; 
            this.players.push(newPlayer);
        }
    },

    dealCards: function () {
        for (let i = 0; i < 1; i++) {
            for (let i = 0; i < this.players.length; i++) {
                topCard = deck.deckArray.pop();
                this.players[i].hand.push(topCard);
                this.players[i].updatePoints();
            }
        }

    }

}


//Player Object
var player = {
    hand: [],
    points: 0,
    bankroll: 0

    // updatePoints: function(){
    //     let sum = 0;
    //     for (let card of this.hand){
    //         sum += card.value;
    //     }
    //     points = sum;
    // }

    
}

deck.initializeDeck();
deck.shuffle();
console.log(deck.deckArray);
// table.initializeTable();
// console.log(table.players);
// table.dealCards();
// console.log(table.players);