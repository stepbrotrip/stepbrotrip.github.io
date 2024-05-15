const urlParams = new URLSearchParams(window.location.search);
const dabloons = urlParams.get('dabloons');

function changePage(page){
    window.location.replace(page+`?dabloons=${dabloons}`);
}

async function changeToProject(page){
    addClass("spyglassOverlay","spyglassExit");
    await sleep(1000);
    removeClass("spyglassExit");
    document.getElementById("spyglassOverlay").style.display = "none";
    window.location.replace(page);
}

function preloadImages() {
    const imageUrls = [
        '../images/spyglassOverlay/spyglassOverlay1.png',
        '../images/spyglassOverlay/spyglassOverlay2.png',
        '../images/spyglassOverlay/spyglassOverlay3.png',
        '../images/spyglassOverlay/spyglassOverlay4.png',
        '../images/spyglassOverlay/spyglassOverlay5.png',
        '../images/marker/marker1.png',
        '../images/marker/marker2.png',
        '../images/marker/marker3.png',
        '../images/islands/island1.png',
        '../images/islands/island2.png',
        '../images/islands/island3.png',
        '../images/islands/island4.png',
        '../images/islands/island5.png',
        '../images/titleScreens/vibesBeats.png',
        '../images/titleScreens/endlessShooter.png'

    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

preloadImages();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addClass(id, className){
    const object = document.getElementById(id);
    object.classList.add(className);
}

function removeClass(id, className){
    const object = document.getElementById(id);
    console.log(id);
    object.classList.remove(className);
}

function hideItem(id){
    const object = document.getElementById(id);
    object.style.display = "none";
}

function showItem(id){
    const object = document.getElementById(id);
    object.style.display = "block";
}

function getRandomInt(min,max){ 
    return Math.floor(Math.random() * (max-min) + min);
}

let oldIsland;
const islands = ['island1', 'island2', 'island3', 'island4', 'island5'];
function chooseIsland() {
    let islandNumber = getRandomInt(0,islands.length);
    removeClass("island","island1"); removeClass("island","island2"); removeClass("island","island3"); removeClass("island","island4"); removeClass("island","island5");
    addClass("island", islands[islandNumber]);
}

async function spyglassStart(){
    if (!isInSpyglass){
        isInSpyglass = true;
        chooseIsland();
        hideItem("spyglass"); hideItem("marker"); hideItem("gallery"); hideItem("extras"); hideItem("contact");
        document.body.classList.add("spyglassBackground");
        document.getElementById("spyglassOverlay").style.display = "block";
        document.getElementById("island").style.display = "block";
        document.getElementById("projectList").style.display = "block";
        addClass("spyglassOverlay", "spyglassStart");
        await sleep(1000);
        removeClass("spyglassOverlay", "spyglassStart");
        addClass("spyglassOverlay", "spyglassFinish");
        document.getElementById(activeChoice).style.zIndex = 10002; 
    }

}

async function spyglassExit() {
    if (isInSpyglass) {
        for (let i = 0; i++; i < projects.length-1){
            document.getElementById(projects[i]).style.zIndex = 10;
        };
        removeClass("spyglassOverlay", "spyglassFinish")
        addClass("spyglassOverlay", "spyglassExit");
        await sleep(1000);
        removeClass("spyglassOverlay", "spyglassExit");
        showItem("spyglass"); showItem("marker"); showItem("gallery"); showItem("extras"); showItem("contact");
        document.getElementById("projectList").style.display = "none";
        document.getElementById("island").style.display = "none";
        document.getElementById("spyglassOverlay").style.display = "none";
        document.body.classList.remove("spyglassBackground");
        isInSpyglass = false;
    }
}

function checkKeyDown(event){
    switch (event.code){
        case "Escape":
            if (isInSpyglass){
                spyglassExit();
            }
            break;
    }
    
}

let switching = false;
let previousChoiceLeft, previousIndexLeft, previousChoiceRight, previousIndexRight;
let activeChoice = "vibesBeats";
let activeIndex = 0;
let projects = ["vibesBeats", "endlessShooter"];
async function arrowAnimationLeft(){
    if (!switching){
        switching = true;
        document.getElementById(activeChoice).style.zIndex = 10;
        removeClass(activeChoice, "titleHover");
        addClass("island", "exitLeft");
        addClass(activeChoice, "exitLeft");
        await sleep(1000);
        removeClass(activeChoice, "titleScreenActive");
        addClass(activeChoice, "titleScreenInactive");
        removeClass("island","exitLeft");
        removeClass(activeChoice, "exitLeft");
        if (!projects[activeIndex-1]){
            console.log("New Project: " + projects[projects.length-1]);
            activeChoice = projects[projects.length-1];
            activeIndex = projects.length-1;
        }else{
            activeChoice = projects[activeIndex-1];
            activeIndex = activeIndex-1;
        }
        chooseIsland();
        removeClass(activeChoice, "titleScreenInactive");
        addClass(activeChoice, "titleScreenActive");
        addClass("island", "enterRight");
        addClass(activeChoice, "enterRight");
        await sleep(1000);
        removeClass(activeChoice, "enterRight");
        removeClass("island", "enterRight");
        addClass(activeChoice, "titleHover");
        document.getElementById(activeChoice).style.zIndex = 10002;
        switching = false;
    }
}

async function arrowAnimationRight(){
    if (!switching){
        switching = true;
        document.getElementById(activeChoice).style.zIndex = 10;
        removeClass(activeChoice, "titleHover");
        addClass("island", "exitRight");
        addClass(activeChoice, "exitRight");
        await sleep(1000);
        removeClass(activeChoice, "titleScreenActive");
        addClass(activeChoice, "titleScreenInactive");
        removeClass("island","exitRight");
        removeClass(activeChoice, "exitRight");
        if (!projects[activeIndex+1]){
            activeChoice = projects[0];
            activeIndex = 0;
        }else{
            activeChoice = projects[activeIndex+1];
            activeIndex = activeIndex+1;
        }
        chooseIsland();
        removeClass(activeChoice, "titleScreenInactive");
        addClass(activeChoice, "titleScreenActive");
        addClass("island", "enterLeft");
        addClass(activeChoice, "enterLeft");
        await sleep(1000);
        removeClass("island","enterLeft");
        removeClass(activeChoice, "enterLeft");
        addClass(activeChoice, "titleHover");
        document.getElementById(activeChoice).style.zIndex = 10002;
        switching = false;
    }
}

async function openProject(){
    spyglassExit();
    await sleep(1000);
    console.log("opening Project");
    changePage(activeChoice);
}


let isInSpyglass = false;

const spyglass = document.getElementById("spyglass");
spyglass.addEventListener("click", spyglassStart);

const arrowL = document.getElementById("arrowLeft");
const arrowR = document.getElementById("arrowRight");

const project = document.getElementById(activeChoice);

project.addEventListener("click", openProject);

arrowL.addEventListener("click", arrowAnimationLeft);
arrowR.addEventListener("click", arrowAnimationRight);

document.addEventListener("keydown", checkKeyDown);


function writeToLocalStorage(itemName, text) {
    localStorage.setItem(itemName, text);
}

function readFromLocalStorage(itemName) {
    return localStorage.getItem(itemName);
}

let shouldShowInfo = readFromLocalStorage("shouldShowInfo");
if (shouldShowInfo){
    showInfo();
}else {
    writeToLocalStorage("shouldShowInfo", true);
}

function showInfo(){
    const infoBtn = document.getElementById("infoBtn");
    infoBtn.style.display = "block";
}

async function showPopupInfo(){
    let popup = document.getElementById("firstTimePopup");
    popup.style.display ="block";
    await sleep(8000);
    popup.style.display = "none";
}

let firstTimeVisit = readFromLocalStorage("firstTimeVisit");
if (firstTimeVisit){
    firstVisit();
}else {
    writeToLocalStorage("firstTimeVisit", true);
}

async function firstVisit(){
    if (firstTimeVisit == "true"){
        let popup = document.getElementById("firstTimePopup");
        popup.style.display ="block";
        await sleep(10000);
        popup.style.display = "none";

        writeToLocalStorage("firstTimeVisit",false);
        writeToLocalStorage("shoulsShowInfo",true);
    }
}