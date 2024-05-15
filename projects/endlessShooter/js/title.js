const urlParams = new URLSearchParams(window.location.search);
const dabloons = urlParams.get('dabloons');

function play() {
    window.location.replace(`game.html?dabloons=${dabloons}`);
}

function tutorialPopup(){
    const tutorialPopup = document.getElementById("tutorialPopup");
    tutorialPopup.style.display = "block";
}

function exitPopup(){
    const tutorialPopup = document.getElementById("tutorialPopup");
    tutorialPopup.style.display = "none";
}

function changePage(){
    window.location.replace(`../../html/projects.html?dabloons=${dabloons}`);
}

