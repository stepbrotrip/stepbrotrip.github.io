let using_mouse = true;

let player;
let velocity = {
    "x": 0,
    "y": 0
};
let position = {
    "x": 0,
    "y": 0
}
let speed = 4;
let coins = 0;
let gun;
let gunPosition = {
    "x":35,
    "y":40
}
let ammo = 20;
let maxAmmo = 20;
let reloadSpeed = .75;
let backupAmmo = 380;
let playerDamage = 10;
let playerHealth = 100;
let maxHealth = 100;
let gunOffsetX = 25;
let gunOffsetY = 30;
let gunRotation = 0;
let dead = false;

class Enemy {
    constructor(x, y, className, width, height, health, points, damage) {
        this.ePosition = { x, y };
        this.className = className;
        this.velocity = { x: 0, y: 0 };
        this.width = width;
        this.height = height;
        this.health = health;
        this.element = document.createElement('div');
        this.element.classList.add(className);
        document.body.appendChild(this.element);
        this.iFrame = false;
        this.iFrameWait = 0.1;
        this.iFrameTime = 0;
        this.points = points;
        this.damage = damage;

        this.updatePosition = this.updatePosition.bind(this);

    }

    updatePosition() {
        this.newAngle = Math.atan2(position.y - this.ePosition.y, position.x - this.ePosition.x);
        this.velocity.x = Math.cos(this.newAngle);
        this.velocity.y = Math.sin(this.newAngle);
        
    
        this.ePosition.x += (this.velocity.x * enemSpeed[this.className]);
        this.ePosition.y += (this.velocity.y * enemSpeed[this.className]);
    
        this.element.style.left = this.ePosition.x + "px";
        this.element.style.top = this.ePosition.y + "px";
    }

    updateAnimation() {
        if (this.velocity.x < 0){
            this.element.style.transform = `scaleX(-1)`;
        }else {
            this.element.style.transform = `scaleX(1)`;
        }
    }
}


class EnemyWalker extends Enemy {
    constructor(x, y) {
        super(x, y, "enemyWalker", 64, 64, 20, 10, 5);
        this.maxHealth = 20;
    }

    isAttackingEnemy() {
        let enemRect = {
            x:this.ePosition.x,
            y:this.ePosition.y,
            width:this.width,
            height:this.height
        }

        let playerRect = {
            x: position.x,
            y: position.y,
            width: 80,
            height: 80
        }

        if (isColliding(enemRect, playerRect) && !playerIFrame){
            playerHit(this.damage);
        }
    }
}

class EnemyCrawler extends Enemy {
    constructor(x, y) {
        super(x, y, "enemyCrawler", 64, 64, 10, 5, 2);
        this.maxHealth = 10;
        this.laserBeams = [];
        this.attackTimer = 0;
        this.shouldAttack = true;

    }

    attack() {
        if (this.attackTimer%800 == 0){
            let laserBeam = document.createElement('div');
            laserBeam.classList.add("laserBeam");
            laserBeam.style.transform = `rotate(${Math.atan2(position.y - this.ePosition.y, position.x - this.ePosition.x)*(180/Math.PI)}deg)`;
            document.body.appendChild(laserBeam);
            let laserSpeed = 6;

            this.laserBeams.push({
                element: laserBeam,
                position: { x: this.ePosition.x, y: this.ePosition.y },
                velocity: {
                    x: this.velocity.x * laserSpeed,
                    y: this.velocity.y * laserSpeed
                }
            });

        }
    }
    updateLasers() {
        this.laserBeams.forEach((laser, index) => {
            if (position.x > window.innerWidth || position.x < 0
            || position.y < 0 || position.y > window.innerHeight){
                document.body.removeChild(laser.element);
                this.laserBeams.splice(index, 1);
            }
            laser.position.x += laser.velocity.x;
            laser.position.y += laser.velocity.y;

            laser.element.style.top = laser.position.y + "px";
            laser.element.style.left = laser.position.x + "px";
        });
    }

    destroyLasers() {
        this.laserBeams.forEach((laser, index) => {
            console.log("This is laser: " + laser.element);
            if (document.body.contains(laser.element)){
                document.body.removeChild(laser.element);
            }
        });
        this.laserBeams = null;
    }

    checkLasersCollision() {
        this.laserBeams.forEach((laser,index) => {
            let laserBox = {
                x:laser.position.x,
                y:laser.position.y,
                width: 2,
                height: 2
            }

            let playerRect = {
                x: position.x,
                y: position.y,
                width: 80,
                height: 80
            }

            if (isColliding(laserBox, playerRect) && !playerIFrame){
                playerHit(this.damage);
                if (document.body.contains(laser.element)){
                    document.body.removeChild(laser.element);
                    
                }
            }
        });
        
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createPlayer(){
    player = document.createElement("div");
    player.classList.add("player","idle");
    document.body.appendChild(player);
}

function spawnGun(){
    gun = document.createElement("div");
    gun.classList.add("gun");
    document.body.appendChild(gun);
}

function updatePos(x,y){
    player.style.top =(position.y = y) + 'px';
    player.style.left =(position.x = x) + 'px';

}

function updateHealth(){
    const healthPercentage = (playerHealth-maxHealth) * 100;

}

function updateGunPos(x,y){
    gun.style.top =(gunPosition.y = y) + 'px';
    gun.style.left =(gunPosition.x = x) + 'px';
}

function rotateGun(){
    if (using_mouse){
        let angle = Math.atan2(mouseY - gunPosition.y, mouseX - gunPosition.x);
        angle = angle * (180 / Math.PI);
        gun.style.transform = `rotate(${angle}deg)`;
    }else {
        gun.style.transform = `rotate(${gunRotation}deg)`;
    }
}

let bullets = [];
let bulletSpeed =10;

function createBullet() {
    if (using_mouse){
        newAngle = Math.atan2(mouseY - gunPosition.y, mouseX - gunPosition.x);
    }else {
        newAngle = (gunRotation) * Math.PI / 180;
    }
    let bulletSpeed = 10;
    let newBullet = document.createElement("div");
    newBullet.classList.add("bullet");
    let angle = Math.atan2(mouseY - gunPosition.y, mouseX - gunPosition.x);
    angle = angle * (180 / Math.PI);
    newBullet.style.transform = `rotate(${angle}deg)`;
    document.body.appendChild(newBullet);

    bullets.push( {
        element: newBullet,
        position: { x: gunPosition.x, y: gunPosition.y },
        velocity: {
            x: Math.cos(newAngle) * bulletSpeed,
            y: Math.sin(newAngle) * bulletSpeed
        }
    });
}

let numberOfLasers = 6;
let angleOfKame = 1;
let newKameAngle;
const kameHameHas = [];
function kamehameha() {
    canKameHameHa = false;
    for (let i = 0; i < numberOfLasers; i++) {
        if (angleOfKame >= 360) {
            angleOfKame = 1;
            newKameAngle = angleOfKame * Math.PI / 180;
        } else {
            angleOfKame += 360/numberOfLasers;
            newKameAngle = angleOfKame * Math.PI / 180;
        }

        let kameSpeed = 7;
        let newKameHameHa = document.createElement("div");
        newKameHameHa.classList.add("kamehameha");
        newKameHameHa.style.transform = `rotate(${angleOfKame}deg)`;
        document.body.appendChild(newKameHameHa);

        kameHameHas.push({
            element: newKameHameHa,
            position: { x: position.x, y: position.y },
            velocity: {
                x: Math.cos(newKameAngle) * kameSpeed,
                y: Math.sin(newKameAngle) * kameSpeed
            }
        });
    }
}


function updateKameHameHa(kameHameHa){
    kameHameHa.position.x += kameHameHa.velocity.x;
    kameHameHa.position.y += kameHameHa.velocity.y;

    kameHameHa.element.style.left = kameHameHa.position.x + "px";
    kameHameHa.element.style.top = kameHameHa.position.y + "px";
}

function destroyKamehameha(kameHameHa, index) {
    if (kameHameHa && document.body.contains(kameHameHa)){
        document.body.removeChild(kameHameHa);
        kameHameHas.splice(index, 1);
    }
}

function getDistance(point1, point2) {
    let dx = point2.x - point1.x;
    let dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function updateBullet(bullet) {
    bullet.position.x += bullet.velocity.x;
    bullet.position.y += bullet.velocity.y;

    bullet.element.style.left = bullet.position.x + "px";
    bullet.element.style.top = bullet.position.y + "px";
}

function destroyBullet(bullet) {
    if (bullet && bullet.nodeType && document.body.contains(bullet)){
        document.body.removeChild(bullet);
    }
}

function loadImages() {
    const imagesFolder = 'images/'; // Path to your images folder

    function loadImagesFromFolder(folder) {
        const img = new Image();
        img.onload = function() {
            console.log('Image loaded:', folder + this.src);
        };
        img.onerror = function() {
            console.error('Failed to load image:', folder + this.src);
        };
        img.src = folder + this.src;
    }

    function readDirectory(dirPath) {
        const files = Array.from(document.querySelectorAll("img"));
        files.forEach(file => {
            const filePath = file.src.split('/');
            const folder = filePath.slice(-2, -1) + '/';
            loadImagesFromFolder.call(file, folder);
        });
    }

    readDirectory(imagesFolder);
}

// Call the function with the path to your 'images' folder
loadImages('images');


let mouseX, mouseY;
async function init(){
    await loadImages();
    createPlayer();
    spawnGun();
    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.requestAnimationFrame(gameLoop);
}

let enemyWait = 4;
let enemyWaitTime = 0;
let dashWait = 3;
let dashWaitTime = 0;
let kamehamehaWait = 10;
let kamehamehaWaitTime = 0;
let canKameHameHa = true;
let time = 0;
let amountToSpawn;
let canDash = true;
let bulletPauseTime = 0;
let bulletWait = .05;
let canShoot = true;
let reloading = false;
let gunAnimationTime = 0;
let gunAnimationWait = .75;
let score = 0;
let playerIFrame = false;
let playerIFrameWait = .2;
let playerIFrameTime = 0;
let paused = false;
let helicopterFrame = false;
let helicopterWait = 3;
let helicopterTime = 0;
let moveHelicopter = false;
let helicopterCountdownInterval;

function updateHelicopterCountdown() {
    let remainingTime = ((helicopterWait * 1000 - helicopterTime) / 1000)/60;
    if (remainingTime < 0){
        remainingTime = 0;
    }
    let remainingSeconds = ((helicopterWait * 1000 - helicopterTime) / 1000)%60;
    let countdownText = remainingTime >= 0 ? `Helicopter arriving in ${(remainingTime).toFixed(0)} minutes ${remainingSeconds.toFixed(0)} seconds` : "Helicopter is arriving...";
    let helicopterCountdown = document.getElementById("helicopterCount");
    helicopterCountdown.innerText = countdownText;

    if (remainingTime <= 0) {
        clearInterval(helicopterCountdownInterval);
    }
}

async function gameLoop(){
    await sleep(10);
    if (!dead && !paused){
            updateHealthBar();
            time += 10;
            enemyWaitTime += 10;

            if (!helicopterFrame){
                helicopterTime += 10; // Update helicopter time only if helicopter is not yet summoned
                updateHelicopterCountdown();
                if (helicopterTime >= (helicopterWait * 1000)){
                    let helicopterCountdown = document.getElementById("helicopterCount");
                    helicopterCountdown.innerText = "Helicopter is arriving...";
                    summonHelicopter();
                    helicopterFrame = true;
                    moveHelicopter = true;
                }
            }

            if (moveHelicopter){
                moveHelicopterPos(650,400);
            }

            if (!canKameHameHa){
                const kamehamehaLogo = document.getElementById("kamehamehaLogo");
                kamehamehaLogo.classList.remove("kamehamehaLogo");
                kamehamehaLogo.classList.add("kamehamehaEmpty");
                kamehamehaWaitTime += 10;
                if (kamehamehaWaitTime >= (kamehamehaWait * 1000)){
                    kamehamehaLogo.classList.add("kamehamehaLogo");
                    kamehamehaLogo.classList.remove("kamehamehaEmpty");
                    canKameHameHa = true;
                    kamehamehaWaitTime = 0;
                }
            }

            if (playerIFrame){
                playerIFrameTime += 10;
                if (playerIFrameTime >= (playerIFrameWait * 1000)){
                    playerIFrame = false;
                    playerIFrameTime = 0;
                }
            }

            if (reloading){
                gunAnimationTime += 10;
            }

            if (gunAnimationTime >= (gunAnimationWait*1000)){
                gun.classList.remove("reloading");
                reloading = false;
                gunAnimationTime = 0;
            }

            if (enemyWaitTime >= (enemyWait*1000)){
                amountToSpawn = getRandomInt(3,6);
                for (let i = 0; i < amountToSpawn; i++){
                    spawnEnemy();
                }
                enemyWaitTime = 0;
            }

            if (!canShoot){
                bulletPauseTime += 10;
                if (bulletPauseTime >= (bulletWait*1000)){
                    bulletPauseTime = 0;
                    canShoot = true;
                }
            }

            if (!canDash){
                const dashLogo = document.getElementById("dashLogo");
                dashLogo.style.backgroundImage = "url('images/dashLogo1.png')";
                dashWaitTime += 10;
                if (dashWaitTime >= (dashWait*1000)){
                    dashLogo.style.backgroundImage = "url('images/dashLogo2.png')";
                    canDash = true;
                    dashWaitTime=0;
                }

            }

            if (using_mouse){
                window.addEventListener('mousemove', (event) => {
                    mouseX = event.clientX;
                    mouseY = event.clientY;
                });
            }
            if (!(keysPressed.some(key => key === true))){
                velocity.y=0;
                velocity.x=0;
            }

            if (leftDown){
                gunRotation -= 5;
            }else if (rightDown){
                gunRotation += 5;
            }
            rotateGun();
            if (upDown && !using_mouse && canShoot && ammo > 0){
                createBullet();
                ammo -= 1;
                canShoot = false;
            }
            
            const playerWidth = player.offsetWidth;
            const playerHeight = player.offsetHeight;

            if (position.x + playerWidth + (velocity.x * speed) < window.innerWidth && position.x + (velocity.x * speed) >= 0 &&
                position.y + playerHeight + (velocity.y * speed) < window.innerHeight && position.y + (velocity.y * speed) >= 0) {
                // Update the player's position only if it remains within the screen boundaries
                updatePos(position.x + (velocity.x * speed), position.y + (velocity.y * speed));
                updateGunPos(gunPosition.x + (velocity.x * speed), gunPosition.y + (velocity.y * speed));
            }

            bullets.forEach((bullet, index) => {
                updateBullet(bullet);
                checkHitEnemies(bullet, index);

                let distance = getDistance(position, bullet.position);
                if (distance > 1500) {
                    destroyBullet(bullet.element);
                }
            });

            kameHameHas.forEach((kamehameha, index) => {
                updateKameHameHa(kamehameha);
                checkHitEnemiesKame(kamehameha, index);
                let distance = getDistance(position, kamehameha.position);
                if (distance > 2000){
                    destroyKamehameha(kamehameha.element);
                }
            });

            ammoDrops.forEach((ammoDrop, index) => { 
                setAmmoDropPos(ammoDrop);
                pickupAmmo(ammoDrop, index);
            });

            coinDrops.forEach((coinDrop, index) => {
                setCoinDropPos(coinDrop);
                pickupCoin(coinDrop, index);
            });

            updateFountainPopup();
            updateHelicopterPopup();
            updateAmmoCount();
            enemies.forEach((enemy, index) => {
                enemy.updatePosition();
                enemy.updateAnimation();
                if (enemy.iFrame){
                    enemy.iFrameTime += 10;
                    if (enemy.iFrameTime >= (enemy.iFrameWait*1000)){
                        enemy.iFrame = false;
                        enemy.iFrameTime = 0;
                    }
                }
                if (enemy.className == "enemyCrawler"){
                    enemy.attackTimer += 10;
                    enemy.attack();
                    enemy.updateLasers();
                    enemy.checkLasersCollision(enemy);
                }else{
                    enemy.isAttackingEnemy();
                }
            });

            doPlayerAnimation();
            updateCoinCount();

            window.requestAnimationFrame(gameLoop);
    }else {
        if (dead){
            let deathPopup = document.getElementById("deathPopup");
            deathPopup.style.display = "block";
        }else if(paused){
            let pausePopup = document.getElementById("pausePopup");
            pausePopup.style.display = "block";
        }
    }
}

function restart(){
    window.location.reload();
}

let helicopterX = 0;
let helicopterY = 0;
let helicopterSpeed = 5;
function summonHelicopter(){
    const helicopter = document.getElementById("helicopter");
    const helipad = document.getElementById("helipad");
    helicopter.style.display = "block";
    helipad.style.display = "block";
}

function moveHelicopterPos(x, y) {
    // Check if the helicopter is already at the target position
    if (helicopterX >= x-2 && helicopterX <= x+2 && helicopterY <= y+2 && helicopterY >= y-2) {
        moveHelicopter = false;
        landHelicopter();
    }

    // Calculate the angle between the current position and the target position
    let angle = Math.atan2(y - helicopterY, x - helicopterX);
    
    // Calculate the velocity components using a fixed speed
    let velocityX = Math.cos(angle) * helicopterSpeed;
    let velocityY = Math.sin(angle) * helicopterSpeed;
    
    // Move the helicopter towards the target position
    helicopterX += velocityX;
    helicopterY += velocityY;
    
    // Update the helicopter's position
    const helicopterElement = document.getElementById("helicopter");
    helicopterElement.style.top = helicopterY + 'px';
    helicopterElement.style.left = helicopterX + 'px';
}


function checkHitEnemiesKame(kamehameha, index){
    let kamehamehaRect = {
        x: kamehameha.position.x,
        y: kamehameha.position.y,
        width:64,
        height:64
    };

    enemies.forEach((enemy, eIndex) => {
        let enemyRect = {
            x: enemy.ePosition.x,
            y: enemy.ePosition.y,
            width: enemy.width,
            height: enemy.height
        };

        if (isColliding(kamehamehaRect, enemyRect)){
            if (!enemy.iFrame){
                damageEnemy(enemy, eIndex, true);
                enemy.iFrame = true;
            }
        }
    });
}

let helicopterLanded = false;
function landHelicopter(){
    const helicopter = document.getElementById("helicopter");
    helicopter.style.transform = 'translateY(60px)';
    helicopterLanded = true;
}

function checkHitEnemies(bullet, bIndex){
    let bulletRect = {
        x: bullet.position.x,
        y: bullet.position.y,
        width: 2,
        height: 2
    };
    
    enemies.forEach((enemy, eIndex) => {
        let enemyRect = {
            x: enemy.ePosition.x,
            y: enemy.ePosition.y,
            width: enemy.width,
            height: enemy.height
        };
        if (isColliding(bulletRect, enemyRect)) {
            destroyBullet(bullet.element);
            if (!enemy.iFrame){
                damageEnemy(enemy, eIndex);
                enemy.iFrame = true;
            }
        }
    });
}
 
function damageEnemy(enemy, index, isKamehameha){
    if (isKamehameha){
        if (enemy.health-20 <= 0){
            if (enemy.className == "enemyCrawler"){
                enemy.destroyLasers();
            }
            document.body.removeChild(enemy.element);
            generateDrop(enemy.ePosition.x, enemy.ePosition.y);
            enemies.splice(index, 1);
        }else {
            enemy.health -= 20;
            enemy.element.style.backgroundImage="url(images/enemy/hit.png)";
        }
    }else {
        if (enemy.health-playerDamage <= 0){
            if (enemy.className == "enemyCrawler"){
                enemy.destroyLasers();
            }
            document.body.removeChild(enemy.element);
            generateDrop(enemy.ePosition.x, enemy.ePosition.y);
            enemies.splice(index, 1);
        }else {
            enemy.health -= playerDamage;
            enemy.element.style.backgroundImage="url(images/enemy/hit.png)";
        }
    }
}

function doPlayerAnimation(){
    if (keysPressed.some(key => key === true)){
        player.classList.remove('idle');
        player.classList.add('walking');
        if (keysPressed[1]){
            player.style.transform = `scaleX(1)`;

        }else if (keysPressed[0]){
            player.style.transform = `scaleX(-1)`;
        }
    }else {
        player.classList.remove('walking');
        player.classList.add('idle');
    }
}

//a d s w
let leftDown, rightDown, upDown;
let keysPressed = [false, false, false, false];
function handleKeyDown(event){

    switch(event.key){
        case "a":
            keysPressed[0]=true;
            velocity.x = -1;
            break;
        
        case "d":
            keysPressed[1]=true;
            velocity.x = 1;
            break;

        case "s":
            keysPressed[2]=true;
            velocity.y = 1;
            break;

        case "w":
            keysPressed[3]=true;
            velocity.y = -1;
            break;

        case "r":
            reload();
            break;

        case "e":
            if (canKameHameHa){
                kamehameha();
            }
            break;
        
        case "f":
            const playerRect = {
                x: position.x,
                y: position.y,
                width: 64,
                height: 64
            };

            let monument = document.getElementById("decor4");
            let healingRect = {
                x:950,
                y:350,
                width: 120,
                height: 160
            };        
            let helicopterRect = {
                x:helicopterX,
                y:helicopterY,
                width: 150,
                height: 150
            };
            if (isColliding(playerRect, healingRect)){
                healWithFountain();
            }
            if (isColliding(playerRect, helicopterRect)){
                winGame();
            }
            break;
    }

    switch (event.code){
        //up 38 down 40 left 37 right 39
        case "ArrowUp":
            upDown = true;
            break;
        
        case "ArrowLeft":
            leftDown = true;
            break;

        case "ArrowRight":
            rightDown = true;
            break;
            
        case "ArrowDown":
            break;
        
        case "Space":
            if (canDash){
                dash();
                canDash=false;
            }
            break;
        
        case "Escape":
            if (!paused)
            {
                document.getElementById("pausePopup").style.display = "block";
                paused = true;
            }
            break;
        }
}

function updateFountainPopup(){

    const playerRect = {
        x: position.x,
        y: position.y,
        width: 64,
        height: 64
    };

    let healingRect = {
        x:950,
        y:350,
        width: 120,
        height: 160
    };

    if (isColliding(playerRect,healingRect)){
        const fountainPopup = document.getElementById("fountainPopup");
        fountainPopup.style.display = "block";
    }else {
        const fountainPopup = document.getElementById("fountainPopup");
        fountainPopup.style.display = "none";
    }
}

let newDabloons = 0;
const urlParams = new URLSearchParams(window.location.search);
function updateDabloonsMadeInMinigames(){
    let baseDabloons = urlParams.get("dabloons");
    newDabloons = Number(baseDabloons) + Number(coins);
}

function winGame(){
    if (helicopterLanded){
        updateDabloonsMadeInMinigames();
        window.location.replace(`index.html?dabloons=${newDabloons}`);
    }
}

function updateHelicopterPopup(){

    const playerRect = {
        x: position.x,
        y: position.y,
        width: 64,
        height: 64
    };

    let helicopterRect = {
        x:helicopterX,
        y:helicopterY,
        width: 150,
        height: 150
    };

    if (isColliding(playerRect,helicopterRect)){
        const fountainPopup = document.getElementById("helicopterPopup");
        fountainPopup.style.display = "block";
    }else {
        const fountainPopup = document.getElementById("helicopterPopup");
        fountainPopup.style.display = "none";
    }
}


function healWithFountain(){
    if (coins >= 5){
        coins -= 5;
        if (playerHealth+40 > maxHealth){
            playerHealth = maxHealth;
        }else {
            playerHealth += 40;
        }
    }
}

function reload(){
    gun.classList.add("reloading");
    reloading = true;
    if (backupAmmo > 0){
        if (backupAmmo < maxAmmo){
            ammo = backupAmmo;
            backupAmmo -= backupAmmo;
        }else if (ammo == 0){
            ammo = maxAmmo;
            backupAmmo -= maxAmmo;
        }else {
            backupAmmo -= (maxAmmo - ammo);
            ammo = maxAmmo;
        }
    }
}

function handleKeyUp(event){

    switch(event.key){
        case "a":
            keysPressed[0]=false;
            velocity.x = 0;
            break;
        
        case "d":
            keysPressed[1]=false;
            velocity.x = 0;
            break;

        case "s":
            keysPressed[2]=false;
            velocity.y=0;
            break;

        case "w":
            keysPressed[3]=false;
            velocity.y=0;
            break;
    }
    switch (event.code){
        //up 38 down 40 left 37 right 39
        case "ArrowUp":
            upDown = false;
            break;
        
        case "ArrowLeft":
            leftDown = false;
            break;

        case "ArrowRight":
            rightDown=false;
            break;
            
        case "ArrowDown":
            break;
    }
}

async function handleMouseDown(event) {
    if (event.button === 0) {
        updateGunPos(gunPosition.x-5,gunPosition.y-5);
        await sleep(100);
        updateGunPos(gunPosition.x+5,gunPosition.y+5);
        if (ammo <= 0){
            emptyMagazine = true;
        }else if (canShoot && using_mouse){
            ammo -= 1;
            createBullet();
            canShoot = false;
        }
        
    }
}

let enemSpeed = {
    "enemyCrawler": 1,
    "enemyWalker" : 1
}
let enemies = [];

function spawnEnemy() {
    let sideOrTop = getRandomInt(0, 3);
    let x, y;
    if (sideOrTop <= 1) {
        let dir = getRandomInt(0, 3);
        if (dir <= 1) {
            x = -50;
        } else {
            x = window.innerWidth + 50;
        }
        y = getRandomInt(0, window.innerHeight);
    } else {
        let dir = getRandomInt(0, 3);
        if (dir <= 1) {
            y = -50;
        } else {
            y = window.innerHeight + 50;
        }
        x = getRandomInt(0, window.innerWidth);
    }


    let enemy;
    let enemType = getRandomInt(0,2);
    if (enemType == 1) {
        enemy = new EnemyWalker(x, y, "enemyWalker", 64, 64, 20, enemies.length);
    } else {
        enemy = new EnemyCrawler(x, y, "enemyCrawler", 64, 64, 10, enemies.length);
    }
    enemies.push(enemy);
}

function getRandomInt(min,max){ 
    return Math.floor(Math.random() * (max-min) + min);
}

function updateAmmoCount(){
    const ammoLabel = document.getElementById("ammoCount");
    ammoLabel.innerText = ammo + "/" + backupAmmo;
}

let ammoDrops = [];
let coinDrops = [];
function generateDrop(x,y){
    dropAmmo = getRandomInt(0,15);
    dropCoin = getRandomInt(0,10);
    if (dropAmmo <= 1){
        let ammoDrop = document.createElement("div");
        ammoDrop.classList.add("ammoDrop");
        document.body.appendChild(ammoDrop);

        ammoDrops.push({
            element: ammoDrop,
            position: { x: x, y: y },
            width: 32,
            height: 32
        });
    }else if (dropCoin <= 2){
        let coinDrop = document.createElement("div");
        coinDrop.classList.add("coinDrop");
        document.body.appendChild(coinDrop);

        coinDrops.push({
            element: coinDrop,
            position: {x: x, y: y},
            width:32,
            height:32
        });
    }
}

function setAmmoDropPos(ammoDrop){
    ammoDrop.element.style.top = ammoDrop.position.y + 'px';
    ammoDrop.element.style.left = ammoDrop.position.x + 'px';
}

function setCoinDropPos(coinDrop){
    coinDrop.element.style.top = coinDrop.position.y + 'px';
    coinDrop.element.style.left = coinDrop.position.x + 'px';
}

function dash(){
    updatePos(position.x+(velocity.x*150), position.y+(velocity.y*150));
    updateGunPos(gunPosition.x+(velocity.x*150), gunPosition.y+(velocity.y*150));

    if (position.x > window.innerWidth){
        updatePos(window.innerWidth-player.offsetWidth, position.y);
        updateGunPos(window.innerWidth-player.offsetWidth, gunPosition.y);
    }
    if (position.x < 0){
        updatePos(player.offsetWidth, position.y);
        updateGunPos(0+player.offsetWidth, gunPosition.y);
    }
    if (position.y > window.innerHeight){
        updatePos(position.x, window.innerHeight-player.offsetHeight);
        updateGunPos(gunPosition.x, window.innerHeight-player.offsetHeight+gunOffsetY);
    }
    if (position.y < 0){
        updatePos(position.x, player.offsetHeight);
        updateGunPos(gunPosition.x ,player.offsetHeight+gunOffsetY);
    }
}

function pickupAmmo(ammoDrop, index){
    const ammoDropRect = {
        x: ammoDrop.position.x,
        y: ammoDrop.position.y,
        width: 32,
        height: 32
    };

    const playerRect = {
        x: position.x,
        y: position.y,
        width: 64,
        height: 64
    };

    if (isColliding(playerRect, ammoDropRect)) {
        backupAmmo += getRandomInt(15,45);
        destroyAmmoDrop(index);
    }
}

function pickupCoin(coinDrop, index){
    const coinDropRect = {
        x: coinDrop.position.x,
        y: coinDrop.position.y,
        width: 32,
        height: 32
    };

    const playerRect = {
        x: position.x,
        y: position.y,
        width: 64,
        height: 64
    };

    if (isColliding(playerRect, coinDropRect)) {
        const coinToGive = getRandomInt(1,3);
        coins += coinToGive;
        destroyCoinDrop(index);
    }
}2

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function destroyAmmoDrop(index){
    document.body.removeChild(ammoDrops[index].element);
    ammoDrops.splice(index, 1);
}

function destroyCoinDrop(index){
    document.body.removeChild(coinDrops[index].element);
    coinDrops.splice(index, 1);
}

function playerHit(damage){
    if (!playerIFrame){
        if (playerHealth <= 0){
            dead = true;
        }else {
            console.log(damage);
            playerHealth -= damage;
            playerIFrame = true;
        }
    }
}

function updateHealthBar(){
    let healthBar = document.getElementById("hpBarFg");
    healthBar.style.width = playerHealth*2 + "px";
}

function updateCoinCount(){
    let coincount = document.getElementById("coinCount");
    coincount.innerText = coins;
}

function exit(){
    let baseDabloons = urlParams.get("dabloons");
    window.location.replace(`index.html?dabloons=${baseDabloons}`);
}

function unpause(){
    document.getElementById("pausePopup").style.display = "none";
    paused = false;
    if (!dead && !paused) {
        window.requestAnimationFrame(gameLoop);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    init();
});

shootSkulls() {
    for (let i = 0; i < 5; i++) {
        let skullPos = {
            x: (this.ePosition.x-125) + (100*i),
            y: this.ePosition.y+(window.innerHeight/100)*35
        };
        let skullAngle = Math.atan2(position.y - skullPos.y, position.x - skullPos.x);
        let skullSpeed = 5;
        let newSkull = document.createElement("div");
        newSkull.classList.add("bossSkull");
        newSkull.style.transform = `rotate(${skullAngle*(180/Math.PI)})`;
        newSkull.style.top = skullPos.y + 'px';
        newSkull.style.left = skullPos.x + 'px';
        parent.appendChild(newSkull);
        this.skulls.push({
            element: newSkull,
            position: { x: skullPos.x, y: skullPos.y },
            velocity: {
                x: Math.cos(skullAngle) * skullSpeed,
                y: Math.sin(skullAngle) * skullSpeed
            }
        });
    }
}