const urlParams = new URLSearchParams(window.location.search);
const dabloons = urlParams.get('dabloons');

if (isNaN(dabloons)){
    window.location.replace("index.html?dabloons=0");
}

function changePage(page){
    window.location.replace(page+`?dabloons=${dabloons}`);
}

function preloadImages() {
    const imageUrls = [
        'images/octopus.png',
        'images/octopus15.png',
        'images/octoTime/octopus1.png',
        'images/octoTime/octopus2.png',
        'images/octoTime/octopus3.png',
        'images/octoTime/octopus4.png',
        'images/octoTime/octopus5.png',
        'images/octoTime/octopus6.png',
        'images/octoTime/octopus7.png',
        'images/octoTime/octopus8.png',
        'images/octoTime/octopus9.png',
        'images/octoTime/octopus10.png',
        'images/octoTime/octopus11.png',
        'images/octoTime/octopus12.png',
        'images/octoTime/octopus13.png',
        'images/octoTime/octopus14.png',
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

preloadImages();

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

async function octoTime(){
    if (!octoTimeB){
        octoTimeB = true;
        addClass("fishy", "octoTime");
        console.log("added class");
        await sleep(2000);
        removeClass("fishy", "octoTime");
        console.log("removed class");
        addClass('fishy', "octoTimeFinish");
        await sleep(2000);
        removeClass('fishy' , "octoTimeFinish");
        octoTimeB = false;
    }
}

let octoTimeB = false;
const octopus = document.getElementById("fishy");
octopus.addEventListener('click', octoTime);
