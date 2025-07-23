// DODGE.IO - SCRIPT.JS
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
document.addEventListener("touchstart", recordLeftClick);
document.addEventListener("contextmenu", recordRightClick);
let mouseMovementOn = false;
let mouseOver = {
    play: false,
    settings: false,
    selector: false,
    restart: false,

    evader: false,
    jsab: false,
    jötunn: false,
    jolt: false,

    easy: false,
    medium: false,
    hard: false,
    alarmNine: false,

    enemyOutBtn: false,
    disableMMBtn: false,
};

let mouseX;
let mouseY;
let track = false;
window.addEventListener('mousemove', (event) => {
    const rect = cnv.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

    if (track) console.log(`x: ${mouseX} || y: ${mouseY}`);
});

// Player & Enemies
let player = {
    x: cnv.width/2,
    y: cnv.height/2,
    radius: 15,
    speed: 2.5,
    slowed: 1,
    dodger: "evader",
    color: "rgb(255, 255, 255)",
    subColor: "rgb(230, 230, 230)",
    facingAngle: 0,
};

let dash = {
    usable: true,
    activated: false,
    lastEnded: 0,
    deccelerating: false,
    speed: 0.5,
};

let shockwave = {
    usable: true,
    activated: false,
    lastEnded: 0,
    radius: 25,
}

let settings = {
    enemyOutlines: true,
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

// Music
alarmNine = document.createElement("audio");
alarmNine.src = "Music/Alarm 9.mp3";
alarmNine.preload = "none";
let alarmNinePromise;

// User Data
let lastSave = 0; // tracks how often data is saved (during gameplay)
const localData = localStorage.getItem('localUserData'); // load savedData (if it exists)
let userData;
let resetLocalData = false;

if (localData) {
    // retrieves the users local data and watches for corrupted data
    try {
        userData = JSON.parse(localData);

        // checks to see if the userData is missing any elements and replaces it with default data
        ["player", "highscore", "settings"].forEach(data => {
            if (!(data in userData)) userData[data] = eval(data);
        }); 

        // updates the current data to the locally saved data
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
    userData = { player: player, highscore: highscore, settings: settings, };
    
    // saves the new user data to local storage
    localStorage.setItem('localUserData', JSON.stringify(userData));
}

// Crash data to track when the user leaves/crashes
const localCrashData = localStorage.getItem('localCrashData');
let crashData;
let resetCrashData = false;

if (localCrashData) {
    try { crashData = JSON.parse(localCrashData); }
    catch (exception) {
        console.warn('Crash data was invalid, resetting.', exception);
        localStorage.removeItem('localCrashData');
        resetCrashData = true;
    }
}
if (!localCrashData || resetCrashData) {
    crashData = { leaveOnLoading: 0, leaveOnMenu: 0, leaveOnPlay: 0, leaveUnknown: 0, lastLeftOn: "", };
    localStorage.setItem('localCrashData', JSON.stringify(crashData));
}

// saves the game if the website is closed
window.addEventListener('beforeunload', () => {
    if (gameState !== "loading") { // only save user data if they're not on the loading screen
        userData = { player: player, highscore: highscore, settings: settings, };
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
    ctx.fillStyle = "rgb(185, 185, 185)";
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
    else if ((now - loadingGame > 5000 || skipLoading) && gameState === "loading") gameState = "startScreen";

    // Actual Game
    if (gameState === "startScreen") {
        abilities();
        drawText();
        drawStartScreen();
        
        if (innerGameState === "selectDifficulty") drawDifficultySelection();
        if (innerGameState === "selectDodger") drawDodgerSelection();
        drawPlayer();
        drawSettings();
        
        keyboardControls();
        mouseMovement();
    }
    else if (gameState === "gameOn") {
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
    else if (gameState === "gameOver") {
        drawText();
        drawGameOver();
        drawEnemies();
        drawPlayer();
    }
    else if (gameState === "musicOn") {
        drawText();
        drawPlayer();
        
        keyboardControls();
        mouseMovement();

        abilities();
        musicCollisions();
    }
    requestAnimationFrame(draw)
}

draw()
