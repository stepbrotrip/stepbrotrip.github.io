function ok(){
    const disclaimer = document.getElementById("disclaimerBg");
    disclaimer.style.display = "none";
}

const urlParams = new URLSearchParams(window.location.search);
let muV = urlParams.get("muV");
let mute = urlParams.get("mute");
let seV = urlParams.get("seV");

function exit() {
    window.location.replace(`index.html?muV=${muV}&seV=${seV}&mute=${mute}`);
}