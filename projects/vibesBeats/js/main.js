const urlParams = new URLSearchParams(window.location.search);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changePage(pageName){
    window.location.replace(pageName);
}

let tagArray = ["v","i","b1","e1","s1","b2","e2","a","t","s2"];
let letterDis = [10,0,-10,10,-10,10,0,-10,10,0];
let dirArray = [1,-1,-1,-1,1,1,-1,-1,-1,-1];

let seV = 100;
let muV = 75;
let mute = false;

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

let selected = "play";
let selectorOffset = -85;
window.requestAnimationFrame(gameLoop);

async function gameLoop() {
    reloadSettings();
    waveEffect();

    if (mute == true) {
        const audio = document.getElementById("bgMusicDis");
        audio.pause();
    }

    sleep(250).then(() => {
        window.addEventListener("keydown", handleKeyDown);
    });

    const selector = document.getElementById("selector");
    selector.style.transform = 'translateY(' + selectorOffset + 'px)';
    await sleep(50);
    window.requestAnimationFrame(gameLoop);
}


function handleKeyDown(event) {
    if (event.defaultPrevented) {
        return; // Do nothing if event already handled
    }
    switch (event.code) {
        case "ArrowUp":
            if (selectorOffset > -85)
            {
                selectorOffset -= 85;
                assignSelected();
            }
            break;
        
        case "ArrowDown":
            if (selectorOffset < 85)
            {
                selectorOffset += 85;
                assignSelected();
            }
            break;
        
        case "Enter":
            loadSelected();
            break;
        
    }

}

function assignSelected(){
    switch(selectorOffset){
        case -85:
            selected = "play";
            break;
        
        case 0:
            selected = "settings";
            break;
        
        case 85:
            selected = "aboutUs";
            break;
    }
}

function loadSelected(){
    switch(selected){
        case "play":
            window.location.replace(`page2.html?muV=${muV}&seV=${seV}&mute=${mute}`);
            break;
        
        case "settings":
            window.location.replace(`settings.html?muV=${muV}&seV=${seV}&mute=${mute}`);
            break;

        case "aboutUs":
            window.location.replace(`credits.html?muV=${muV}&seV=${seV}&mute=${mute}`);
            break;
            
    }
}

function reloadSettings(){
    let newMuV = urlParams.get('muV');
    let newSeV = urlParams.get('seV');
    let newMute = urlParams.get('mute');

    muV = newMuV;
    mute = newMute;
    seV = newSeV;

    applySettings();
}

let isMusicPlaying = false;
function musicYes(){
    const audio = document.getElementById("bgMusicDis");
    console.log("found audio");
    mute=false;
    audio.play();
    audio.loop = true;
    audio.volume = .75;
    console.log("playing music");
    isMusicPlaying = true;
    const musicPopup = document.getElementById("musicPopup");
    musicPopup.style.display = "none";
}

function musicNo(){
    const musicPopup = document.getElementById("musicPopup");
    mute = true;
    musicPopup.style.display = "none";
}

function applySettings() {
    const audio = document.getElementById("bgMusicDis");
    audio.volume = muV/100;

}