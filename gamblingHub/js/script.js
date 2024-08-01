let debtOwed = readFromLocalStorage("debtOwed");
if (!debtOwed){
    writeToLocalStorage("debtOwed",0);
    debtOwed = 0;
}
let amountOfCoins = readFromLocalStorage("coins");
if (!amountOfCoins){
    amountOfCoins = 1;
}

const urlParams = new URLSearchParams(window.location.search);
let dabloons = urlParams.get('dabloons');

if (isNaN(dabloons) || dabloons == null){
    dabloons = 0;
}

amountOfCoins = Number(amountOfCoins) + dabloons;
dabloons = 0;
updateAmountOfDabloons();

function changePage(page){
    window.location.replace(page+`?dabloons=${dabloons}`);
}

function addClass(id, className){ 
    const object = document.getElementById(id);
    object.classList.add(className);
}

function removeClass(id, className){
    const object = document.getElementById(id);
    object.classList.remove(className);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

function openMines(){
    removeClass("mineSettings", "hideSettings");
    addClass("mineSettings", "openSettings");
    document.getElementById("homeBtn").style.display = "none";
    document.getElementById("chooseMines").style.display = "none";
}

function hideSettings(){
    removeClass("mineSettings", "openSettings");
    addClass("mineSettings", "hideSettings");
    document.getElementById("homeBtn").style.display = "block";
    document.getElementById("chooseMines").style.display = "block";
}

let alreadyTalking = false;
const pirateKingDialogue = ["Get to gambling my bones are getting light on milk", "Those dabloons look mighty lucky to me", "Where's the rest of your wallet at? I've never seen more flies."];
document.addEventListener("DOMContentLoaded", function () {
    const betInput = document.getElementById("betAmount");
    const minesInput = document.getElementById("amountOfMines");
    const minesLabel = document.getElementById("minesNumber");
    const betLabel = document.getElementById("betNumber");
    const pirateKing = document.getElementById("pirateKing");
    const loanSharkDoor = document.getElementById("loanSharkDoor");
    
    // Debounce the input event listeners
    betInput.addEventListener("input", function(){
        updateLabels(false);
    });
    minesInput.addEventListener("input", function(){
        updateLabels(false);
    });
    betLabel.addEventListener("input", function(){
        updateLabels(true);
    });
    minesLabel.addEventListener("input", function(){
        updateLabels(true);
    });
    // Validate bet input on blur
    betInput.addEventListener("input", validateBetInput);
    minesInput.addEventListener("input", validateMineInput);
    pirateKing.addEventListener("click",function(){
        pirateKingClicked();
    });
});


function pirateKingClicked(){
    let text = getRandomNumber(0,pirateKingDialogue.length-1);
    pirateKingSpeak(pirateKingDialogue[text], 4);
    
}
// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

function updateLabels(didUpdateLabel) {
    const betInput = document.getElementById("betAmount");
    const betLabel = document.getElementById("betNumber");
    const minesInput = document.getElementById("amountOfMines");
    const minesLabel = document.getElementById("minesNumber");

    if (didUpdateLabel){
        betInput.value = betLabel.value;
        minesInput.value = minesLabel.value;
    }else{
        betLabel.value = betInput.value;
        minesLabel.value = minesInput.value;
    }
}


function validateBetInput() {
    const betInput = document.getElementById("betAmount");
    const betValue = parseFloat(betInput.value);

    if (isNaN(betValue) || betValue <= 0.1) {
        // Reset to the minimum allowed value
        betInput.value = 0.1;
    }else if (betValue > amountOfCoins){
        betInput.value = amountOfCoins;
    }
    // Update labels after validation
    updateLabels(false);
}

function validateMineInput() {
    const mineInput = document.getElementById("betAmount");
    const mineValue = parseFloat(mineInput.value);

    if (isNaN(mineValue) || mineValue <= 0) {
        // Reset to the minimum allowed value
        mineInput.value = 1;
    }else if (mineInput > 24){
        betInput.value = 24;
    }
    // Update labels after validation
    updateLabels(false);
}
validateMineInput();

console.log(getRandomNumber(0, 2));

function initBoard(width, height, numberOfMines) {
    const board = [];
    const mineBoard = document.getElementById("tileGrid");

    // Initialize the board with empty tiles
    for (let w = 0; w < width; w++) {
        const row = [];
        for (let h = 0; h < height; h++) {
            row.push({
                isMine: false,
                element: null 
            });
        }
        board.push(row);
    }
    let placedMines = 0;

    while (placedMines < numberOfMines) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        if (!board[x][y].isMine) {
            board[x][y].isMine = true;
            placedMines++;
        }
    }

    for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
            const tileDiv = document.createElement("div");
            tileDiv.classList.add("tile");
            tileDiv.setAttribute("id", "tile" + (w * width + h + 1)); 
            if (board[w][h].isMine) {
                tileDiv.classList.add("mine");
            }
            mineBoard.appendChild(tileDiv);
            board[w][h].element = tileDiv;
        }
    }

    return board;
}

let minesOver = true;

function initTiles() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.removeEventListener('click', function(){
            flipTile(tile);
        }); // Remove existing event listener
        tile.addEventListener('click', function(){
            flipTile(tile);
        }); // Add new event listener
    });
}

let bonus = 1;
let tilesFlipped = 0;
function flipTile(tile) {
    const minesInput = document.getElementById("amountOfMines");
    const betInput = document.getElementById("betAmount");
    if (!minesOver && !tile.classList.contains("flipped")) { // Check if the game is still ongoing and the tile hasn't been flipped
        tile.classList.add("flipped"); // Add a class to mark the tile as flipped
        if (tile.classList.contains("mine")) {
            tile.style.backgroundImage = "url('images/bombTile.png')";
            bonus = 1;
            tilesFlipped = 0;
            amountOfCoins -= Number(betInput.value);
            amountOfCoins = Math.round((amountOfCoins + Number.EPSILON) * 100) / 100;
            updateAmountOfDabloons();
            writeToLocalStorage("coins", amountOfCoins);
            minesOver = true;
        } else {
            tile.style.backgroundImage = "url('images/bonusTile.png')";
            tilesFlipped += 1;
            bonus = 1.25*((0.65+(0.20*amountOfMines)*(tilesFlipped/2)));
            console.log("tilesFlipped: " + tilesFlipped);
            if (tilesFlipped >= 25 - amountOfMines) {
                cashOut();
            }
            console.log("New Bonus: " + bonus);
        }
    }
}

function payDebt(){
    if (amountOfCoins > debtOwed){
        amountOfCoins = Number(amountOfCoins) - Number(debtOwed);
        debtOwed = 0;   
        writeToLocalStorage("debtOwed",debtOwed);
        writeToLocalStorage("coins",amountOfCoins);
        updateAmountOfDabloons();
        pirateKingSpeak("Why thank you for the dabloons kind gent", 3);
    }else {
        pirateKingSpeak("Pay me in whole or pay me every win, but never at several times",4);
    }
}

let betValue = 0;
function cashOut(){
    if (!minesOver && tilesFlipped > 0){
        let coinsGained =   betValue*bonus;
        bonus = 1;
        tilesFlipped = 0;
        minesOver = true;
        if (Number(debtOwed) > 0){
            console.log("payed some of your debt finally");
            debtOwed -= Math.round(coinsGained/2);
            if (debtOwed < 0){
                debtOwed = 0;
                writeToLocalStorage("debtOwed", debtOwed);
            }
            coinsGained = coinsGained/2;
            amountOfCoins = Number(amountOfCoins) + Number(coinsGained);
            amountOfCoins = Math.round(amountOfCoins * 100) / 100
        } else {
            amountOfCoins = Number(amountOfCoins) + Number(coinsGained);
            amountOfCoins = Math.round(amountOfCoins * 100) / 100
        }
        console.log(coinsGained);
        console.log(amountOfCoins);
        writeToLocalStorage("coins",amountOfCoins);
        updateAmountOfDabloons();
    }else if (tilesFlipped < 0){
        console.log("at least flip one card bro");
    }else {
        console.log("You aren't even playing dude");
    }
}

function giveMoney(){
    amountOfCoins = Number(amountOfCoins)+5;
    updateAmountOfDabloons();
}

function deletePreviousBoard() {
    const mineBoard = document.getElementById("tileGrid");
    while (mineBoard.firstChild) {
        mineBoard.removeChild(mineBoard.firstChild);
    }
}

let amountOfMines = 1;
function startMines(){
    const minesInput = document.getElementById("amountOfMines");
    const betInput = document.getElementById("betAmount");
    if (Number(betInput.value) <= Number(amountOfCoins) && minesOver){
        deletePreviousBoard();
        amountOfMines = Number(minesInput.value);
        betValue = Number(betInput.value);
        initBoard(5, 5, minesInput.value);
        minesOver = false;
        initTiles();
    }else if (!minesOver){
        console.log("We're in the middle of a game right now");
    }else{
        console.log("Hey idiot, we aren't running a charity here");
        askForLoan();
    }

    
}
updateLabels(false);

function writeToLocalStorage(itemName, text) {
    localStorage.setItem(itemName, text);
}

function readFromLocalStorage(itemName) {
    return localStorage.getItem(itemName);
}

let isFirstVisit = readFromLocalStorage("isFirstVisit");
if (isFirstVisit){
    console.log(isFirstVisit)
    firstVisit();
}else {
    writeToLocalStorage("isFirstVisit",true);
}


function firstVisit(){
    if (isFirstVisit == "true"){
        console.log("Welcome to the gambling ring");
        pirateKingSpeak("Welcome to the gambling ring kid, how about you try some mines", 5);
        writeToLocalStorage("isFirstVisit",false);
        writeToLocalStorage("coins",1);
    }else{
        pirateKingSpeak("Welcome to the gambling ring kid, how about you try some mines", 5);
        writeToLocalStorage("isFirstVisit",false);
    }
}

function changeToFirstVisit(){
    writeToLocalStorage("isFirstVisit",true);
}

function resetDebt(){
    writeToLocalStorage("debtOwed", 0);
}

updateAmountOfDabloons();

async function pirateKingSpeak(dialogue, waitTime) {
    let chatBox = document.getElementById("chatBox");
    let dialogueBox = document.getElementById("pirateKingDialogue");
    
    if (!alreadyTalking){
        alreadyTalking = true;
        chatBox.style.display = "block";
        chatBox.style.transform = "translateY(-5%)";
        dialogueBox.innerHTML = dialogue;
        await sleep(waitTime*1000);
        chatBox.style.transform = "translateY(100%)";
        await sleep(750);
        chatBox.style.display = "none";
        alreadyTalking = false;
    }
}

async function giveLoan(amountLoaned){
    amountOfCoins = Number(amountOfCoins) + amountLoaned;
    debtOwed = Number(debtOwed) + amountLoaned*2.50;
    writeToLocalStorage("debtOwed",debtOwed);
    writeToLocalStorage("coins", amountOfCoins);
}

let offeredLoan = false;

function acceptLoan(){
    const acceptLoanButton = document.getElementById("acceptLoanBtn");
    const declineLoanButton = document.getElementById("declineLoanBtn");
    if (offeredLoan){
        giveLoan(getRandomNumber(0.1,10))
        acceptLoanButton.style.display = "none";
        declineLoanButton.style.display = "none";
        updateAmountOfDabloons();
        offeredLoan = false;
    }
}

function declineLoan(){
    const acceptLoanButton = document.getElementById("acceptLoanBtn");
    const declineLoanButton = document.getElementById("declineLoanBtn");
    if (offeredLoan){
        pirateKingSpeak("Ok fine, you can just go play some games or something", 5);
        acceptLoanButton.style.display = "none";
        declineLoanButton.style.display = "none";
        offeredLoan = false;
    }
}

async function askForLoan(){
    const acceptLoanButton = document.getElementById("acceptLoanBtn");
    const declineLoanButton = document.getElementById("declineLoanBtn");
    pirateKingSpeak("Let me give you a loan sir, you can keep gambling", 4);
    await sleep(5000);
    pirateKingSpeak("You will just owe me 250% more then I give you", 4);
    await sleep(5000);
    acceptLoanButton.style.display = "block";
    declineLoanButton.style.display = "block";
    offeredLoan = true;
}


function updateAmountOfDabloons(){
    const dabloonsLabel = document.getElementById("amountOfDabloons");
    const debtLabel = document.getElementById("debtLabel");
    debtLabel.innerText = "Debt: " + debtOwed;
    dabloonsLabel.innerText = "Dabloons: " + amountOfCoins;
}
updateAmountOfDabloons();
