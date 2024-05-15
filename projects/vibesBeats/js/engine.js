

let firstIteration = true;
let arrowSpeed = 10;
function getRandomInt(max){ 
    return Math.floor(Math.random() * max);
}

const fallingArrows = [];

function moveDownArrow() {
    // declare variables
    for (let x = 0; x < fallingArrows.length; x++) {
        const arrowId = fallingArrows[x];
        const arrow = document.getElementById("falling" + arrowId);
        const gameArea = document.getElementById("gameArea");

        // check if the arrow is still in the DOM
        if (arrow) {
            let topS = arrow.style.top.substring(0, arrow.style.top.length - 2);

            // check if it has moved 400px down
            if (topS >= 750) {
                gameArea.removeChild(arrow);
                missAmount += 1;
                if (combo > maxCombo){
                    maxCombo = combo;
                }
                combo = 0;
                fallingArrows.splice(x, 1);
                x--;
            } else {
                newTop = Number(topS) + arrowSpeed;
                arrow.style.top = newTop + "px";
            }
        }
    }
}

//allows program to sleep based on milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//gameloop variables
const running = true;

const isPressed = [false, false, false, false];
const arrowKeyCodes = ["ArrowLeft", "ArrowDown", "ArrowUp", "ArrowRight"];

let frameCount = 0;
let beatCount = 0;
let beatRotations = 0;

const waitArray = [4,4,8,8];

const arrows = {};
const directions = ["left", "down", "up", "right"];
let arrowOffsets = [(window.innerWidth/100)*33, (window.innerWidth/100)*41, (window.innerWidth/100)*49, (window.innerWidth/100)*57];
const sounds = [];
let arrowCount = 0;
let wait = 50;
let maxSpeed = false;

let missAmount = 0;

let stopGame = false;
let popupText = "Starting...";
let popupColor = "#ff5dcc";

let combo = 0;
let maxCombo = 0;

let grade="f";

let charArray = ["laserPigeon","lilP","stingy","smokey"];

//character Dialogue
let chars = {
    "laserPigeon" : {"name":"Lazar Pigeon", "id":0, 
        "dialogue":["Ima beam you with laser my face taser ",
                    "Why coo when you can pew-pew?",
                    "You say 'bird brain,' I say 'laser brain.",
                    "Flap your wings? Please, I prefer flashing lasers.",
                    "Cooing is outdated; lasers are the new melody."
    ]
    },
    "lilP" : {"name":"Lil' P", "id":1, 
        "dialogue":["My schemes are spud-tacular, the ultimate starch attack.",
                    "I'm not your side dish; I'm the main course of mischief.",
                    "My shemes are starchy madness the absolute baddest.",
                    "Call you a french fry 'cause I'm about to slice through that rhythm"
    ],
    },
    "stingy" : {"name":"Stingy the Elf","id":2, 
        "dialogue":["You think you're bad? I'm the living naughty list.",
                    "Santa stocked me with enough coal to power a factory, and I'm making it burn.",
                    "Krampus checks his list twice, but he still fears what I might do.",
                    "You think you're safe? I aimed for Rudolph's red spot just to watch the North Pole panic."
    ]
    },
    "smokey" : {"name":"Smokey the Cloud","id":3, 
        "dialogue":["My skills leave the world charred behind me, like vintage vinyl on fire.",
                    "I'm not pollution; I'm a smoggy symphony of sophistication.",
                    "I'm not just smoke; I'm the essence of universes",
                    "Inhale the beats, exhale the vibes, I'm the brighter haze of white"
        ]
    },
}

let startTime = 2000;
let pause = false;

//create gameloop
window.requestAnimationFrame(gameLoop);

//we use async to make it wait for sleep to finish with await
async function gameLoop(){
    if (!firstIteration) {
        const pauseMenu = document.getElementById("pauseMenuBg");
        if (pause){
            pauseMenu.style.display = "block";
        }

        if (!pause){
            arrowOffsets = [(window.innerWidth/100)*33, (window.innerWidth/100)*41, (window.innerWidth/100)*49, (window.innerWidth/100)*57];
            pauseMenu.style.display = "none";
            if (stopGame){firstIteration=true;}
            moveDownArrow();
            frameCount += 1;
            if (frameCount > 80) {
                beatCount ++;
                if (wait > 10 && beatCount > waitArray[beatRotations]) {
                    if (wait > 10) {arrowSpeed += 1;}
                    
                    if (beatRotations == 3) {
                        beatRotations = 0; 
                    } else {
                        beatRotations += 1; 
                        beatCount = 0; 
                    }

                }
                changeChar(charArray[beatRotations]);
                frameCount = 0;
                changeText(beatRotations);
            }
            
            frameAdvance();
            updateLoss();
            updateComboTxt();
        }
        //add event listeners to take keypresses and releases
        sleep(250).then(() => {
            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);
        });
        
        await sleep(wait); //sleep for 150ms
        window.requestAnimationFrame(gameLoop); //restart loop
    }else {
        if (stopGame) {
            if (score > 0 && score <= 5000){
                grade = "f";
            }else if (score > 5000 && score <= 15000){
                grade="d";
            }else if (score > 15000 && score <= 30000){
                grade="c";
            }else if (score > 30000 && score <= 45000){
                grade="b";
            }else if (score > 45000){
                grade="a";
            }

            if (maxCombo < combo){
                maxCombo = combo;
            }

            popupColor = "#f03547";
            popupText = "You Suck..";
            startTime = 1000;
        }


        firstIteration = false;
        
        //create popup
        const popupPar = document.getElementById("holder");
        let popup = document.createElement("h1");
        popup.innerHTML = popupText;
        popup.id = "popup";
        popup.style.zIndex = 100;
        
        popupPar.appendChild(popup);

        changeChar(charArray[0]);
        changeText(0);

        console.log("First iteration")
        await sleep(startTime);
        if (stopGame) {
            window.location.replace(`page3.html?score=${score}&combo=${maxCombo}&grade=${grade}`);
        }
        
        popup = document.getElementById("popup");
        popupPar.removeChild(popup);
        window.requestAnimationFrame(gameLoop);
    }
}

//handle key presses
function handleKeyDown(event) {
    if (event.defaultPrevented) {
        return; // Do nothing if event already handled
    }
        const gameArea = document.getElementById("gameArea");
        //handle specific keys
        
        switch (event.key) {
            case "a":
                // Handle left arrow key press
                if (!isPressed[0] && !pause) {
                    clickedArrow(0);

                    changeSprite(0);
                    console.log("[!]Left arrow key pressed | isPressed " + isPressed[0]);
                    isPressed[0] = true;
                }
                break;

            case "s":
                // Handle down arrow key press
                if (!isPressed[1] && !pause) {
                    clickedArrow(1);

                    changeSprite(1);
                    console.log("[!]Down arrow key pressed | isPressed " + isPressed[1]);
                    isPressed[1] = true;
                }
                break;

            case "k":
                // Handle up arrow key press
                if (!isPressed[2] && !pause) {
                    clickedArrow(2);

                    changeSprite(2);
                    console.log("[!]Up arrow key pressed | isPressed " + isPressed[2]);
                    isPressed[2] = true;
                    console.log(fallingArrows);
                }
                break;

            case "l":
                // Handle right arrow key press
                if (!isPressed[3] && !pause) {
                    //collision Module
                    clickedArrow(3);

                    changeSprite(3);
                    console.log("[!]Right arrow key pressed | isPressed " + isPressed[3]);
                    isPressed[3] = true;
                }
                break;
            
            case "Escape":
                if (!pause){
                    pause = true;
                }else if (pause){
                    pause = false;
                }
                console.log("paused...");
                break;

            default:
                // Handle other keys if needed
                break;
        }

        sleep(100);
}

function clickedArrow(direction) {
    for (let x = 0; x < fallingArrows.length; x++) {
        const arrowId = fallingArrows[x];
        const arrow = document.getElementById("falling" + arrowId);
        const multip = combo / 10;

        // check if the arrow is still in the DOM
        if (arrow && arrows[arrowId][0] == direction) {
            let topS = arrow.style.top.substring(0, arrow.style.top.length - 2);
            let y = Number(topS);

            if (y >= 640 && y <= 680){
                gameArea.removeChild(arrow);
                updateScore(50 + (50*multip));
                combo += 1;
                fallingArrows.splice(x, 1); // Remove arrow ID from the array
                x--;
            }else if (y >= 600 && y <= 639){
                gameArea.removeChild(arrow);
                updateScore(20 + (20*multip));
                combo += 1;
                fallingArrows.splice(x, 1);
                x--;
            }else if (y >= 681 && y <= 720){
                gameArea.removeChild(arrow);
                updateScore(20 + (20*multip));
                combo += 1;
                fallingArrows.splice(x, 1);
                x--;
            }else if (y >= 570 && y <= 599){
                gameArea.removeChild(arrow);
                missAmount += 1;
                if (combo > maxCombo){
                    maxCombo = combo;
                }
                combo = 0;
                fallingArrows.splice(x, 1);
            }
        }
    }
}


//handle key releases
function handleKeyUp(event) {
    if (event.defaultPrevented) {
        return; // Do nothing if event already handled
    }

        //handle specific keys
        switch (event.key) {
            case "a":
                if (!pause)
                {
                // Handle left arrow key release
                resetSprites(0);
                console.log("[!]Left arrow key lifted | isPressed " + isPressed[0]);
                isPressed[0] = false;
                }
                break;

            case "s":
                if (!pause)
                {
                // Handle down arrow key release
                resetSprites(1);
                console.log("[!]Down arrow key lifted | isPressed " + isPressed[1]);
                isPressed[1] = false;
                }
                break;

            case "k":
                if (!pause)
                {
                // Handle up arrow key release
                resetSprites(2);
                console.log("[!]Up arrow key lifted | isPressed " + isPressed[2]);
                isPressed[2] = false;
                }
                break;

            case "l":
                if (!pause)
                {
                // Handle right arrow key release
                resetSprites(3);
                console.log("[!]Right arrow key lifted | isPressed " + isPressed[3]);
                isPressed[3] = false;
                }
                break;

            default:
                // Handle other keys if needed
                break;
        }

        sleep(100);
}

function changeSprite(arrowId) {
    const emptyArrow = document.getElementById("arrow" + arrowId);
    emptyArrow.src = "images/clicked" + arrowId + ".png";

}

function resetSprites(arrowId) {
    const clickedArrow = document.getElementById("arrow" + arrowId);
    clickedArrow.src = "images/empty" + arrowId + ".png";
    
}

function frameAdvance() {
    switch (frameCount) {
        case 16:
            spawnArrow(0);
            spawnArrow(3);
            break;

        case 32:
            spawnArrow(1);
            break;

        case 48:
            spawnArrow(3);
            spawnArrow(3);
            spawnArrow(2);
            break;
        
        case 64:
            spawnArrow(4);
            break;
        
        case 80:
            spawnArrow(5);
            break;

        
    }
    return;
}

function spawnArrow(soundId) {
    const arrowId = arrowCount;
    fallingArrows.push(arrowId); // Store the ID in the array
    arrows[arrowId] = [];
    arrows[arrowId][0] = getRandomInt(4);
    const arrowSound = sounds[soundId];
    arrows[arrowId][1] = arrowSound;

    const gameArea = document.getElementById("gameArea");
    const newArrow = document.createElement("img");
    newArrow.src = "images/falling" + arrows[arrowId][0] + ".png";
    newArrow.style.position = "absolute";
    newArrow.style.left = arrowOffsets[arrows[arrowId][0]] + "px";
    newArrow.style.top = "0px";
    newArrow.style.willChange = "transform";
    newArrow.style.transition = "transform 0.1s ease";
    newArrow.id = "falling" + arrowId;
    newArrow.style.zIndex = 3;

    gameArea.appendChild(newArrow);

    arrowCount++;
}

let score = 0;
function updateScore(amount) {
    const scoreTag = document.getElementById("scoreTag");
    let oldScore = scoreTag.innerHTML ;

    let newScore = Number(oldScore) + amount;
    score = newScore;
    scoreTag.innerHTML = newScore;
}

const opacityIncrement = 5;
let oldMissAmount = 0;

function updateLoss() {
    if (missAmount > 0) {
        const loseBg = document.getElementById("loseBg");
        loseBg.style.opacity = "100%";

        const loseText = document.getElementById("loseText");

        // Ensure the style property is set
        if (!loseText.style.opacity) {
            loseText.style.opacity = "5%"; // Set initial opacity
        }

        if (missAmount >= 15) {loseText.style.opacity = "0%"; loseBg.style.opacity = "0%";  stopGame = true;}

        let opacity = parseFloat(loseText.style.opacity);


        if (oldMissAmount !== missAmount && opacity < 1) {
            let newOpacity = Math.min(opacity + opacityIncrement / 100, 1);
            loseText.style.opacity = newOpacity.toString();
        }

        oldMissAmount = missAmount;
    }


}

function changeChar(charS){
    console.log("Char Sprite ID: " + charS + ".png"); 
    const charSprite = document.getElementById("enemy");
    charSprite.src = "images/" + charS + ".png";
}

function changeText(char) {
    console.log("Changing text for character: " + char);
    let charS = charArray[char];

    if (chars[charS]) {
        console.log("Character found in chars object. Updating text.");

        const charText = document.getElementById("enemyTxt");
        charText.innerHTML = chars[charS]["name"] + " : " + chars[charS]["dialogue"][getRandomInt(chars[charS]["dialogue"].length)];
    } else {
        console.error("Character not found in chars object. Check the 'char' variable and the 'chars' object.");
    }
}

function updateComboTxt() {
    const comboText = document.getElementById("comboTag");
    comboText.innerHTML = combo;
}

const urlParams = new URLSearchParams(window.location.search);
const dabloons = urlParams.get('dabloons');

function quit(){
    if (score > 0 && score <= 5000){
        grade = "f";
    }else if (score > 5000 && score <= 15000){
        grade="d";
    }else if (score > 15000 && score <= 30000){
        grade="c";
    }else if (score > 30000 && score <= 45000){
        grade="b";
    }else if (score > 45000){
        grade="a";
    }else{
        grade="angry";
    }

    if (maxCombo < combo){
        maxCombo = combo;
    }


    window.location.replace(`page3.html?score=${score}&combo=${maxCombo}&grade=${grade}&dabloons=${dabloons}`);

}

function mainMenu(){
    window.location.replace('index.html');
}

