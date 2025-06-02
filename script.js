// DODGE.IO
console.log("fuckin... background color changes... and shi")
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
let mouseOver = {
    play: false,
    selector: false,
    restart: false,
    weave: false,
    jsab: false,
    jötunn: false,
}

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
    color: "rgb(255, 255, 255)",
    subColor: "rgb(230, 230, 230)",
    dodger: "weaver",
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
    else if (gameState == "selectDodger") {
        abilities();

        drawStartScreen();
        drawDodgerSelection();
        drawPlayer();
        
        keyboardControls();
        mouseMovement();
    }
    else if (gameState == "gameOn") {
        abilities();
        
        drawScore();
        drawPlayer();
        
        keyboardControls();
        mouseMovement();
        
        drawEnemies();
        spawnEnemyPeriodically();
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
