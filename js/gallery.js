function init(id, arrayInt) {
    const object = document.getElementById(id);
    object.addEventListener("mouseover", function() {
        objectHover(id, frameArray[arrayInt]);
    });
    object.addEventListener("mouseout", function() {
        objectReset(id, frameArray[arrayInt]);
    });
    object.addEventListener("click", function(){
        zoomIn(id, frameArray[arrayInt], arrayInt);
    })

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

const urlParams = new URLSearchParams(window.location.search);
const dabloons = urlParams.get('dabloons');

function changePage(page){
    window.location.replace(page+`?dabloons=${dabloons}`);
}

function objectHover(id, objectFrame) {
    const object = document.getElementById(id);
    const frame = document.getElementById(objectFrame);
    object.style.transform = "translateY(-15px)";
    frame.style.transform = "translateY(15px)";
}   

function objectReset(id, objectFrame) {
    const object = document.getElementById(id);
    const frame = document.getElementById(objectFrame);
    object.style.transform = "translateY(0)";
    frame.style.transform = "translateY(0)";
}

let zoomed = false;

function showZoomedInUI(){
    const exitOverlay = document.getElementById("exitOverlay");
    exitOverlay.style.display = "block";
    
}

function hideZoomedInUI(){
    const exitOverlay = document.getElementById("exitOverlay");
    exitOverlay.style.display = "none";
}

function zoomIn(id, objectFrame, arrayInt){
    const object = document.getElementById(id);
    const frame = document.getElementById(objectFrame);

    const objectStyle = window.getComputedStyle(object);
    const objectWidth = objectStyle.getPropertyValue('width');
    const objectHeight = objectStyle.getPropertyValue('height');
    const frameStyle = window.getComputedStyle(frame);
    const frameWidth =  frameStyle.getPropertyValue('width');
    const frameHeight = frameStyle.getPropertyValue('height');
    const any = isInZoom.some(Boolean);
    if (!any){
        showZoomedInUI();
        isInZoom[arrayInt] = true;
        activeIndex = arrayInt;
        object.style.zIndex = 11;
        frame.style.zIndex = 12;
        object.style.width = parseInt(objectWidth)*2 + "px";
        object.style.height = parseInt(objectHeight)*2 + "px";
        object.style.left = "22%";
        object.style.top = "23%";

        frame.style.width = parseInt(frameWidth)*2 + "px";
        frame.style.height = parseInt(frameHeight)*2 + "px";
        frame.style.left = "22%";
        frame.style.top = "67%";
        
    }
}

function exitZoom(id, objectFrame, arrayInt){
    const object = document.getElementById(id);
    const frame = document.getElementById(objectFrame);

    const objectStyle = window.getComputedStyle(object);
    const objectWidth = objectStyle.getPropertyValue('width');
    const objectHeight = objectStyle.getPropertyValue('height');
    const frameStyle = window.getComputedStyle(frame);
    const frameWidth = frameStyle.getPropertyValue('width');
    const frameHeight = frameStyle.getPropertyValue('height');
    
    if (isInZoom[arrayInt]){
        hideZoomedInUI();
        object.style.zIndex = 9;
        frame.style.zIndex = 10;
        object.style.width = parseInt(objectWidth)/2 + "px";
        object.style.height = parseInt(objectHeight)/2 + "px";

        frame.style.width = parseInt(frameWidth)/2 + "px";
        frame.style.height = parseInt(frameHeight)/2 + "px";

        // Resetting the position
        object.style.left = ""; // Reset left property
        object.style.top = ""; // Reset top property
        frame.style.left = ""; // Reset left property
        frame.style.top = ""; // Reset top property

        isInZoom[arrayInt] = false;
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function exitOverlay() {
    const zoomedIndex = isInZoom.findIndex(zoomed => zoomed);
    if (zoomedIndex !== -1) {
        exitZoom(pictureArray[zoomedIndex], frameArray[zoomedIndex], zoomedIndex);
    }
}


const frameArray = ["airPirateFrame", "spaceSceneFrame", "spaceDriveFrame", "krackenFrame"];
const isInZoom = [false, false, false, false];
const pictureArray = ["airPirates", "spaceScene", "spaceDrive", "kracken"];

init("airPirates", 0);
init("spaceScene", 1);
init("spaceDrive", 2);
init("kracken",3);
