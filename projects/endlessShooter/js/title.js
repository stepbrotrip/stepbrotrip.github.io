function play() {
    window.location.replace("game.html");
}

function tutorialPopup(){
    const tutorialPopup = document.getElementById("tutorialPopup");
    tutorialPopup.style.display = "block";
}

function exitPopup(){
    const tutorialPopup = document.getElementById("tutorialPopup");
    tutorialPopup.style.display = "none";
}

function changePage(page){
    window.location.replace(page);
}