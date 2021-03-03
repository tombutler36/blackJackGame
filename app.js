const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
const faceCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const userCardArea = document.querySelector("#userCardArea");
const startingBankRoll = 1000;
const startingHouseMoney = 10000;

//Empty Card Object Constructor

class Card {
    constructor(suit, faceCard, value, imgSource) {
        this.suit = suit;
        this.faceCard = faceCard;
        this.value = value;
        this.imgSource = imgSource;
        this.cardBack = "/playingcardsPNG/back.png"
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

    renderCard(position) {
        let location = document.querySelector(`.card${position}`);
        location.setAttribute("src", `${this.imgSource}`);
    }

    renderHouseCard(position) {
        let location = document.querySelector(`.houseCard${position}`);
        if (position === 1) {
            location.setAttribute("src", `${this.cardBack}`);
        }
        else {
            location.setAttribute("src", `${this.imgSource}`);
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
                let imgSource = `/playingcardsPNG/${faceCard}${suit}.png`
                let newCard = new Card(suit, faceCard, value, imgSource);
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
                newPlayer.renderBankRoll();
                this.playerArray.push(newPlayer);
            }
            else {
                let house = new House();
                house.name = "House"
                house.renderBankRoll();
                this.playerArray.push(house);
            }


        }
    }

    dealCards(deck) {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.numberOfPlayers + 1; j++) {
                let topCard = deck.deckArray.pop();
                if (topCard.faceCard === "A") {
                    this.playerArray[j].aceCount++;
                }
                this.playerArray[j].hand.push(topCard);
                this.playerArray[j].updatePoints();
                if (j === 0) {
                    topCard.renderCard(i + 1);
                    this.playerArray[j].renderPoints()
                }
                if (j === this.numberOfPlayers) {
                    topCard.renderHouseCard(i + 1);
                }
            }
        }

    }

    resetTable() {
        for (let i = 0; i < this.numberOfPlayers + 1; i++) {
            if (i === this.numberOfPlayers) {
                this.playerArray[this.numberOfPlayers].resetHouse()
            }
            else {
                this.playerArray[i].resetPlayer();
            }

        }

    }





}

class Player {
    constructor() {
        this.hand = [];
        this.points = 0;
        this.liveBet = 0;
        this.bankroll = startingBankRoll;
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
        this.renderBankRoll();
    }

    addBet(bet) {
        this.liveBet += bet;
        this.bankroll -= bet;
        this.renderLiveBet();
        this.renderBankRoll();
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
        this.updatePoints();
        this.checkBust();
        let spot = this.hand.length;
        topCard.renderCard(spot);
        this.renderPoints();
        if (this.bust === true) {
            bustButtons();
        }
        else {
            endOfTurn();
        }


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
        endOfTurn();
    }

    doubleDown() {
        if (this.bankroll >= this.liveBet) {
            this.bankroll -= this.liveBet;
            this.liveBet = this.liveBet * 2;
        }
    }

    clearLiveBet() {
        table.playerArray[table.numberOfPlayers].addBankroll(this.liveBet);
        this.liveBet = 0;
        this.renderLiveBet();
    }

    renderPoints() {
        let scoreArea = document.querySelector("#score");
        if (this.points > 21) {
            scoreArea.innerHTML = "BUST";
            scoreArea.style.color = "red";
            this.clearLiveBet();
            clearBettingArea();
        }
        else {
            scoreArea.innerHTML = `${this.points}`
        }


    }


    renderLiveBet() {
        let liveBetNumber = document.querySelector("#liveBetNumber");
        let liveBet = document.querySelector("#liveBet");
        liveBetNumber.innerHTML = this.liveBet;
        liveBet.innerHTML = this.liveBet;
        renderCoins(this.liveBet);
    }

    renderBankRoll() {
        let bankrollNumber = document.querySelector("#bankrollNumber");
        bankrollNumber.innerHTML = `${parseInt(this.bankroll)}`;
    }

    resetPlayer() {
        this.hand = [];
        this.points = 0;
        this.liveBet = 0;
        this.bust = false;
        this.aceCount = 0;
        this.stand = false;
    }

}


// Similar to player class but with added decision making
class House {
    constructor() {
        this.hand = [];
        this.points = 0;
        this.liveBet = 0;
        this.bankroll = startingHouseMoney;
        this.bust = false;
        this.aceCount = 0;
        this.stand = false;
        this.blackjack = false;
    }

    makeDecision() {
        if (this.stand === false) {
            if (this.points === 21) {
                this.blackjack = true;
                this.stay();
            }

            else if (this.points < 17) {
                this.hit(deck);
            }

            // else if (this.points > 21 && this.aceCount === 0) {
            //     this.bust = true;
            //     this.renderPoints();
            // }

            // else if (this.points > 21 && this.aceCount !== 0) {
            //     for (let card of this.hand) {
            //         if (card.isAce()) {
            //             card.aceValueChange();
            //             this.hand.updatePoints();
            //         }
            //     }
            //     this.makeDecision();
            // }

            else {
                this.stay();
            }
        }

    }

    updatePoints() {
        let sum = 0;
        for (let card of this.hand) {
            sum += card.value;
        }
        this.points = sum;
    }

    addBankroll(amount) {
        this.bankroll += amount;
        this.renderBankRoll();
    }

    hit(deck) {
        let topCard = deck.deckArray.pop()
        this.hand.push(topCard);
        let spot = this.hand.length;
        topCard.renderHouseCard(spot);
        this.checkBust();
        this.updatePoints();
        if (this.bust === true) {
            this.renderBust();
        }


    }

    checkBust() {
        if (this.points > 21) {
            this.bust = true;
        }
    }

    stay() {
        this.stand = true;
    }

    resetHouse() {
        this.hand = [];
        this.points = 0;
        this.liveBet = 0;
        this.bust = false;
        this.aceCount = 0;
        this.stand = false;
        this.blackjack = false;
    }

    renderBust() {
        bustButtons()
        housePoints.innerHTML = "BUST";
        housePoints.style.color = "red";
        this.renderAllCards();
    }

    renderBankRoll() {
        houseBankrollNumber.innerHTML = `${this.bankroll}`
    }

    renderAllCards() {
        for (let i = 0; i < this.hand.length; i++) {
            let cardVisual = document.querySelector(`houseCard${i + 1}`);
            let card = hand[i];
            cardVisual.setAttribute("src", `${card.imgSource}`)
        }
    }


}


const scoreArea = document.querySelector("#score");
const liveBet = document.querySelector("#liveBet");
const liveBetNumber = document.querySelector("#liveBetNumber");
const bankrollNumber = document.querySelector("#bankrollNumber");
const housePoints = document.querySelector("#housePointsValue");
const houseBankrollNumber = document.querySelector("#houseBankrollNumber");
const result = document.querySelector("#result");

var deck = new Deck();
var table = new Table();



function startGame() {
    deck.initializeDeck();
    deck.shuffle();
    table.initializeTable();
    table.dealCards(deck);
    activateButtons();
    renderYourTurn();
}

function reset() {
    clearCards();
    scoreArea.style.color = "white";
    scoreArea.innerHTML = "";
    liveBet.innerHTML = "";
    liveBetNumber.innerHTML = "0";
    bankrollNumber.innerHTML = "0"
    housePoints.innerHTML = "";
    housePoints.style.color = "white";
    houseBankrollNumber.innerHTML = "";
    result.innerHTML = "";
    clearBettingArea();
    resetButtons();
    deck = new Deck();
    table = new Table();
}

function nextHand() {
    clearCards();
    scoreArea.style.color = "white";
    scoreArea.innerHTML = "";
    liveBet.innerHTML = "";
    liveBetNumber.innerHTML = "0";
    housePoints.innerHTML = "";
    housePoints.style.color = "white";
    clearBettingArea();
    resetButtons();
    table.resetTable();
    deck = new Deck();
    deck.initializeDeck();
    deck.shuffle();
    table.dealCards(deck);
    activateButtons();
    renderYourTurn();

}


function activateButtons() {
    let buttons = document.querySelectorAll("button");
    for (let button of buttons) {
        if (button.id === "startGame" || button.id === "nextHand") {
            button.disabled = "true";
        }
        else {
            button.removeAttribute("disabled");
        }
    }

}

function resetButtons() {
    let buttons = document.querySelectorAll("button");
    for (let button of buttons) {
        if (button.id === "startGame") {
            button.removeAttribute("disabled");
        }
        else {
            button.disabled = "true";
        }
    }
}

function bustButtons() {
    let buttons = document.querySelectorAll("button");
    for (let button of buttons) {
        if (button.id === "reset" || button.id === "nextHand") {
            button.removeAttribute("disabled");
        }
        else {
            button.disabled = "true";
        }
    }
}

function cpuTurnButtons() {
    let buttons = document.querySelectorAll("button");
    for (let button of buttons) {
        if (button.id === "reset") {
            button.removeAttribute("disabled");
        }
        else {
            button.disabled = "true";
        }
    }
}

function renderCoins(amount) {
    let bettingCoins = document.querySelectorAll(".coinStack");
    if (amount <= 1000) {
        bettingCoins[0].setAttribute("src", "/images/bitcoinStack.png");
    }
    else if (amount > 1000 && amount <= 10000) {
        bettingCoins[0].setAttribute("src", "/images/bitcoinStack.png");
        bettingCoins[1].setAttribute("src", "/images/bitcoinStack.png");
    }
    else {
        bettingCoins[0].setAttribute("src", "/images/bitcoinStack.png");
        bettingCoins[1].setAttribute("src", "/images/bitcoinStack.png");
        bettingCoins[2].setAttribute("src", "/images/bitcoinStack.png");
    }
}

function clearBettingArea() {
    let bettingCoins = document.querySelectorAll(".coinStack");
    bettingCoins[0].setAttribute("src", "");
    bettingCoins[1].setAttribute("src", "");
    bettingCoins[2].setAttribute("src", "");
}

function clearCards() {
    let cards = document.querySelectorAll(".card");
    let houseCards = document.querySelectorAll(".houseCard");
    for (let card of cards) {
        card.setAttribute("src", "");
    }
    for (let card of houseCards) {
        card.setAttribute("src", "");
    }
}

function renderYourTurn(){
    result.innerHTML = "Your Turn";
}

function renderCPUTurn(){
    result.innerHTML = "CPU Turn";
}

function renderYouWin(){
    result.innerHTML = "You Win";
}

function renderYouLose(){
    if (table.playerArray[0].bust === true){
        result.innerHTML = "Busted, you lose";
    }
    else{
        result.innerHTML = "House had higher cards, You lose";
    }
    
}

function renderTie(){
    result.innerHTML = "Push! Bet returned"
}

function houseTurn() {
    let house = table.playerArray[table.numberOfPlayers]
    if (house.stand === false) {
        house.makeDecision();
    }
    activateButtons();
    if (allStand() === true){
        endOfGame();
    }
    else{
        renderYourTurn();
    }
}

function endOfTurn() {
    cpuTurnButtons();
    renderCPUTurn();
    setTimeout(houseTurn, 1000);
}


function allStand(){
    for (let player of table.playerArray){
        if (player.stand === false){
            return false;
        }
    }
    return true;
}

function endOfGame(){
    let houseScore = table.playerArray[table.numberOfPlayers].points;
    let playerScore = table.playerArray[0].points;
    if (playerScore > houseScore){
        playerWins();
    }

    else if (playerScore < houseScore){
        houseWins();
    }
    else{
        push();
    }
}

function houseWins(){
    renderYouLose()
}

function playerWins(){
    renderYouWin()
}

function push(){

}

const startGameButton = document.querySelector("#startGame");
startGameButton.addEventListener("click", startGame);

const hitButton = document.querySelector("#hitButton");
hitButton.addEventListener("click", () => {
    table.playerArray[0].hit(deck);
});

const stayButton = document.querySelector("#stayButton");
stayButton.addEventListener("click", () => {
    table.playerArray[0].stay();
})

const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", reset);


const nextHandButton = document.querySelector("#nextHand");
nextHandButton.addEventListener("click", nextHand);


const addBetForm = document.querySelector("#addBetForm");
addBetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let submit = document.querySelector("#addBet");
    let value = parseInt(submit.value);
    table.playerArray[0].addBet(value);
    submit.value = "";

})

const addBankrollForm = document.querySelector("#addBankrollForm");
addBankrollForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let submit = document.querySelector("#addBankroll");
    let value = parseInt(submit.value);
    console.log(value);
    table.playerArray[0].addBankroll(value);
    submit.value = "";
})