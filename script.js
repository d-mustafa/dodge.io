// DODGE.IO
const cnv = document.getElementById("canvas");
const ctx = cnv.getContext('2d');
let gameState = "startScreen";

// Keyboard
document.addEventListener("keydown", recordKeyDown)
document.addEventListener("keyup", recordKeyUp)
let keyboardMovementOn = false;
let wPressed = false;
let aPressed = false;
let sPressed = false;
let dPressed = false;
let shiftPressed = 1;
function recordKeyDown(event) {
    if (event.code == "KeyW") {
        wPressed = true;
    }
    if (event.code == "KeyA") {
        aPressed = true;
    }
    if (event.code == "KeyS") {
        sPressed = true;
    }
    if (event.code == "KeyD") {
        dPressed = true;
    }
    if (event.code == "ShiftLeft" || event.code == "ShiftRight") {
        if (keyboardMovementOn) {
            shiftPressed = 0.5;
        } else if (mouseMovementOn) {
            shiftPressed = 0.5;
        }
    }

    if (wPressed || aPressed || sPressed || dPressed) {
        keyboardMovementOn = true;
    }
}
function recordKeyUp(event) {
    if (event.code == "KeyW") {
        wPressed = false;
    }
    if (event.code == "KeyA") {
        aPressed = false;
    }
    if (event.code == "KeyS") {
        sPressed = false;
    }
    if (event.code == "KeyD") {
        dPressed = false;
    }
    if (event.code == "ShiftLeft" || event.code == "ShiftRight") {
        shiftPressed = 1;
    }

    if (!wPressed && !aPressed && !sPressed && !dPressed) {
        keyboardMovementOn = false;
    }
}

// Mouse
document.addEventListener("click", recordMouseClicked)
let mouseMovementOn = false;
let mouseOverRestartButton = false;
function recordMouseClicked() {
    if (gameState == "gameOn" || gameState == "startScreen") {
        if (mouseMovementOn) {
            mouseMovementOn = false
        } else if (!mouseMovementOn) {
            mouseMovementOn = true;
        }  
    } else if (gameState == "gameOver" && mouseOverRestartButton) {
        restartGame()
    }
}

cnv.addEventListener('mousemove', mousemoveHandler);
let mouseX;
let mouseY;
function mousemoveHandler(event) {
    let rect = cnv.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}


// Player
let player = {
    x: cnv.width/2,
    y: cnv.height/2,
    radius: 15,
    speed: 2.5,
}

// Enemies
let allEnemies = []
let numberOfEnemiesHTML = document.getElementById("number-of-enemies");
for(let i = 0; i < 10; i++) {
    allEnemies.push(createEnemy());
}
numberOfEnemiesHTML.innerHTML = allEnemies.length;

// Time
let time = 0;
let enemySpawnTime = 200;

requestAnimationFrame(draw)

function draw() {
    ctx.fillStyle = "rgb(194, 194, 194)"
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    
    if (gameState == "startScreen") {
        drawPlayer();
        drawStartScreen();

        if (keyboardMovementOn) {
            keyboardControls();
        } else {
            mouseMovement();
        }
    }
    else if (gameState == "gameOn") {
        drawPlayer();
        drawEnemies();
        spawnEnemyPeriodically();

        if (keyboardMovementOn) {
            keyboardControls();
        } else {
            mouseMovement();
        }
        
        moveEnemies();
        collisions();
    }
    else if (gameState == "gameOver") {
        drawPlayer();
        drawEnemies();
        drawGameOver();
    }

    requestAnimationFrame(draw)
}

draw()

function drawStartScreen() {
    const titleGrad = ctx.createLinearGradient(250, 50, 550, 150)
    const titleGrad2 = ctx.createLinearGradient(250, 150, 550, 50)

    let mouseOverTitle = (mouseX > 250 && mouseX < 550) && (mouseY > 50 && mouseY < 150);
    if (mouseOverTitle) {
        titleGrad.addColorStop(0, "rgb(114, 114, 114)");
        titleGrad.addColorStop(1, "rgb(255, 255, 255)");

        titleGrad2.addColorStop(0, "rgb(255, 255, 255)");
        titleGrad2.addColorStop(1, "rgb(114, 114, 114)");
    } else {
        titleGrad.addColorStop(0, "rgb(255, 255, 255)");
        titleGrad.addColorStop(1, "rgb(114, 114, 114)");

        titleGrad2.addColorStop(0, "rgb(114, 114, 114)");
        titleGrad2.addColorStop(1, "rgb(255, 255, 255)");
    }

    ctx.fillStyle = titleGrad;
    ctx.fillRect(250, 50, 300, 100)
    ctx.strokeStyle = titleGrad2;
    ctx.beginPath()
    ctx.moveTo(250, 150)
    ctx.lineTo(550, 50)
    ctx.stroke()

    // Title Text
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';

    let color1 = 'grey'
    let color2 = 'white'

    if (mouseOverTitle) color1, color2 = 'white', 'grey'
    else color1, color2 = 'grey', 'white'

    ctx.strokeText('Dodge.io', 320, 80);
    ctx.strokeStyle = color1;
    
    ctx.strokeStyle = color2;
    ctx.strokeText('Fan Game', 470, 135);

    // PLAY BUTTON //
    const playGrad = ctx.createLinearGradient(250, 500, 550, 600)
    const playGrad2 = ctx.createLinearGradient(250, 600, 550, 500)

    mouseOverPlayButton = (mouseX > 250 && mouseX < 550) && (mouseY > 500 && mouseY < 600);

    if (mouseOverPlayButton) {
        playGrad.addColorStop(0, "rgb(0, 255, 0)");
        playGrad.addColorStop(1, "rgb(255, 255, 255)");

        playGrad2.addColorStop(0, "rgb(255, 255, 255)");
        playGrad2.addColorStop(1, "rgb(0, 255, 0)");
    } else {
        playGrad.addColorStop(0, "rgb(255, 255, 255)");
        playGrad.addColorStop(1, "rgb(0, 255, 0)");

        playGrad2.addColorStop(0, "rgb(0, 255, 0)");
        playGrad2.addColorStop(1, "rgb(255, 255, 255)");
    }

    ctx.fillStyle = playGrad;
    ctx.fillRect(250, 500, 300, 100)

    ctx.strokeStyle = playGrad2;
    ctx.beginPath()
    ctx.moveTo(250, 600)
    ctx.lineTo(550, 500)
    ctx.stroke()
}

function drawPlayer() {
    // Player
    ctx.fillStyle = "rgb(255, 0, 0)"
    ctx.beginPath()
    ctx.arc(player.x, player.y, player.radius, Math.PI*2, 0)
    ctx.fill()
}

function drawEnemies() {
    // Enemies
    ctx.fillStyle = "rgb(100, 100, 100)"
    allEnemies.forEach(enemy => {
        ctx.beginPath()
        ctx.arc(enemy["x"], enemy["y"], enemy["radius"], Math.PI*2, 0)
        ctx.fill()
    })
}

function spawnEnemyPeriodically() {
    time++;
    if (allEnemies.length < 101 && time > 500) {
        if (time % enemySpawnTime == 0) {
            allEnemies.push(createEnemy());
            numberOfEnemiesHTML.innerHTML = allEnemies.length;

            if (allEnemies.length % 10 == 0) {
                enemySpawnTime -= 20;
            }
        }
    }
}

function keyboardControls() {
    player.speed = 2.5 * shiftPressed;
    let dx = 0;
    let dy = 0;

    if (wPressed) dy -= 1;
    if (sPressed) dy += 1;
    if (aPressed) dx -= 1;
    if (dPressed) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
        const scale = Math.SQRT1_2; // 1 / √2 ≈ 0.7071
        dx *= scale;
        dy *= scale;
    }

    player.x += dx * player.speed;
    player.y += dy * player.speed;

    // Doesnt allow the player to leave the map
    if (player.x - player.radius  <= 0 || player.x + player.radius  >= cnv.width) player.x -= dx * player.speed;
    if (player.y - player.radius  <= 0 || player.y + player.radius  >= cnv.height) player.y -= dy * player.speed;
}

function mouseMovement() {
    if (mouseMovementOn) {
        const dx = mouseX - player.x;
        const dy = mouseY - player.y;
        const distance = Math.hypot(dx, dy);
        player.speed = 2.5 * shiftPressed;
        if (distance > 5) {
            player.x += (dx / distance) * player.speed;
            player.y += (dy / distance) * player.speed;
        }

        // Doesnt allow the player to leave the map
        if (player.x - player.radius  <= 0 || player.x + player.radius  >= cnv.width) player.x -= (dx / distance) * player.speed;
        if (player.y - player.radius  <= 0 || player.y + player.radius  >= cnv.height) player.y -= (dy / distance) * player.speed;
    }
}

function moveEnemies() {
    allEnemies.forEach(enemy => {
        enemy["x"] += enemy["movex"]
        enemy["y"] += enemy["movey"]
        
        // Doesnt allow the enemies to leave the map
        if (enemy["x"] - enemy["radius"]  <= 0 || enemy["x"] + enemy["radius"]  >= cnv.width) enemy["movex"] *= -1
        if (enemy["y"] - enemy["radius"]  <= 0 || enemy["y"] + enemy["radius"]  >= cnv.height) enemy["movey"] *= -1
    })

}

function createEnemy() {
    let oneEnemy = {
        x: (Math.random() * (cnv.width-60))+30,
        y: (Math.random() * (cnv.height-60))+30,
        radius: (Math.random() * 10) + 10,
        speed: (Math.random() * 0.3) + 0.7,
    }


    let dx = player.x - oneEnemy.x;
    let dy = player.y - oneEnemy.y;
    let distance = Math.hypot(dx, dy);

    while(distance < 300) {
        oneEnemy.x = (Math.random() * (cnv.width-60))+30;
        oneEnemy.y = (Math.random() * (cnv.height-60))+30;

        dx = player.x - oneEnemy.x;
        dy = player.y - oneEnemy.y;
        distance = Math.hypot(dx, dy);
    }

    oneEnemy.movex = (dx / distance) * oneEnemy.speed;
    oneEnemy.movey = (dy / distance) * oneEnemy.speed;

    return oneEnemy;
}

function collisions() {
    allEnemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.hypot(dx, dy);

        if (distance < player.radius + enemy.radius) {
            gameState = "gameOver"
        }
    });
}

function drawGameOver() {
    const grad = ctx.createLinearGradient(250, 50, 550, 150)
    const grad2 = ctx.createLinearGradient(250, 150, 550, 50)

    mouseOverRestartButton = (mouseX > 250 && mouseX < 550) && (mouseY > 50 && mouseY < 150);

    if (mouseOverRestartButton) {
        grad.addColorStop(0, "rgb(255, 0, 0)");
        grad.addColorStop(1, "rgb(255, 255, 255)");

        grad2.addColorStop(0, "rgb(255, 255, 255)");
        grad2.addColorStop(1, "rgb(255, 0, 0)");
    } else {
        grad.addColorStop(0, "rgb(255, 255, 255)");
        grad.addColorStop(1, "rgb(255, 0, 0)");

        grad2.addColorStop(0, "rgb(255, 0, 0)");
        grad2.addColorStop(1, "rgb(255, 255, 255)");
    }

    ctx.fillStyle = grad;
    ctx.fillRect(250, 50, 300, 100)

    ctx.strokeStyle = grad2;
    ctx.beginPath()
    ctx.moveTo(250, 150)
    ctx.lineTo(550, 50)
    ctx.stroke()


    // Text
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';

    let gameOverColor = 'red'
    let tryAgainColor = 'white'
    if (mouseOverRestartButton) {
        gameOverColor = 'white'
        tryAgainColor = 'red'
    }
    else {
        gameOverColor = 'red'
        tryAgainColor = 'white'
    }
    
    ctx.strokeText('Game Over', 335, 80);
    ctx.strokeStyle = gameOverColor;

    ctx.strokeStyle = tryAgainColor;
    ctx.strokeText('Try Again', 480, 135);
}

function restartGame() {
    player = {
        x: cnv.width/2,
        y: cnv.height/2,
        radius: 15,
        speed: 2.5,
    }
    mouseMovementOn = false;

    allEnemies = []
    for(let i = 0; i < 10; i++) {
        allEnemies.push(createEnemy());
    }
    numberOfEnemiesHTML.innerHTML = allEnemies.length;

    time = 0;
    gameState = "gameOn";
}
