
let currentDeltaTime = 0;
let using_mouse = true;
let parent = document.body;
let player;
let velocity = {
    "x": 0,
    "y": 0
};
let mouseLeftDown = false;
let position = {
    "x": 0,
    "y": 0
}
let speed = 5;
let coins = 0;
let gun;
let gunOffset = {
    xOff : ((window.innerWidth/100)*4)*.5,
    yOff : ((window.innerHeight/100)*4)*2.1
}
let ammo = 65;
let maxAmmo = 65;
let reloadSpeed = .75;
let backupAmmo = 380;
let playerDamage = 20;
let playerHealth = 100;
let maxHealth = 100;
let gunRotation = 0;
let dead = false;
let helicopterX = 0;
let helicopterY = 0;
let helicopterSpeed = 5;

let ladderRect = {
    x: (window.innerWidth/100)*46,
    y: 0,
    width: (window.innerWidth/100)*5,
    height: (window.innerHeight/100)*20
};

let healingRect = {
    x: (window.innerWidth/100)*50,
    y: (window.innerHeight/100)*43,
    width: (window.innerWidth/100)*9.25,
    height: (window.innerHeight/100)*20
};

let helicopterRect = {
    x:helicopterX,
    y:helicopterY,
    width: (window.innerWidth/100)*10,
    height: (window.innerHeight/100)*20
};

let playerRect = {
    x: position.x,
    y: position.y,
    width: (window.innerWidth/100)*4,
    height: (window.innerHeight/100)*14
};

let undergroundEntranceRect = {
    x: (window.innerWidth/100)*35,
    y: (window.innerHeight/100)*75,
    width: (window.innerWidth/100)*6,
    height: (window.innerHeight/100)*6
};

let alterRect = {
    x: (window.innerWidth/100)*38,
    y: (window.innerHeight/100)*34,
    width: (window.innerWidth/100)*20,
    height: (window.innerHeight/100)*45
};

function calculateDistance(x1, x2, y1, y2){
    return Math.round(Math.sqrt((x2-x1)**2+(y2-y1)**2));
}
//TL BL TR BR
let cornerPositions = [{x:0, y:0},{x:0,y:window.innerHeight},{x:window.innerWidth,y:0},{x:window.innerWidth,y:0}];

class Enemy {
    constructor(x, y, className, width, height, health, points, damage, dontMove, run, rush, slam) {
        this.ePosition = { x, y };
        this.className = className;
        this.velocity = { x: 0, y: 0 };
        this.width = width;
        this.height = height;
        this.health = health;
        this.element = document.createElement('div');
        this.element.classList.add(className);
        this.element.style.top = this.ePosition.y + 'px';
        this.element.style.left = this.ePosition.x + 'px';
        parent.appendChild(this.element);
        this.iFrame = false;
        if (this.className == "bossEnemy"){
            this.iFrameWait = 0.17;
        }else {
            this.iFrameWait = 0.12;
        }
        this.iFrameTime = 0;
        this.points = points;
        this.damage = damage;
        this.dontMove = dontMove;
        this.run = run;
        this.rush = rush;
        this.corner = cornerPositions[getRandomInt(0,cornerPositions.length-1)];

        this.updatePosition = this.updatePosition.bind(this);

    }

    //TL BL TR BR
    getCornerToRun(){
        let playerPosition = {
            x: position.x + (((window.innerWidth/100)*4)/2),
            y: position.y + (((window.innerHeight/100)*14)/2)
        };
        if (this.ePosition.x < playerPosition.x && this.ePosition.y < playerPosition.y) {
            this.corner = cornerPositions[2]; // Top right corner
        } else if (this.ePosition.x < playerPosition.x && this.ePosition.y > playerPosition.y) {
            this.corner = cornerPositions[1]; // Bottom right corner
        } else if (this.ePosition.x > playerPosition.x && this.ePosition.y < playerPosition.y) {
            this.corner = cornerPositions[3]; // Top left corner
        } else if (this.ePosition.x > playerPosition.x && this.ePosition.y > playerPosition.y) {
            this.corner = cornerPositions[0]; // Bottom left corner
        }
    }

    updatePosition() {
        if (!this.dontMove){
            if (this.className == "bossEnemy"){
                if (this.ePosition.x+((window.innerWidth/100)*15) >= window.innerWidth){
                    this.velocity.x *= -1;
                }else if (this.ePosition.x <= 0){
                    this.velocity.x *= -1;
                }
                this.ePosition.x += (this.velocity.x * enemSpeed[this.className]);

                this.element.style.left = this.ePosition.x + "px";
            }
            else if  (this.run && !this.rush){
                this.getCornerToRun();
                this.newAngle = Math.atan2(this.corner.y - this.ePosition.y, this.corner.x - this.ePosition.x);
                this.velocity.x = Math.cos(this.newAngle);
                this.velocity.y = Math.sin(this.newAngle);
                
            
                this.ePosition.x += (this.velocity.x * enemSpeed[this.className]);
                this.ePosition.y += (this.velocity.y * enemSpeed[this.className]);
            
                this.element.style.left = this.ePosition.x + "px";
                this.element.style.top = this.ePosition.y + "px";
            }else if(this.rush && this.className == "enemyWalker"){
                this.newAngle = Math.atan2(position.y - this.ePosition.y, position.x - this.ePosition.x);
                this.velocity.x = Math.cos(this.newAngle);
                this.velocity.y = Math.sin(this.newAngle);
                
            
                this.ePosition.x += (this.velocity.x * (enemSpeed[this.className]*1.5));
                this.ePosition.y += (this.velocity.y * (enemSpeed[this.className]*1.5));
            
                this.element.style.left = this.ePosition.x + "px";
                this.element.style.top = this.ePosition.y + "px";
            }else {
                this.newAngle = Math.atan2(position.y - this.ePosition.y, position.x - this.ePosition.x);
                this.velocity.x = Math.cos(this.newAngle);
                this.velocity.y = Math.sin(this.newAngle);
                
            
                this.ePosition.x += (this.velocity.x * enemSpeed[this.className]);
                this.ePosition.y += (this.velocity.y * enemSpeed[this.className]);
            
                this.element.style.left = this.ePosition.x + "px";
                this.element.style.top = this.ePosition.y + "px";
            }
        }
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
        super(x, y, "enemyWalker", (window.innerWidth/100)*5 , (window.innerHeight/100)*16, 50, 10, 2, false, false, false, false);
        this.maxHealth = 50;
    }

    
    
    checkDistanceFromPlayer(){
        let distance = calculateDistance(position.x, this.ePosition.x, position.y, this.ePosition.y);
        if(distance > 500){
            this.run = false;
        }

        if(this.run && this.health < maxHealth/3){
            this.rush = true;
        }
    }

    isAttackingEnemy() {
        this.checkDistanceFromPlayer();
        let enemRect = {
            x:this.ePosition.x,
            y:this.ePosition.y,
            width:this.width,
            height:this.height
        };
        
        let playerRect = {
            x: position.x,
            y: position.y,
            width: (window.innerWidth/100)*4,
            height: (window.innerHeight/100)*14
        };

        if (isColliding(enemRect, playerRect) && !playerIFrame){
            playerHit(this.damage);
            this.run = true;
            this.dontMove = false;
        }
    }

}

class EnemyBoss extends Enemy {
    constructor(x,y) {
        super(x,y, "bossEnemy", (window.innerWidth/100)*15, (window.innerHeight/100)*30, 3750, 5, 5, false, false, false, false);
        this.maxHealth =3750;
        this.skulls = [];
        this.element.classList.add("idle");
        this.shouldShootSkulls = false;
        this.attackTimer = 0;
        this.spikes = [];
        this.spikeTimer = 0;
        this.setOffSpikes = false;
        this.spikesSpawned = false;
        this.spiking = false;
        this.lasers = [];
        this.laserTime = false;
        this.laserTimer = 0;
        this.lasering = false;
        this.velocity.x = 1;
        this.spawningPos = 0;
    }

    checkDistanceFromPlayer(){
        let distance = calculateDistance(position.x, this.ePosition.x, position.y, this.ePosition.y);

        if (!this.dontMove && distance < 200){
            this.dontMove = false;
            this.slam = true;
        }

        if (this.run && distance > 500){
            this.run = false;
            this.shouldShootSkulls = true;
        }

        if (distance < 500 && !this.dontMove && !this.slam && !this.run && this.attackTimer%1500 == 0){
            this.shouldShootSkulls = true;
        }
        
    }

    shootSkulls() {
        let skullPos = {};
        let playerPoint = "s";
        if (position.x >= this.ePosition.x && position.x <= this.ePosition.x+((window.innerWidth/100)*15)){
            playerPoint = "s";
        }
        if (position.x < this.ePosition.x){
            playerPoint = "sw";
        }
        if (position.x > this.ePosition.x+((window.innerWidth/100)*15)){
            playerPoint = "se";
        } 
        if (position.y < (window.innerHeight/2) && position.x < this.ePosition.x){
            playerPoint = "w";
            this.spawningPos = this.ePosition.x;
        }
        if (position.y < (window.innerHeight/2)  && position.x > this.ePosition.x+((window.innerWidth/100)*15)){
            playerPoint = "e";
            this.spawningPos = this.ePosition.x;
        }
        for (let i = 0; i < 5; i++) {
            switch(playerPoint){
                case "s":
                    skullPos = {
                        x: (this.ePosition.x-125) + (100*i),
                        y: this.ePosition.y+(window.innerHeight/100)*35
                    };
                    break;
                case "sw":
                    skullPos = {
                        x: (this.ePosition.x) - (100*i),
                        y: (this.ePosition.y+((window.innerHeight/100)*30)) - (50*i)
                    };
                    break;
                case "se":
                    skullPos = {
                        x: (this.ePosition.x+((window.innerWidth/100)*15)) + (100*i),
                        y: (this.ePosition.y+((window.innerHeight/100)*30)) - (50*i)
                    };
                    break;
                case "e":
                    skullPos = {
                        x: this.spawningPos+((window.innerWidth/100)*15)+100,
                        y: (this.ePosition.y+((window.innerHeight/100)*30)) - (50*i)
                    }
                    break;
                case "w":
                    skullPos = {
                        x: this.spawningPos-100,
                        y: (this.ePosition.y+((window.innerHeight/100)*30)) - (50*i)
                    }
                    break;
            }
            let skullAngle = Math.atan2((position.y+((window.innerHeight/100)*7)) - skullPos.y, (position.x+((window.innerWidth/100)*4))- skullPos.x);
            let skullSpeed = 7;
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

    updateSkulls(){
        this.skulls.forEach((skull, index) => {
            if (position.x > window.innerWidth+500 || position.x < 0-500
            || position.y < 0 || position.y > window.innerHeight+500){
                if (parent.contains(skull.element)){
                    parent.removeChild(skull.element);
                    this.skulls.splice(index, 1);
                }
            }
            skull.position.x += skull.velocity.x;
            skull.position.y += skull.velocity.y;

            skull.element.style.top = skull.position.y + "px";
            skull.element.style.left = skull.position.x + "px";
        });
    }

    laser() {
        this.destroyLasers();
            const laserPos = {
                x: position.x,
                y: 0
            };
            this.element.classList.remove("idle");
            this.element.classList.add("lasering");
            let newLaser = document.createElement("div");
            newLaser.classList.add("bossLaserSpawning");
            newLaser.style.top = laserPos.y + 'px';
            newLaser.style.left = laserPos.x + 'px';
            parent.appendChild(newLaser);
            // Store spike information
            this.lasers.push({
                element: newLaser,
                position: laserPos,
            });
        this.lasering = true;
    }

    updateLaser(){
        if (!this.laserTime && this.lasering){
            this.laserTimer += currentDeltaTime;
            this.lasers.forEach((laser, index) => {
                if (!laser.element.classList.contains("bossLaserActive")){
                    if (this.laserTimer < 2000){
                        laser.position.x = position.x;
                        laser.element.style.left = laser.position.x + "px";
                    }
                    if (this.laserTimer > 2000){
                        this.element.classList.remove("lasering");
                        this.element.classList.add("idle");
                    }
                }
            });
            if (this.laserTimer >= 2250){
                this.laserTime = true;
                this.laserTimer = 0;
            }
        }
        if (this.laserTime) {
            this.lasers.forEach((laser, index) => {
                laser.element.classList.remove("bossLaserSpawning");
                laser.element.classList.add("bossLaserActive");
            });
            this.lasering = false;
            this.laserTime = false;
        }
    }

    spike() {
        this.destroySpikes();
        const numSpikes = getRandomInt(4, 6);
        const radius = 250; // Radius of the circle
        for (let j = 0; j < numSpikes; j++) {
            // Calculate angle for each spike
            const angle = (Math.PI * 2 * j) / numSpikes;
            // Calculate spike position using polar coordinates
            const spikePos = {
                x: position.x + radius * Math.cos(angle),
                y: position.y + radius * Math.sin(angle)
            };
            // Create and position spike element
            let newSpike = document.createElement("div");
            newSpike.classList.add("bossSpikeSpawning");
            newSpike.style.top = spikePos.y + 'px';
            newSpike.style.left = spikePos.x + 'px';
            parent.appendChild(newSpike);
            // Store spike information
            this.spikes.push({
                element: newSpike,
                position: spikePos,
            });
            
        }
        this.spiking = true;
    }

    checkSpikeCollision() {
        this.spikes.forEach((spike,index) => {
            let spikeBox = {
                x:spike.position.x,
                y:spike.position.y,
                width: (window.innerWidth/100)*2,
                height: (window.innerHeight/100)*15
            }

            let playerRect = {
                x: position.x,
                y: position.y,
                width: (window.innerWidth/100)*4,
                height: (window.innerHeight/100)*14
            };
        
            if (isColliding(spikeBox, playerRect) && !playerIFrame && spike.element.classList.contains("bossSpikeUp")){
                playerHit(this.damage);
            }
        });
        
    }

    checkLaserCollision() {
        this.lasers.forEach((laser,index) => {
            let laserBox = {
                x:laser.position.x,
                y:laser.position.y,
                width: (window.innerWidth/100)*2,
                height: (window.innerHeight/100)*200
            }

            let playerRect = {
                x: position.x,
                y: position.y,
                width: (window.innerWidth/100)*4,
                height: (window.innerHeight/100)*14
            };
        
            if (isColliding(laserBox, playerRect) && !playerIFrame && laser.element.classList.contains("bossLaserActive")){
                playerHit(10);
            }
        });
        
    }

    updateSpikes(){
        if (!this.setOffSpikes){
            this.spikesSpawned = true;
            this.spikeTimer += currentDeltaTime;
            if (this.spikeTimer >= 1500){
                this.setOffSpikes = true;
                this.spikeTimer = 0;
            }
        }else if (this.setOffSpikes) {
            this.spikes.forEach((spike, index) => {
                spike.element.classList.remove("bossSpikeSpawning");
                spike.element.classList.add("bossSpikeUp");
            });
            this.spiking = false;
            this.setOffSpikes = false;
            this.spikesSpawned = false;
        }

    }

    destroySpikes() {
        this.spikes.forEach((spike, index) => {
            if (parent.contains(spike.element)){
                parent.removeChild(spike.element);
            }
        });
        this.spikes = [];
    }

    destroyLasers() {
        this.lasers.forEach((laser, index) => {
            if (parent.contains(laser.element)){
                parent.removeChild(laser.element);
            }
        });
        this.lasers = [];
    }

    destroySkulls() {
        this.skulls.forEach((skull, index) => {
            if (parent.contains(skull.element)){
                parent.removeChild(skull.element);
            }
        });
        this.skulls = [];
    }

    updateBossBar() {
        let healthBar = document.getElementById("bossBarFg");
        let healthBarBg = document.getElementById("bossBarBg");
        let percentHp = this.health/this.maxHealth;
        let healthBarWidthVw = 50*percentHp;
        healthBarBg.style.display = "block";
        healthBar.style.width = healthBarWidthVw + "vw";
    }

    checkSkullCollision() {
        this.skulls.forEach((skull,index) => {
            let skullBox = {
                x:skull.position.x,
                y:skull.position.y,
                width: (window.innerWidth/100)*3,
                height: (window.innerHeight/100)*4
            }

            let playerRect = {
                x: position.x,
                y: position.y,
                width: (window.innerWidth/100)*4,
                height: (window.innerHeight/100)*14
            };

            if (isColliding(skullBox, playerRect) && !playerIFrame){
                playerHit(4);
                if (parent.contains(skull.element)){
                    parent.removeChild(skull.element);
                    
                }
            }
        });
        
    }

    updateAttacks(){
        if (this.spiking){
            this.updateSpikes();
        }
        this.attackTimer += 10;
        
        if (this.health > (this.maxHealth*.8)){
            if (this.attackTimer%400 == 0){
                this.shootSkulls();
            }

            if (this.shouldShootSkulls){
                this.shootSkulls();
                this.shouldShootSkulls = false;
            }

        }else if (this.health <= (this.maxHealth*.8) && this.health > (this.maxHealth*.5)){
            if (!this.shouldShootSkulls && this.attackTimer%2000 == 0){
                this.spike();
                
            }

            if (this.attackTimer%300 == 0){
                this.shootSkulls();
            }

        }else if (this.health <= (this.maxHealth*.5)){
            if (this.attackTimer%2500 == 0){
                this.laser();
            }

            if (this.attackTimer%1500 == 0){
                this.spike();
                
            }

            if (this.attackTimer%200 == 0){
                this.shootSkulls();
            }
        }
    }
}

class EnemyCrawler extends Enemy {
    constructor(x, y) {
        super(x, y, "enemyCrawler", (window.innerWidth/100)*3.75, (window.innerHeight/100)*7.5, 30, 5, 2, false, false);
        this.maxHealth = 30;
        this.laserBeams = [];
        this.attackTimer = 0;
        this.shouldAttack = true;
        
}

    checkDistanceFromPlayer(){
        let distance = calculateDistance(position.x, this.ePosition.x, position.y, this.ePosition.y);
        if(distance < 200 && this.dontMove){
            this.run = true;
            this.dontMove = false;
        }else if (distance < 300 && !this.run){
            this.element.classList.remove()
            this.dontMove = true;
        }else if (distance > 350){
            this.dontMove = false;
            this.run = false;
        }
    }

    attack() {
        this.checkDistanceFromPlayer();
        if (this.attackTimer%1000 == 0){
            let laserBeam = document.createElement('div');
            laserBeam.classList.add("laserBeam");
            laserBeam.style.transform = `rotate(${Math.atan2(position.y - this.ePosition.y, position.x - this.ePosition.x)*(180/Math.PI)}deg)`;
            parent.appendChild(laserBeam);
            let laserSpeed = 8;
            let newLaserAngle = Math.atan2(position.y - this.ePosition.y, position.x - this.ePosition.x+getRandomInt(-3,3));
            let laserVelocity = {
                x:Math.cos(newLaserAngle),
                y:Math.sin(newLaserAngle)
            };
            this.laserBeams.push({
                element: laserBeam,
                position: { x: this.ePosition.x, y: this.ePosition.y },
                velocity: {
                    x: laserVelocity.x * laserSpeed,
                    y: laserVelocity.y * laserSpeed
                }
            });

        }
    }
    updateLasers() {
        this.laserBeams.forEach((laser, index) => {
            if (position.x > window.innerWidth || position.x < 0
            || position.y < 0 || position.y > window.innerHeight){
                if (parent.contains(laser.element)){
                    parent.removeChild(laser.element);
                    this.laserBeams.splice(index, 1);
                }
            }
            laser.position.x += laser.velocity.x;
            laser.position.y += laser.velocity.y;

            laser.element.style.top = laser.position.y + "px";
            laser.element.style.left = laser.position.x + "px";
        });
    }

    destroyLasers() {
        this.laserBeams.forEach((laser, index) => {
            if (parent.contains(laser.element)){
                parent.removeChild(laser.element);
            }
        });
        this.laserBeams = null;
    }

    checkLasersCollision() {
        this.laserBeams.forEach((laser,index) => {
            let laserBox = {
                x:laser.position.x,
                y:laser.position.y,
                width: (window.innerWidth/100)*2,
                height: (window.innerHeight/100)*5
            }

            let playerRect = {
                x: position.x,
                y: position.y,
                width: (window.innerWidth/100)*4,
                height: (window.innerHeight/100)*14
            };

            if (isColliding(laserBox, playerRect) && !playerIFrame){
                playerHit(this.damage);
                if (parent.contains(laser.element)){
                    parent.removeChild(laser.element);
                    
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
    parent.appendChild(player);

}

function spawnGun(){
    gun = document.createElement("div");
    gun.classList.add("gun");
    player.appendChild(gun);
}

function updatePos(x,y){
    player.style.top =(position.y = y) + 'px';
    player.style.left =(position.x = x) + 'px';

}

function updateHealth(){
    const healthPercentage = (playerHealth-maxHealth) * 100;

}

let gunLeft = false;
let gunRight = true;
function rotateGun() {
    if (using_mouse) {
        let angle = Math.atan2(mouseY - (position.y + gunOffset.yOff), mouseX - (position.x + gunOffset.xOff));
        angle = angle * (180 / Math.PI);
        if (gunLeft){
            gun.style.transform = `rotate(${angle}deg)`;
            if (angle < -90 || angle > 90) {
                gun.style.transform += `scaleY(1)`;
            }
            gun.style.transform += `scaleX(1)`;
        }else if (gunRight){
            gun.style.transform = `rotate(${-angle}deg)`;
            if (angle < -90 || angle > 90) {
                gun.style.transform += `scaleY(-1)`;
            }
            gun.style.transform += `scaleX(-1)`;
        }


    } else {
        gun.style.transform = `rotate(${gunRotation}deg)`;
    }
}


let bullets = [];
let bulletSpeed = 17;

function createBullet() {
    if (window.innerWidth <= 1170){
        let newBullet = document.createElement("div");
        newBullet.classList.add("bullet");
        let target;
        
        if (enemies.length > 0) {
            if (enemies.some(enemy => enemy.className === "bossEnemy")) {
                target = enemies.find(enemy => enemy.className === "bossEnemy");
            } else {
                // Ensure getRandomInt is properly defined
                const randomIndex = getRandomInt(0, enemies.length - 1);
                target = enemies[randomIndex];
            }
        } else {
            target = { ePosition: { x: 500, y: 500 } }; // Adjust if target should have x and y properties
        }
        
        // Calculate the angle in radians
        const dx = target.ePosition.x - (position.x + gunOffset.xOff);
        const dy = target.ePosition.y - (position.y + gunOffset.yOff);
        let angle = Math.atan2(dy, dx); // Angle in radians
        let angleDeg = angle * (180 / Math.PI); // Convert radians to degrees
        
        newBullet.style.transform = `rotate(${angleDeg}deg)`;
        parent.appendChild(newBullet);
        
        bullets.push({
            element: newBullet,
            position: { x: position.x + gunOffset.xOff, y: position.y + gunOffset.yOff },
            velocity: {
                x: Math.cos(angle) * bulletSpeed,
                y: Math.sin(angle) * bulletSpeed
            }
        });
        
    }else{
        if (using_mouse){
            newAngle = Math.atan2(mouseY - (position.y+gunOffset.yOff), mouseX - (position.x + gunOffset.xOff));
        }else {
            newAngle = (gunRotation) * Math.PI / 180;
        }
        let newBullet = document.createElement("div");
        newBullet.classList.add("bullet");
        let angle = Math.atan2(mouseY - (position.y+gunOffset.yOff), mouseX - (position.x+gunOffset.xOff));
        angle = angle * (180 / Math.PI);
        newBullet.style.transform = `rotate(${angle}deg)`;
        parent.appendChild(newBullet);

        bullets.push( {
            element: newBullet,
            position: { x: position.x+(gunOffset.xOff), y: position.y+gunOffset.yOff},
            velocity: {
                x: Math.cos(newAngle) * bulletSpeed,
                y: Math.sin(newAngle) * bulletSpeed
            }
        });
    }
}

let numberOfLasers = 4;
let angleOfKame = 1;
let newKameAngle;
const kameHameHas = [];
function kamehameha() {
    canKameHameHa = false;
    let startingX = position.x -30;
    for (let i = 1; i < numberOfLasers; i++) {
        newKameAngle = Math.atan2(mouseY - position.y, mouseX - position.x);
        angleOfKame = newKameAngle * (180 / Math.PI);
        let kameSpeed = 12;
        let newKameHameHa = document.createElement("div");
        if (getRandomInt(0,4) <= 1){
            newKameHameHa.classList.add("kamehameha1");
        }else {
            newKameHameHa.classList.add("kamehameha2");
        }
        newKameHameHa.style.transform += `rotate(${angleOfKame}deg)`;
        parent.appendChild(newKameHameHa);

        kameHameHas.push({
            element: newKameHameHa,
            position: { x: startingX+(i*30), y: position.y },
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
    if (kameHameHa && parent.contains(kameHameHa)){
        parent.removeChild(kameHameHa);
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
    if (bullet && bullet.nodeType && parent.contains(bullet)){
        parent.removeChild(bullet);
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
    if (window.innerWidth <= 1170){
        window.addEventListener("touchstart", handleTouchDown);
        window.addEventListener("touchend", handleTouchUp);
        document.getElementById("left").addEventListener("touchstart", function(){mobileButtonPressed("a");});
        document.getElementById("right").addEventListener("touchstart", function(){mobileButtonPressed("d");});
        document.getElementById("up").addEventListener("touchstart", function(){mobileButtonPressed("w");});
        document.getElementById("down").addEventListener("touchstart", function(){mobileButtonPressed("s");});
        document.getElementById("left").addEventListener("touchend", function(){mobileButtonReleased("a");});
        document.getElementById("right").addEventListener("touchend", function(){mobileButtonReleased("d");});
        document.getElementById("up").addEventListener("touchend", function(){mobileButtonReleased("w");});
        document.getElementById("down").addEventListener("touchend", function(){mobileButtonReleased("s");});
    }
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    window.requestAnimationFrame(gameLoop);
}

let enemyWait = 6;
let enemyWaitTime = 0;
let dashWait = .5;
let dashWaitTime = 0;
let kamehamehaWait = 5;
let kamehamehaWaitTime = 0;
let canKameHameHa = true;
let time = 0;
let amountToSpawn;
let canDash = true;
let bulletPauseTime = 0;
let bulletWait = .15;
let canShoot = true;
let reloading = false;
let gunAnimationTime = 0;
let gunAnimationWait = .75;
let score = 0;
let playerIFrame = false;
let playerIFrameWait = .18;
let playerIFrameTime = 0;
let paused = false;
let helicopterFrame = false;
let helicopterWait = 180;
let helicopterTime = 0;
let moveHelicopter = false;
let helicopterCountdownInterval;
let frame = 0;
let prevFrame = -1;
let isUnderground = false;
let bossSpawned = false;
let ritualSkulls = 0;

const upstairsUpdates = [
    updatePlayerPosition,
    updateBullets, 
    updateEnemies,
    updateKameHameHas, 
    updateAmmoDrops,
    updateCoinDrops,
    updateSkullDrops,
    updateTreasure,
    updateAmmoCount,
    updateSkullCount,
    doPlayerAnimation,
    updateCoinCount,
    rotateGun,
];

const underGroundUpdates = [
    updatePlayerPosition,
    updateBullets, 
    updateKameHameHas, 
    updateAmmoDrops,
    updateCoinDrops,
    updateTreasure,
    updateAmmoCount,
    updateSkullCount,
    doPlayerAnimation,
    updateCoinCount,
    rotateGun,
];

const decorAmount = 10;

let cutsceneOver = false;
let cutsceneTime = 2.4;
let cutsceneTimer = 0;

function updateDecorZIndex(){
    for (let decorIndex = 1; decorIndex < decorAmount; decorIndex++){
        let decor = document.getElementById("decor" + decorIndex);
        if(decor.style.top+((window.innerHeight/100)*decor.style.height) > position.y){
            decor.style.zIndex = player.style.zIndex+100;
        }else {
            decor.style.zIndex = player.style.zIndex-100;
        }
    }
}

function updateHelicopterCountdown() {
    let remainingTime = (helicopterWait * 1000 - helicopterTime) / 1000;
    if (remainingTime < 0) {
        remainingTime = 0;
    }
    let remainingMinutes = Math.floor(remainingTime / 60);
    let remainingSeconds = Math.floor(remainingTime % 60);
    let countdownText = remainingTime >= 0 ? `Helicopter arriving in ${remainingMinutes} minutes ${remainingSeconds} seconds` : "Helicopter is arriving...";
    let helicopterCountdown = document.getElementById("helicopterCount");
    helicopterCountdown.innerText = countdownText;

    if (remainingTime <= 0) {
        clearInterval(helicopterCountdownInterval);
    }
}

function checkOutOfBounds(){
    if (position.x >= window.innerWidth+200){
        console.log("Moved out right screen. Moved back : ", ((window.innerWidth/100)*4)+100, "px" );
        position.x -= ((window.innerWidth/100)*4)+100;
    }else if (position.x < 0-200){
        console.log("Moved out left screen. Moved back : ", ((window.innerWidth/100)*4)+100, "px" );
        position.x += ((window.innerWidth/100)*4)+100;
    }
    if (position.y >= window.innerHeight-200){
        console.log("Moved below screen. Moved back : ", ((window.innerHeight/100)*14)+100, "px" );
        position.y -= ((window.innerHeight/100)*14)+100;
    }else if (position.y < 0){
        console.log("Moved above screen. Moved back : ", ((window.innerHeight/100)*14)+100, "px" );
        position.y += ((window.innerHeight/100)*14)+200;
    }
    updatePos(position.x, position.y);
}

function doUpdates(updates){
    for (let updateIndex = 0; updateIndex < updates.length; updateIndex++){
        if (frame>prevFrame){
            updates[updateIndex]();

        }
    }
}

function mainGame(){

    if (!isUnderground){
        enemyWaitTime += currentDeltaTime;
        if (!helicopterFrame) {
            helicopterTime += currentDeltaTime; // Update helicopter time based on elapsed time
            updateHelicopterCountdown();
            if (helicopterTime >= helicopterWait * 1000) {
                let helicopterCountdown = document.getElementById("helicopterCount");
                helicopterCountdown.innerText = "Helicopter is arriving...";
                summonHelicopter();
                helicopterFrame = true;
                moveHelicopter = true;
            }
        }
    
        if (moveHelicopter) {
            moveHelicopterPos((window.innerWidth/100)*70, (window.innerHeight/100)*40);
        }

        if (enemyWaitTime >= enemyWait * 1000) {
            amountToSpawn = getRandomInt(4,6);
                for (let i = 0; i < amountToSpawn; i++){
                    spawnEnemy();
                }
            enemyWaitTime = 0;
        }
    }

    healingRect = {
        x: (window.innerWidth/100)*50,
        y: (window.innerHeight/100)*43,
        width: (window.innerWidth/100)*9.25,
        height: (window.innerHeight/100)*20
    };
        
    helicopterRect = {
        x:helicopterX,
        y:helicopterY,
        width: (window.innerWidth/100)*10,
        height: (window.innerHeight/100)*20
    };
        
    playerRect = {
        x: position.x,
        y: position.y,
        width: (window.innerWidth/100)*4,
        height: (window.innerHeight/100)*14
    };
    
    undergroundEntranceRect = {
        x: (window.innerWidth/100)*35,
        y: (window.innerHeight/100)*75,
        width: (window.innerWidth/100)*6,
        height: (window.innerHeight/100)*6
    };

    updateHealthBar();
    time += currentDeltaTime; // Update time based on elapsed time
        
    if (!canKameHameHa) {
        const kamehamehaLogo = document.getElementById("kamehamehaLogo");
        kamehamehaLogo.classList.remove("kamehamehaLogo");
        kamehamehaLogo.classList.add("kamehamehaEmpty");
        kamehamehaWaitTime += currentDeltaTime;
        if (kamehamehaWaitTime >= kamehamehaWait * 1000) {
            kamehamehaLogo.classList.add("kamehamehaLogo");
            kamehamehaLogo.classList.remove("kamehamehaEmpty");
            canKameHameHa = true;
            kamehamehaWaitTime = 0;
        }
    }

    if (playerIFrame) {
        playerIFrameTime += currentDeltaTime;
        if (playerIFrameTime >= playerIFrameWait * 1000) {
            playerIFrame = false;
            playerIFrameTime = 0;
        }
    }

    if (reloading) {
        gunAnimationTime += currentDeltaTime;
    }

     if (gunAnimationTime >= gunAnimationWait * 1000) {
        gun.classList.remove("reloading");
        reloading = false;
        gunAnimationTime = 0;
    }

    if (!canShoot) {
        bulletPauseTime += currentDeltaTime;
        if (bulletPauseTime >= bulletWait * window.innerWidth+100) {
            bulletPauseTime = 0;
            canShoot = true;
        }
    }

    if (canShoot && mouseLeftDown){
        if (ammo > 0){
            createBullet();
            ammo -= 1;
        }else {
            reload();
        }
        canShoot = false;
    }

    if (!canDash) {
        updateDashLogo();
    }
} 

let summoningBoss = false;
let lastFrameTime = performance.now();
async function gameLoop() {

    if (!dead && !paused && !isUnderground) {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;
        currentDeltaTime = deltaTime;
        parent = document.getElementById("upstairs");

        mainGame();

        doUpdates(upstairsUpdates);
        updatePopup("fountainPopup", healingRect, playerRect);
        updatePopup("helicopterPopup",helicopterRect, playerRect);
        updatePopup("entrancePopup",undergroundEntranceRect, playerRect);

        prevFrame = frame;
        frame ++;
        window.requestAnimationFrame(gameLoop);

    } else if (isUnderground && !paused && !dead){
        parent = document.getElementById("underGround");
        const currentTime = performance.now();
        const deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;
        currentDeltaTime = deltaTime;

        alterRect = {
            x: (window.innerWidth/100)*38,
            y: (window.innerHeight/100)*34,
            width: (window.innerWidth/100)*20,
            height: (window.innerHeight/100)*45
        };

        ladderRect = {
            x: (window.innerWidth/100)*46,
            y: 0,
            width: (window.innerWidth/100)*5,
            height: (window.innerHeight/100)*20
        };

        mainGame();

        enemies.forEach((enemy, index) => {
            if (enemy.className == "bossEnemy"){
                enemy.updateSkulls();
                enemy.updateLaser();
                enemy.checkDistanceFromPlayer();
                enemy.updateAttacks();
                enemy.updateBossBar();
                enemy.updatePosition();
                enemy.checkSkullCollision();
                enemy.checkSpikeCollision();
                enemy.checkLaserCollision();
            }
            if (enemy.iFrame) {
                enemy.iFrameTime += currentDeltaTime;
                if (enemy.iFrameTime >= enemy.iFrameWait * 1000) {
                    enemy.iFrame = false;
                    enemy.iFrameTime = 0;
                }
            }
        });

        let cutscene = document.getElementById("cutscene");
        let candle1 = document.getElementById("candle1");
        let candle2 = document.getElementById("candle2");
        if (!cutsceneOver && summoningBoss){
            cutscene.style.display = "block";
            cutsceneTimer += currentDeltaTime;
            if (cutsceneTimer >= 2400){
                cutscene.style.display = "none";
                candle1.classList.remove("candleOff"); candle2.classList.remove("candleOff"); 
                candle1.classList.add("candleOn"); candle2.classList.add("candleOn"); 
                await sleep(150);
                let enemy = new EnemyBoss((window.innerWidth/2)-((window.innerWidth/100)*9),50);
                enemies.push(enemy);
                summoningBoss = false;
                cutsceneOver = true;
                cutsceneTimer = 0;
            }
        }

        doUpdates(underGroundUpdates);
        updatePopup("alterPopup", alterRect, playerRect);
        updatePopup("ladderPopup", ladderRect, playerRect);
        prevFrame = frame;
        frame ++;
        window.requestAnimationFrame(gameLoop);
        
    } else {
        velocity.x = 0;
        velocity.y = 0;
        if (dead) {
            let deathPopup = document.getElementById("deathPopup");
            deathPopup.style.display = "block";
        } else if (paused) {
            let pausePopup = document.getElementById("pausePopup");
            pausePopup.style.display = "block";
        }
    }
}

function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.updatePosition();
        enemy.updateAnimation();
        if (enemy.iFrame) {
            enemy.iFrameTime += 5;
            if (enemy.iFrameTime >= enemy.iFrameWait * 1000) {
                enemy.iFrame = false;
                enemy.iFrameTime = 0;
            }
        }
        if (enemy.className == "enemyCrawler") {
            enemy.attackTimer += 10;
            enemy.attack();
            enemy.updateLasers();
            enemy.checkLasersCollision(enemy);
        } else if (enemy.className == "enemyWalker"){
            enemy.isAttackingEnemy();
        }
    });
}

function updateDashLogo() {
    const dashLogo = document.getElementById("dashLogo");
    dashLogo.style.backgroundImage = "url('images/dashLogo1.png')";
    dashWaitTime += 10;
    if (dashWaitTime >= dashWait * 1000) {
        dashLogo.style.backgroundImage = "url('images/dashLogo2.png')";
        canDash = true;
        dashWaitTime = 0;
    }
}

function updatePlayerPosition() {
    const playerWidth = (window.innerWidth/100)*5.5;
    const playerHeight = (window.innerHeight/100)*10;

    if (position.x + playerWidth + (velocity.x * speed) < window.innerWidth+150 && position.x + (velocity.x * speed) >= 0-150 &&
        position.y + playerHeight + (velocity.y * speed) < window.innerHeight+150 && position.y + (velocity.y * speed) >= 0-150) {

        updatePos(position.x + (velocity.x * speed), position.y +(velocity.y * speed));
    }
}

function updateBullets() {
    bullets.forEach((bullet, index) => {
        updateBullet(bullet);
        checkHitEnemies(bullet, index);
        
        let distance = getDistance(position, bullet.position);
        if (distance > 1000) {
            destroyBullet(bullet.element);
        }
    });
}

function updateKameHameHas() {
    kameHameHas.forEach((kamehameha, index) => {
        updateKameHameHa(kamehameha);
        checkHitEnemiesKame(kamehameha, index);
        let distance = getDistance(position, kamehameha.position);
        if (distance > 2000) {
            destroyKamehameha(kamehameha.element);
        }
    });
}

function updateAmmoDrops() {
    ammoDrops.forEach((ammoDrop, index) => {
        setAmmoDropPos(ammoDrop);
        pickupItem(ammoDrop, pickupAmmo, playerRect, index, false);
    });
}

function updateCoinDrops() {
    coinDrops.forEach((coinDrop, index) => {
        setCoinDropPos(coinDrop);
        pickupItem(coinDrop, pickupCoin, playerRect, index, false);
    });
}

function updateSkullDrops() {
    skullDrops.forEach((skullDrop,index) => {
        setRitualSkullDropPos(skullDrop);
        pickupItem(skullDrop, pickupSkull, playerRect, index, false);
    })
}

function updateTreasure() {
    treasures.forEach((treasureDrop, index) => {
        setTreasurePos(treasureDrop);
        let treasureRect = {
            x: treasureDrop.position.x,
            y: treasureDrop.position.y,
            width: (window.innerWidth/100)*5,
            height: (window.innerHeight/100)*10
        };
        console.log("player rect: ", playerRect, " treasure rect: ", treasureRect);
        if (isColliding(playerRect, treasureRect)){
            pickupTreasure(treasureDrop, index);
        }
    })
}

function restart(){
    window.location.reload();
}

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
        width: (window.innerWidth/100)*1.5,
        height: (window.innerHeight/100)*1
    };
    
    enemies.forEach((enemy, eIndex) => {
        let enemyRect = {
            x: enemy.ePosition.x,
            y: enemy.ePosition.y,
            width: enemy.width,
            height: enemy.height
        };
        if (isUnderground && enemy.className == "bossEnemy"){
            if (isColliding(bulletRect, enemyRect)) {
                destroyBullet(bullet.element);
                if (!enemy.iFrame){
                    if (enemy.className == "enemyWalker"){
                        enemy.run = true;
                        enemy.dontMove = false;
                    }
                    damageEnemy(enemy, eIndex);
                    enemy.iFrame = true;
                }
            }
        }
        if (!isUnderground &&  enemy.className != "bossEnemy"){
            if (isColliding(bulletRect, enemyRect)) {
                destroyBullet(bullet.element);
                if (!enemy.iFrame){
                    if (enemy.className == "enemyWalker"){
                        enemy.run = true;
                        enemy.dontMove = false;
                    }
                    damageEnemy(enemy, eIndex);
                    enemy.iFrame = true;
                }
            }
        }
    });
}
 
function damageEnemy(enemy, index, isKamehameha){
    let healthBarBg = document.getElementById("bossBarBg");
    if (!isUnderground){
    if (isKamehameha){
        if (enemy.health-150 <= 0){
            if (enemy.className == "enemyCrawler"){
                enemy.destroyLasers();
            }
            if (parent.contains(enemy.element)){
                parent.removeChild(enemy.element);
            }
            generateDrop(enemy.ePosition.x, enemy.ePosition.y);
            enemies.splice(index, 1);
        }else {
            enemy.health -= 150;
        }
    }else {
        if (enemy.health-playerDamage <= 0){
            if (enemy.className == "enemyCrawler"){
                enemy.destroyLasers();
            }
            parent.removeChild(enemy.element);
            generateDrop(enemy.ePosition.x, enemy.ePosition.y);
            enemies.splice(index, 1);
        }else {
            enemy.health -= playerDamage;
        }
    }
    }else {
        if (isKamehameha && enemy.className == "bossEnemy"){
            let candle1 = document.getElementById("candle1"); let candle2 = document.getElementById("candle2");
            if (enemy.health-30 <= 0){
                spawnTreasure((window.innerWidth*.555), window.innerHeight*.2);
                candle1.classList.remove("candleOn"); candle2.classList.remove("candleOn"); 
                candle1.classList.add("candleOff"); candle2.classList.add("candleOff"); 
                enemy.destroyLasers();
                enemy.destroySpikes();
                enemy.destroySkulls();
                healthBarBg.style.display = "none";
                if (parent.contains(enemy.element)){
                    parent.removeChild(enemy.element);
                    enemies.splice(index, 1);
                }
            }else {
                enemy.health -= 30;
            }
        }else if (enemy.className == "bossEnemy"){
            if (enemy.health-playerDamage <= 0){
                spawnTreasure((window.innerWidth*.555), window.innerHeight*.2);
                candle1.classList.remove("candleOn"); candle2.classList.remove("candleOn"); 
                candle1.classList.add("candleOff"); candle2.classList.add("candleOff"); 
                enemy.destroyLasers();
                enemy.destroySpikes();
                enemy.destroySkulls();
                healthBarBg.style.display = "none";
                if (parent.contains(enemy.element)){
                    parent.removeChild(enemy.element);
                    enemies.splice(index, 1);
                }
            }else {
                enemy.health -= playerDamage;
            }
        }
    }
}

function enterUnderground(){
    let underground = document.getElementById("underGround");
    let upstairs = document.getElementById("upstairs");
    isUnderground = true;
    underground.appendChild(player);
    underground.style.display = "block";
    parent = underground;
    upstairs.style.display = "none";
}

function enterUpstairs(){
    let underground = document.getElementById("underGround");
    let upstairs = document.getElementById("upstairs");
    isUnderground = false;
    upstairs.appendChild(player);
    upstairs.style.display = "block";
    parent = upstairs;
    underground.style.display = "none";
}

function doPlayerAnimation(){
    if (keysPressed.some(key => key === true)){
        player.classList.remove('idle');
        player.classList.add('walking');
        if (keysPressed[1]){
            player.style.transform = `scaleX(1)`;
            gunRight = false;
            gunLeft = true;
        }else if (keysPressed[0]){
            gunLeft = false;
            gunRight = true;
            player.style.transform = `scaleX(-1)`;
        }
    }else {
        player.classList.remove('walking');
        player.classList.add('idle');
    }
}

let alterSpeaking = false;
function spawnBoss(){
    let cutscene = document.getElementById("cutscene");
    summoningBoss = true;
    if (cutsceneOver){
        cutscene.style.display = "none";
        cutsceneOver = false;
    }
}

function showNoSkullsDialogue(){
    let chatBox = document.getElementById("chatBox");
    let dialogueBox = document.getElementById("alterDialogue");
    
    if (!alterSpeaking){
        alterSpeaking = true;
        chatBox.style.display = "block";
        chatBox.style.transform = "translateY(-75%)";
        dialogueBox.innerHTML = "Maybe one of those guys upstairs has a skull, go kill them...";
        setTimeout(function() {
            chatBox.style.transform = "translateY(100%)";
        }, 5000);
    
        setTimeout(function() {
            chatBox.style.display = "none";
            alterSpeaking = false;
        }, 5500);

    }
}

function mobileButtonReleased(key){
    switch(key){
        case "a":
        case "A":
            keysPressed[0] = false;
            velocity.x = 0;
            break;
        
        case "d":
        case "D":
            keysPressed[1] = false;
            velocity.x = 0;
            break;

        case "s":
        case "S":
            keysPressed[2] = false;
            velocity.y = 0;
            break;

        case "w":
        case "W":
            keysPressed[3] = false;
            velocity.y = 0;
            break;
    }
}

function mobileButtonPressed(key){
    switch(key){
        case "a":
        case "A":
            keysPressed[0] = true;
            velocity.x = -1;
            break;
        
        case "d":
        case "D":
            keysPressed[1] = true;
            velocity.x = 1;
            break;

        case "s":
        case "S":
            keysPressed[2] = true;
            velocity.y = 1;
            break;

        case "w":
        case "W":
            keysPressed[3] = true;
            velocity.y = -1;
            break;

        case "r":
        case "R":
            reload();
            break;

        case "e":
        case "E":
            if (canKameHameHa){
                kamehameha();
            }
            break;
        
        case "f":
        case "F":
            if (isColliding(playerRect, healingRect)){
                healWithFountain();
            }
            if (isColliding(playerRect, helicopterRect)){
                winGame();
            }
            if (isColliding(playerRect, undergroundEntranceRect)){
                enterUnderground();
            }
            if (isColliding(playerRect, alterRect) && isUnderground){
                if (ritualSkulls > 0){
                    ritualSkulls -= 1;
                    spawnBoss();
                }else{
                    showNoSkullsDialogue();
                }
            }
            if (isColliding(playerRect, ladderRect) && isUnderground){
                enterUpstairs();
            }
            break;
    }
}

//a d s w
let leftDown, rightDown, upDown;
let keysPressed = [false, false, false, false];
function handleKeyDown(event){
    switch(event.key){
        case "a":
        case "A":
            keysPressed[0] = true;
            velocity.x = -1;
            break;
        
        case "d":
        case "D":
            keysPressed[1] = true;
            velocity.x = 1;
            break;

        case "s":
        case "S":
            keysPressed[2] = true;
            velocity.y = 1;
            break;

        case "w":
        case "W":
            keysPressed[3] = true;
            velocity.y = -1;
            break;

        case "r":
        case "R":
            reload();
            break;

        case "e":
        case "E":
            if (canKameHameHa){
                kamehameha();
            }
            break;
        
        case "f":
        case "F":
            if (isColliding(playerRect, healingRect)){
                healWithFountain();
            }
            if (isColliding(playerRect, helicopterRect)){
                winGame();
            }
            if (isColliding(playerRect, undergroundEntranceRect)){
                enterUnderground();
            }
            if (isColliding(playerRect, alterRect) && isUnderground){
                if (ritualSkulls > 0){
                    ritualSkulls -= 1;
                    spawnBoss();
                }else{
                    showNoSkullsDialogue();
                }
            }
            if (isColliding(playerRect, ladderRect) && isUnderground){
                enterUpstairs();
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
                canDash = false;
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

function updatePopup(popupId, elementRect, playerRect) {
    const popup = document.getElementById(popupId);
    if (isColliding(playerRect, elementRect)) {
        popup.style.display = "block";
    } else {
        popup.style.display = "none";
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

function healWithFountain(){
    if (coins >= 5 && playerHealth < maxHealth){
        coins -= 5;
        if (playerHealth+40 > maxHealth){
            playerHealth = maxHealth;
        }else {
            playerHealth += 40;
        }
    }else {
        let fountainPopup = document.getElementById("fountainPopup");
        fountainPopup.classList.add("shake");
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
        case "A":
            keysPressed[0] = false;
            velocity.x = 0;
            break;
        
        case "d":
        case "D":
            keysPressed[1] = false;
            velocity.x = 0;
            break;

        case "s":
        case "S":
            keysPressed[2] = false;
            velocity.y = 0;
            break;

        case "w":
        case "W":
            keysPressed[3] = false;
            velocity.y = 0;
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
            rightDown = false;
            break;

        case "ArrowDown":
            break;
    }
}


let shootingInterval;

function handleTouchDown() {
    mouseLeftDown = true;
}

function handleTouchUp() {
    mouseLeftDown = false;
    
}

function handleMouseDown(event) {
    if (event.button === 0) {
        mouseLeftDown = true;
    }
}

function handleMouseUp(event) {
    if (event.button === 0) {
        mouseLeftDown = false;
        
    }
}

let enemSpeed = {
    "enemyCrawler": 3,
    "enemyWalker" : 2,
    "bossEnemy" : 3
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

function updateSkullCount(){
    const skullLabel = document.getElementById("ritualSkullCount");
    skullLabel.innerText = ritualSkulls;
}

let treasures = [];
function spawnTreasure(x,y){
    let treasureDrop = document.createElement("div");
    treasureDrop.classList.add("treasureDrop");
    parent.appendChild(treasureDrop);

    treasures.push({
        element: treasureDrop,
        position: { x: x, y: y },
        width: ((window.innerWidth*100)*2),
        height: ((window.innerHeight/100)*4)
    });
}

let ammoDrops = [];
let coinDrops = [];
let skullDrops = [];
function generateDrop(x,y){
    dropAmmo = getRandomInt(0,15);
    dropCoin = getRandomInt(0,10);
    dropSkull = getRandomInt(0,25);
    if (dropSkull <= 1){
        let skullDrop = document.createElement("div");
        skullDrop.classList.add("skullDrop");
        parent.appendChild(skullDrop);

        skullDrops.push({
            element: skullDrop,
            position: { x: x, y: y },
            width: ((window.innerWidth*100)*2),
            height: ((window.innerHeight/100)*4)
        });
    }else if (dropAmmo <= 1){
        let ammoDrop = document.createElement("div");
        ammoDrop.classList.add("ammoDrop");
        parent.appendChild(ammoDrop);

        ammoDrops.push({
            element: ammoDrop,
            position: { x: x, y: y },
            width: ((window.innerWidth*100)*2),
            height: ((window.innerHeight/100)*4)
        });
    }else if (dropCoin <= 2){
        let coinDrop = document.createElement("div");
        coinDrop.classList.add("coinDrop");
        parent.appendChild(coinDrop);

        coinDrops.push({
            element: coinDrop,
            position: {x: x, y: y},
            width: ((window.innerWidth*100)*2),
            height: ((window.innerHeight/100)*4)
        });
    }
}

function setAmmoDropPos(ammoDrop){
    ammoDrop.element.style.top = ammoDrop.position.y + 'px';
    ammoDrop.element.style.left = ammoDrop.position.x + 'px';
}

function setRitualSkullDropPos(skullDrop){
    skullDrop.element.style.top = skullDrop.position.y + 'px';
    skullDrop.element.style.left = skullDrop.position.x + 'px';
}

function setCoinDropPos(coinDrop){
    coinDrop.element.style.top = coinDrop.position.y + 'px';
    coinDrop.element.style.left = coinDrop.position.x + 'px';
}

function setTreasurePos(treasureDrop){
    treasureDrop.element.style.top = treasureDrop.position.y + 'px';
    treasureDrop.element.style.left = treasureDrop.position.x + 'px';
}

function dash() {
    let newX = position.x + (velocity.x * 200);
    let newY = position.y + (velocity.y * 200);
    updatePos(newX, newY);
    checkOutOfBounds();
}


function pickupItem(item, itemAbilityFunction, playerRect, index, underground){
    const itemRect = {
        x:item.position.x,
        y:item.position.y,
        width: (window.innerWidth/100)*2,
        height: (window.innerHeight/100)*4
    }

    if (isColliding(playerRect, itemRect)){
        if (underground && isUnderground){
            itemAbilityFunction(index);
        }else if (!underground && !isUnderground){
            itemAbilityFunction(index);
        }
    }
}

function pickupAmmo(index){
    backupAmmo += getRandomInt(15,45);
    destroyAmmoDrop(index);
}

function pickupCoin(index){
    const coinToGive = getRandomInt(1,3);
    coins += coinToGive;
    destroyCoinDrop(index);
}

function pickupTreasure(index){
    coins += 50;
    destroyTreasure(index);
}

function pickupSkull(index){
    ritualSkulls += 1;
    destroySkullDrop(index);
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function destroyAmmoDrop(index){
    parent.removeChild(ammoDrops[index].element);
    ammoDrops.splice(index, 1);
    
}

function destroyCoinDrop(index){
    parent.removeChild(coinDrops[index].element);
    coinDrops.splice(index, 1);
    
}

function destroyTreasure(treasureDrop, index){
    if (parent.contains(treasureDrop.element)){
    parent.removeChild(treasureDrop.element);
    treasures.splice(index, 1);
    }
}

function destroySkullDrop(index){
    parent.removeChild(skullDrops[index].element);
    skullDrops.splice(index, 1);
}

function playerHit(damage){
    if (!playerIFrame){
        if (playerHealth <= 0){
            dead = true;
        }else {
            playerHealth -= damage;
            playerIFrame = true;
        }
    }
}


function updateHealthBar() {
    let healthBar = document.getElementById("hpBarFg");
    let viewportWidth = window.innerWidth;
    let healthBarWidthVw = (playerHealth * 2 / viewportWidth) * 100;
    let healthBarUI = document.getElementById("coinHud");

    if (healthBarWidthVw > 14){

        healthBarUI.style.width = (healthBarWidthVw+2) + "vw";
    }else {
        healthBarUI.style.width = 16 + "vw";
    }
    healthBar.style.width = healthBarWidthVw + "vw";
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
    player.style.position = "fixed";
    velocity.x = 0;
    velocity.y = 0;
    if (!dead && !paused) {
        window.requestAnimationFrame(gameLoop);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    init();
});
