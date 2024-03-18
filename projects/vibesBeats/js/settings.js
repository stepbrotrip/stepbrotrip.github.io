
const urlParams = new URLSearchParams(window.location.search);
let muV = urlParams.get("muV");
let mute = urlParams.get("mute");
let seV = urlParams.get("seV");

loadSettings();
function loadSettings(){
    let soundEffectV = document.getElementById("seVolume");
    let musicVol = document.getElementById("musicVol");
    let muteObj = document.getElementById("mute");

    mute = mute === "true";

    musicVol.value = muV;
    muteObj.checked = mute;
    soundEffectV.value = seV;
}

let newSev = 0; 
let newMuv = 0;
let newMute = null;

function updateSettings() {

    let soundEffectV = document.getElementById("seVolume");
    let musicVol = document.getElementById("musicVol");
    let muteObj = document.getElementById("mute");


    
    newSev = soundEffectV.value;
    newMute = muteObj.checked;
    newMuv = musicVol.value;

    console.log(newSev + " " + newMute + " " + newMuv);

    console.log("New Config Created");
}

function exit() {
    console.log("Settings Updated");
    popup();

}

function popup() {
    const popupDiv = document.getElementById("applyPopup");
    popupDiv.style.display = "block";
}

function yah(){
    const popupDiv = document.getElementById("applyPopup");
    popupDiv.style.display = "none";
    window.location.replace(`index.html?muV=${newMuv}&seV=${newSev}&mute=${newMute}`);
}

function nah(){
    const popupDiv = document.getElementById("applyPopup");
    popupDiv.style.display = "none";
    window.location.replace(`index.html?muV=${45}&seV=${45}&mute=${true}`);
}