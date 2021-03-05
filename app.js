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
        table.playerArray[0].checkBlackJack();


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
        this.blackjack = false;
        this.surrender = false;

    }

    checkBlackJack() {
        if (this.points === 21 && this.hand.length === 2) {
            this.blackjack = true;
        }
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

    surrenderHand(){
        this.surrender = true;
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
            renderYouLose();
            this.clearLiveBet();
            clearBettingArea();
            table.playerArray[table.numberOfPlayers].renderAllCards();
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
                if (allStand() === true) {
                    endOfGame();
                }
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
                if (allStand() === true) {
                    endOfGame();
                }
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
        this.updatePoints();
        let spot = this.hand.length;
        topCard.renderHouseCard(spot);
        this.updatePoints();
        this.checkBust();
        if (this.bust === true) {
            this.renderBust();
            clearBettingArea();
            table.playerArray[0].liveBet = 0;
            table.playerArray[0].renderLiveBet(table.playerArray[0].liveBet);
            endOfRoundButtons();
        }
        else if (allStand() === true){
            endOfGame();
        }
        else {
            renderYourTurn();
            activateButtons();
        }


    }

    checkBust() {
        if (this.points > 21) {
            this.bust = true;
        }
    }

    stay() {
        this.stand = true;
        renderYourTurn();
        activateButtons();
    }

    subtractBankroll(amount){
        this.bankroll -= amount;
        this.renderBankRoll();
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
        endOfRoundButtons()
        housePoints.innerHTML = "BUST";
        housePoints.style.color = "red";
        result.innerHTML = "House busted, you win!"
        payWinner();
        this.renderAllCards();
    }

    renderBankRoll() {
        houseBankrollNumber.innerHTML = `${this.bankroll}`
    }

    renderAllCards() {
        for (let i = 0; i < this.hand.length; i++) {
            let cardVisual = document.querySelector(`.houseCard${i + 1}`);
            let card = this.hand[i];
            cardVisual.setAttribute("src", `${card.imgSource}`)
        }
        housePoints.innerHTML = `${this.points}`
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

function endOfRoundButtons() {
    let buttons = document.querySelectorAll("button");
    for (let button of buttons) {
        if (button.id === "reset" || button.id === "nextHand" || button.id === "addBankroll") {
            button.removeAttribute("disabled");
        }
        else {
            button.disabled = "true";
        }
    }
}

function renderCoins(amount) {
    let bettingCoins = document.querySelectorAll(".coinStack");
    if (amount <= 1000 && amount > 0) {
        bettingCoins[0].setAttribute("src", "/images/bitcoinStack.png");
    }
    else if (amount > 1000 && amount <= 10000) {
        bettingCoins[0].setAttribute("src", "/images/bitcoinStack.png");
        bettingCoins[1].setAttribute("src", "/images/bitcoinStack.png");
    }
    else if (amount > 10000) {
        bettingCoins[0].setAttribute("src", "/images/bitcoinStack.png");
        bettingCoins[1].setAttribute("src", "/images/bitcoinStack.png");
        bettingCoins[2].setAttribute("src", "/images/bitcoinStack.png");
    }
    else {
        bettingCoins[0].setAttribute("src", "");
        bettingCoins[1].setAttribute("src", "");
        bettingCoins[2].setAttribute("src", "");
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

// Render Text

function renderYourTurn() {
    result.innerHTML = "Your Turn";
}

function renderCPUTurn() {
    result.innerHTML = "CPU Turn";
}

function renderYouWin() {
    if (table.playerArray[0].blackjack === true){
        result.innerHTML = "BlackJack, You win!"
    }
    else{
        result.innerHTML = "You had higher cards, You Win!";
    }
    
}

function renderYouLose() {
    if (table.playerArray[0].bust === true) {
        result.innerHTML = "Busted, you lose!";
    }
    else if (table.playerArray[table.numberOfPlayers].blackjack === true){
        result.innerHTML = "House had Black Jack, you lose!"
    }
    else if (table.playerArray[0].surrender === true){
        result.innerHTML = "You surrender! House collects half of live bet"
    }
    else {
        result.innerHTML = "House had higher cards, you lose!";
    }

}

function renderTie() {
    result.innerHTML = "Push! Bet returned"
}

function renderDoubleDown(){
    result.innerHTML = "Double Down!"
}

function houseTurn() {
    let house = table.playerArray[table.numberOfPlayers]
    if (house.stand === false) {
        house.makeDecision();
    }
    else if (allStand() === true) {
        endOfGame();
    }
    else {
        activateButtons();
        renderYourTurn();
    }
}

function endOfTurn() {
    cpuTurnButtons();
    renderCPUTurn();
    setTimeout(houseTurn, 2000);
}


function allStand() {
    for (let player of table.playerArray) {
        if (player.stand === false) {
            return false;
        }
    }
    return true;
}

function endOfGame() {
    let houseScore = table.playerArray[table.numberOfPlayers].points;
    let playerScore = table.playerArray[0].points;
    if (playerScore > houseScore) {
        playerWins();
    }

    else if (playerScore < houseScore) {
        houseWins();
    }
    else {
        push();
    }
}

function houseWins() {
    renderYouLose();
    houseCollects();
    clearBettingArea();
    table.playerArray[0].liveBet = 0;
    table.playerArray[0].renderLiveBet(table.playerArray[0].liveBet);
    table.playerArray[table.numberOfPlayers].renderAllCards();
    endOfRoundButtons();
}

function playerWins() {
    renderYouWin();
    payWinner();
    clearBettingArea();
    table.playerArray[0].liveBet = 0;
    table.playerArray[0].renderLiveBet(table.playerArray[0].liveBet);
    table.playerArray[table.numberOfPlayers].renderAllCards();
    endOfRoundButtons();
}

function push() {
    renderTie();
    payPush();
    clearBettingArea();
    table.playerArray[0].liveBet = 0;
    table.playerArray[0].renderLiveBet(table.playerArray[0].liveBet);
    table.playerArray[table.numberOfPlayers].renderAllCards();
    endOfRoundButtons();
}

function surrender(){
    table.playerArray[0].surrenderHand();
    renderYouLose();
    surrenderPay();
    table.playerArray[0].liveBet = 0;
    table.playerArray[0].renderLiveBet(table.playerArray[0].liveBet);
    table.playerArray[table.numberOfPlayers].renderAllCards();
    endOfRoundButtons();
}

function payWinner() {
    let betAmount = table.playerArray[0].liveBet;
    if (table.playerArray[0].blackjack === true) {
        let winnings = betAmount + (betAmount * (3 / 2));
        console.log(winnings);
        table.playerArray[0].addBankroll(winnings);
        table.playerArray[table.numberOfPlayers].subtractBankroll(winnings);
    }
    else {
        let winnings = betAmount * 2;
        table.playerArray[0].addBankroll(winnings);
        table.playerArray[table.numberOfPlayers].subtractBankroll(winnings);
    }
}

function houseCollects() {
    let betAmount = table.playerArray[0].liveBet;
    table.playerArray[table.numberOfPlayers].addBankroll(betAmount);

}

function payPush() {
    let betAmount = table.playerArray[0].liveBet;
    table.playerArray[0].addBankroll(betAmount);
}

function surrenderPay(){
    let betAmount = table.playerArray[0].liveBet;
    let returnAmount = betAmount/2;
    table.playerArray[0].addBankroll(returnAmount);
    table.playerArray[table.numberOfPlayers].addBankroll(returnAmount);
}


// Button Functionality

const startGameButton = document.querySelector("#startGame");
startGameButton.addEventListener("click", startGame);

const hitButton = document.querySelector("#hitButton");
hitButton.addEventListener("click", () => {
    table.playerArray[0].hit(deck);
    if (table.playerArray[0].bust === true) {
        bustButtons();
    }
    else {
        endOfTurn();
    }
});

const stayButton = document.querySelector("#stayButton");
stayButton.addEventListener("click", () => {
    table.playerArray[0].stay();
    endOfTurn();
})

const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", reset);


const nextHandButton = document.querySelector("#nextHand");
nextHandButton.addEventListener("click", nextHand);



const doubleDownButton = document.querySelector("#doubleDown");
doubleDownButton.addEventListener("click", () => {
    let currentLiveBet = table.playerArray[0].liveBet;
    table.playerArray[0].addBet(currentLiveBet);
    renderDoubleDown();
    setTimeout(() =>{
        table.playerArray[0].stay();
    table.playerArray[0].hit(deck);
    if (table.playerArray[0].bust === true) {
        bustButtons();
    }
    else {
        endOfTurn();
    }
    }, 1000);
})


const surrenderButton = document.querySelector("#surrender");
surrenderButton.addEventListener("click", surrender);


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