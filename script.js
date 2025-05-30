// DODGE.IO
console.log("fixing dash-distance")
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

// Mouse
document.addEventListener("click", recordMouseClicked)
let mouseMovementOn = false;
let mouseOverRestartButton = false;
let mouseOverPlayButton = false;

cnv.addEventListener('mousemove', mousemoveHandler);
let mouseX;
let mouseY;
function mousemoveHandler(event) {
    let rect = cnv.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

// Player & Enemies
let player = {
    x: cnv.width/2,
    y: cnv.height/2,
    radius: 15,
    speed: 2.5,
    color: "rgb(255, 0, 0)",
}
let allEnemies = []

// Time
let now = Date.now()
let time = 0;
let score = 0;
let highscore = 0;
let highscoreColor = "rgb(87, 87, 87)";
let enemySpawnTime = 200;

// Abilities
let dash = {
    usable: true,
    activated: false,
    deccelerating: false,
    speed: 0.5,
    cooldown: 1100, // cooldowns are in milliseconds
    lastUsed: 0,
}

requestAnimationFrame(draw)

function draw() {
    ctx.fillStyle = "rgb(194, 194, 194)"
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    
    if (gameState == "startScreen") {
        abilities();
        
        drawStartScreen();
        drawPlayer();

        keyboardControls();
        mouseMovement();
    }
    else if (gameState == "pickPlayer") {
        abilities();
        
        drawPlayer()
        mouseMovement();
    }
    else if (gameState == "gameOn") {
        abilities();
        
        drawScore();
        drawPlayer();
        
        drawEnemies();
        spawnEnemyPeriodically();

        keyboardControls();
        mouseMovement();
        
        moveEnemies();
        collisions();
    }
    else if (gameState == "gameOver") {
        drawGameOver();
        drawPlayer();
        drawEnemies();
    }

    requestAnimationFrame(draw)
}

draw()
