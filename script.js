// DODGE.IO
console.log("settings and thumbnail");
const cnv = document.getElementById("canvas");
const ctx = cnv.getContext('2d');

let gameState = "loading";
let innerGameState = "mainMenu";
let lastPressing = "kb";

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
document.addEventListener("click", recordLeftClick);
document.addEventListener("contextmenu", recordRightClick);

let mouseMovementOn = false;
let mouseOver = {
    play: false,
    settings: false,
    selector: false,
    restart: false,

    weaver: false,
    jsab: false,
    jötunn: false,
    jolt: false,

    easy: false,
    medium: false,
    hard: false,
    enemyOutBtn: false,
    disableMMBtn: false,
};

let mouseX;
let mouseY;
window.addEventListener('mousemove', (event) => {
    const rect = cnv.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// Player & Enemies
let player = {
    x: cnv.width/2,
    y: cnv.height/2,
    radius: 15,
    speed: 2.5,
    slowed: 1,
    dodger: "weaver",
    color: "rgb(255, 255, 255)",
    subColor: "rgb(230, 230, 230)",
};

let dash = {
    usable: true,
    activated: false,
    deccelerating: false,
    speed: 0.5,
    cooldown: 1100,
    lastUsed: 0,
};

let minimize = {
    usable: true,
    activated: false,
    cooldown: 1100,
    lastUsed: 0,
}

let settings = {
    enemyOutlines: false,
    disableMM: false,
};

let allEnemies = [];

// Time, Highscore, and Difficulty
let now = Date.now();

let loadingGame = Date.now();
let loadingTextChange = Date.now();
let LI = 0; // loading index
let skipLoading = false;

let startTime = Date.now();
let currentTime = ((now-startTime) / 1000).toFixed(2);

let enemySpawnPeriod = 3000;
let lastSpawn = Date.now();

let highscoreColor = "rgb(87, 87, 87)";
let highscore = {
    easy: 0,
    medium: 0,
    hard: 0,
};
let difficulty = {
    level: "easy",
    color: "rgb(0, 225, 255)",
};

// USER DATA
let lastSave = 0; // tracks how often data is saved (during gameplay)
const localData = localStorage.getItem('localUserData'); // load savedData (if it exists)
let userData;
let resetLocalData = false;

if (localData) {
    // retrieves the users local data and watches for corrupted data
    try {
        userData = JSON.parse(localData);
        // updates the player and highscore to the users local data
        player.dodger = userData.player.dodger;
        player.color = userData.player.color;
        player.subColor = userData.player.subColor;
        highscore = userData.highscore;
        settings = userData.settings;
    } catch (exception) {
        console.warn('Local user data was invalid, resetting.', exception);
        localStorage.removeItem('localUserData');
        resetLocalData = true;
    }
}

if (resetLocalData || !localData){
    // creates a new userData for new users
    userData = {
        highscore: highscore,
        player: player,
        settings: settings,
    };
    
    // saves the new user data to local storage
    localStorage.setItem('localUserData', JSON.stringify(userData));
}

// Crash data to track when the user leaves/crashes
const localCrashData = localStorage.getItem('localCrashData');
let crashData;
let resetCrashData = false;

if (localCrashData) {
    try {
        crashData = JSON.parse(localCrashData);
    } catch (exception) {
        console.warn('Crash data was invalid, resetting.', exception);
        localStorage.removeItem('localCrashData');
        resetCrashData = true;
    }
}
if (!localCrashData || resetCrashData) {
    crashData = {
        leaveOnLoading: 0,
        leaveOnMenu: 0,
        leaveOnPlay: 0,
        leaveUnknown: 0,
        lastLeftOn: "",
    };
    localStorage.setItem('localCrashData', JSON.stringify(crashData));
}

// saves the game if the website is closed
window.addEventListener('beforeunload', () => {
    if (gameState !== "loading") { // only save user data if they're not on the loading screen
        localStorage.setItem('localUserData', JSON.stringify(userData));
    }
    
    if (gameState === "loading") crashData.leaveOnLoading++;

    else if (gameState === "startScreen") crashData.leaveOnMenu++;

    else if (gameState === "gameOn" || gameState === "gameOver") crashData.leaveOnPlay++;

    else crashData.leaveUnknown++;
    
    crashData.lastLeftOn = gameState;
        
    localStorage.setItem('localCrashData', JSON.stringify(crashData));
})


// Drawing the game
requestAnimationFrame(draw)

function draw() {
    now = Date.now()
    ctx.fillStyle = "rgb(185, 185, 185)"
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    // Loading Screen
    if (now - loadingGame <= 5000 && !skipLoading) { // Takes 5 seconds to load the game safely
        options = ["Loading.", "Loading..", "Loading..."];
        if (now - loadingTextChange >= 1000) { // change the text every second
            loadingTextChange = Date.now();
            LI++;
            if (LI > 2) LI = 0;
        }
        
        ctx.fillStyle = "rgb(87, 87, 87)";
        ctx.font = "40px 'Verdana'";
        ctx.textAlign = "center";
        ctx.fillText(options[LI], cnv.width/2, cnv.height/2);

        ctx.font = "30px 'Verdana'";
        ctx.fillText(`${now - loadingGame}/5000`, cnv.width/2, cnv.height/2 + 50);

        if (now - loadingGame >= 1000) {
            ctx.font = "20px 'Verdana'";
            ctx.textAlign = "left";
            ctx.fillText("click anywhere on the screen to skip", 20, cnv.height - 20);
        }
    }
    else if ((now - loadingGame > 5000 || skipLoading) && gameState == "loading") gameState = "startScreen";

    // Actual Game
    if (gameState == "startScreen") {
        abilities();
        drawText();
            
        drawStartScreen();

        if (innerGameState == "settings") drawSettings();
        else if (innerGameState == "selectDifficulty") drawDifficultySelection();
        else if (innerGameState == "selectDodger") drawDodgerSelection();

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
