const urlParams = new URLSearchParams(window.location.search);
const score = urlParams.get('score');
const maxCombo = urlParams.get('combo');
const grade = urlParams.get('grade');
const dabloons = urlParams.get('dabloons');

function transferPage() {
    window.location.replace(`page2.html?dabloons=${dabloons}`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



const scoreLbl = document.getElementById("scoreTag");
scoreLbl.innerText = score;

const comboLbl = document.getElementById("comboTag");
comboLbl.innerText = maxCombo;

const gradeImg = document.getElementById("grade");
gradeImg.src = "images/" + grade + ".png";


let tagArray = ["y","o","u1","s","u2","c","k"];
let letterDis = [10,0,-10,10,0,-10,10,0,-10,10,0];
let dirArray = [1,-1,-1,-1,1,1,1,-1,-1,-1,-1];


function waveEffect() {

    for (var i = 0; i < tagArray.length; i++) {
        let letter = document.getElementById(tagArray[i]);

        if (letterDis[i] >= 15){
            dirArray[i] = -1;
        }else if (letterDis[i] <= -15){
            dirArray[i] = 1;
        }

        letterDis[i] += 3*dirArray[i];

        letter.style.transform = 'translateY(' + letterDis[i] + 'px)';
    }
}

window.requestAnimationFrame(gameLoop);

async function gameLoop() {
    waveEffect();
    await sleep(50);
    window.requestAnimationFrame(gameLoop);
}