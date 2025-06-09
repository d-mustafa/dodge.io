// DODGE.IO
console.log("periodic data saving");
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
    easy: false,
    medium: false,
    hard: false,
};

let mouseX;
let mouseY;
// Tracks the mouse's coordinates throughout the entire window
window.addEventListener('mousemove', (event) => {
    const rect = cnv.getBoundingClientRect();
    mouseX = event.pageX - rect.left;
    mouseY = event.pageY - rect.top;
});

// Player & Enemies
let player = {
    x: cnv.width/2,
    y: cnv.height/2,
    radius: 15,
    speed: 2.5,
    slowed: 1,
    color: "rgb(255, 255, 255)",
    subColor: "rgb(230, 230, 230)",
    dodger: "weaver",
};
let allEnemies = [];

// Time
let now = Date.now();
let startTime = Date.now();
let currentTime = ((now-startTime) / 1000).toFixed(2);
let enemySpawnPeriod = 3000;
let lastSpawn = Date.now();
let highscore =  {
    easy: 0,
    medium: 0,
    hard: 0,
};
let highscoreColor = "rgb(87, 87, 87)";

// Abilities
let dash = {
    usable: true,
    activated: false,
    deccelerating: false,
    speed: 0.5,
    cooldown: 1100, // cooldowns are in milliseconds
    lastUsed: 0,
};


// USER DATA
let nextSave = 0; // tracks how often data is saved (during gameplay)
const localData = localStorage.getItem('localUserData'); // load savedData (if it exists)
let userData;
let reset = false;

if (localData) {
    // retrieves the users local data and watches for corrupted data
    try {
        userData = JSON.parse(saveData);
    } catch (exception) {
        console.warn('Saved data was invalid, resetting.', exception);
        localStorage.removeItem('localUserData');
        reset = true;
        break;
    }
    
    // updates the player and highscore to the users local data
    player = userData.player
    highscore = userData.highscore
}

if (reset || !localData){
    // creates a new userData for new users
    userData = {
        highscore: highscore,
        player: player,
    };
    
    // saves the new user data to local storage
    localStorage.setItem('localUserData', JSON.stringify(userData));
}


requestAnimationFrame(draw)

function draw() {
    now = Date.now()
    ctx.fillStyle = "rgb(185, 185, 185)"
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    
    if (gameState == "startScreen") {
        abilities();
        drawText();
        
        drawStartScreen();
        drawPlayer();
        
        keyboardControls();
        mouseMovement();
    }
    else if (gameState == "selectDifficulty") {
        abilities();
        drawText();

        drawStartScreen();
        drawDifficultySelection();
        drawPlayer();
        
        keyboardControls();
        mouseMovement();
    }
    else if (gameState == "selectDodger") {
        abilities();
        drawText();

        drawStartScreen();
        drawDodgerSelection();
        drawPlayer();
        
        keyboardControls();
        mouseMovement();
    }
    else if (gameState == "gameOn") {
        drawText();

        drawEnemies();
        drawPlayer();
        
        keyboardControls();
        mouseMovement();
        
        spawnEnemyPeriodically();
        moveEnemies();
        abilities();
        
        collisions();
    }
    else if (gameState == "gameOver") {
        drawText();
        
        drawGameOver();
        drawEnemies();
        drawPlayer();
    }

    requestAnimationFrame(draw)
}

draw()
