console.log("range and volume")// DODGE.IO - FUNCTIONS.JS
// KEYBAORD AND MOUSE EVENTS (player inputs)
function recordKeyDown(event) {
    // stops the page from scrolling when arrow keys are pressed
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.code) > -1) {
        event.preventDefault();
    }

    // Loading Screen
    if (now - loadingGame >= 1000 && gameState == "loading") {
        skipLoading = true;
        return;
    }
    else if (now - loadingGame <= 5000 && gameState == "loading") return;
    
    // Keyboard Inputs (WASD & Shift)
    if (event.code === "KeyW" || event.code === "ArrowUp") wPressed = true;
    if (event.code === "KeyA" || event.code === "ArrowLeft") aPressed = true;
    if (event.code === "KeyS" || event.code === "ArrowDown") sPressed = true;
    if (event.code === "KeyD" || event.code === "ArrowRight") dPressed = true;
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") shiftPressed = 0.7;
    if (wPressed || aPressed || sPressed || dPressed) keyboardMovementOn = true;

    // Ability controls
    if ((event.code === "KeyQ" || event.code === "KeyJ") && gameState !== "gameOver") {
        if (player.dodger === "jsab" && dash.usable && !dash.activated) dash.activated = true;
            
        else if (player.dodger === "jolt" && shockwave.usable && !shockwave.activated) {
            // activate the shockwave ability and set certain properties
            shockwave.activated = true;
            shockwave.facingAngle = player.facingAngle;
            shockwave.x = player.x;
            shockwave.y = player.y;

            if (lastPressing === "mouse") {
                // distance between the beam and cursor
                shockwave.dx = mouseX - shockwave.x;
                shockwave.dy = mouseY - shockwave.y;
                shockwave.dist = Math.hypot(shockwave.dx, shockwave.dy)
                
                shockwave.movex = (shockwave.dx/shockwave.dist) * 7;
                shockwave.movey = (shockwave.dy/shockwave.dist) * 7;
            }
            if (lastPressing === "kb") {
                shockwave.movex = Math.cos(shockwave.facingAngle) * 7;
                shockwave.movey = Math.sin(shockwave.facingAngle) * 7;
            }
        }
    }
}

function recordKeyUp(event) {
    // Loading Screen
    if (now - loadingGame >= 1000 && gameState == "loading") {
        skipLoading = true;
        return;
    }
    else if (now - loadingGame <= 5000 && gameState == "loading") return;

    // Keyboard Inputs
    if (event.code === "KeyW" || event.code === "ArrowUp") wPressed = false;
    if (event.code === "KeyA" || event.code === "ArrowLeft") aPressed = false;
    if (event.code === "KeyS" || event.code === "ArrowDown") sPressed = false;
    if (event.code === "KeyD" || event.code === "ArrowRight") dPressed = false;
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") shiftPressed = 1;
    if (!wPressed && !aPressed && !sPressed && !dPressed) keyboardMovementOn = false;
}

function recordLeftClick() {
    // Loading Screen
    if (now - loadingGame >= 1000 && gameState == "loading") {
        skipLoading = true;
        return;
    }
    else if (now - loadingGame <= 5000 && gameState == "loading") return;

    // Variable to keep mouse movement the way it previously was if a button was pressed
    previousMM = false;
    
    // Mouse Movement
    if (mouseMovementOn && !settings.disableMM) {
        mouseMovementOn = false;
        previousMM = true;
    } else if (!mouseMovementOn && !settings.disableMM) {
        mouseMovementOn = true;
        previousMM = false;
    }
    
    // Start screen buttons
    if (innerGameState === "mainMenu") {
        if (mouseOver.play) innerGameState = "selectDifficulty";
        else if (mouseOver.settings) innerGameState = "settings";
        else if (mouseOver.selector) innerGameState = "selectDodger";

        if (mouseOver.play || mouseOver.settings || mouseOver.selector) mouseMovementOn = previousMM;
    }
    // Buttons that redirect back to the start screen
    else if (gameState === "gameOver" && mouseOver.restart ||
            innerGameState === "settings" && mouseOver.settings ||
            innerGameState === "selectDodger" && mouseOver.selector ||
            innerGameState === "selectDifficulty" && mouseOver.play) {

        if (innerGameState === "settings") {
            // Saves the users settings options
            userData.settings = settings;
            localStorage.setItem('localUserData', JSON.stringify(userData));
        }
        gameState = "startScreen";
        innerGameState = "mainMenu";
        mouseMovementOn = previousMM;
    }

    // Settings
    else if (innerGameState === "settings") {
        if (mouseOver.enemyOutBtn || mouseOver.disableMMBtn || mouseOver.volumeSlider) {
            if (mouseOver.enemyOutBtn) {
                if (settings.enemyOutlines) settings.enemyOutlines = false;
                else if (!settings.enemyOutlines) settings.enemyOutlines = true;
            }
            if (mouseOver.disableMMBtn) {
                if (settings.disableMM) settings.disableMM = false;
                else if (!settings.disableMM) {
                    settings.disableMM = true;
                    mouseMovementOn = false;
                }
            }

            // Saves the users settings options
            userData.settings = settings;
            localStorage.setItem('localUserData', JSON.stringify(userData));

            if (!settings.disableMM) mouseMovementOn = previousMM;
        }
    }

    // Difficulty Choice
    else if (innerGameState === "selectDifficulty") {
        ["easy", "medium", "hard"].forEach(level => {
            if (mouseOver[level]) {
                if (mouseOver.easy) difficulty = {level: "easy", color: "rgb(0, 225, 255)"};
                if (mouseOver.medium) difficulty = {level: "medium", color: "rgb(255, 255, 0)"};
                if (mouseOver.hard) difficulty = {level: "hard", color: "rgb(0, 0, 0)"};
                innerGameState = 'inEndless';
                mouseMovementOn = previousMM;
                restartEndless();
            }
        })

            
        if (mouseOver.alarm9) console.log("exists");
        else console.log("doesn't exist");
        
        ["alarm9"].forEach(level => {
            if (mouseOver[level]) {
                if (mouseOver.alarm9) {
                    music = {name: "Alarm 9", artist: "Blue Cxve", duration: alarm9.duration, color: "rgb(163, 0, 163)"}
                }
                innerGameState = 'inMusicMode';
                mouseMovementOn = previousMM;
                restartMusicMode();
            }
        })
    }
    
    // Hero Choice
    else if (innerGameState === "selectDodger") {
        if (mouseOver.evader || mouseOver.jsab || mouseOver.jötunn || mouseOver.jolt) {
            if (mouseOver.evader) {
                player.dodger = "evader";
                player.color = "rgb(255, 255, 255)";
                player.subColor = "rgb(230, 230, 230)";
            }
            else if (mouseOver.jsab) {
                player.dodger = "jsab";
                player.color = "rgb(255, 0, 0)";
                player.subColor = "rgb(230, 0, 0)";
            }
            else if (mouseOver.jötunn) {
                player.dodger = "jötunn";
                player.color = "rgb(79, 203, 255)";
                player.subColor = "rgb(70, 186, 235)";
            }
            else if (mouseOver.jolt) {
                player.dodger = "jolt";
                player.color = "rgb(255, 255, 0)";
                player.subColor = "rgb(230, 230, 0)";
            }

            mouseMovementOn = previousMM;
            // saves the players values to the local storage to keep track of the players dodger
            userData.player = player;
            localStorage.setItem('localUserData', JSON.stringify(userData));
        }
    }
}

function recordRightClick(event) {
    event.preventDefault();

    // Loading Screen
    if (now - loadingGame >= 1000 && gameState == "loading") {
        skipLoading = true;
        return;
    }
    else if (now - loadingGame <= 5000 && gameState == "loading") return;

    // Ability Activations
    if (gameState !== "gameOver") {
        if (player.dodger === "jsab" && dash.usable && !dash.activated) dash.activated = true;
        else if (player.dodger === "jolt" && shockwave.usable && !shockwave.activated) {
            shockwave.activated = true;
            shockwave.facingAngle = player.facingAngle;
            shockwave.x = player.x;
            shockwave.y = player.y;
            
            if (lastPressing === "mouse") {
                shockwave.dx = mouseX - player.x;
                shockwave.dy = mouseY - player.y;
                shockwave.dist = Math.hypot(shockwave.dx, shockwave.dy)
                
                shockwave.movex = (shockwave.dx/shockwave.dist) * 7;
                shockwave.movey = (shockwave.dy/shockwave.dist) * 7;
            }
            if (lastPressing === "kb") {
                shockwave.movex = Math.cos(shockwave.facingAngle) * 7;
                shockwave.movey = Math.sin(shockwave.facingAngle) * 7;
            }
        }
    }
}

// FUNCTIONS THAT DRAWS STUFF TO THE SCREEN
function drawCircle(x, y, r = 12.5) {
    ctx.beginPath()
    ctx.arc(x, y, r, Math.PI * 2, 0)
    ctx.fill()
}

function drawStartScreen() {
    if (innerGameState === "mainMenu" || innerGameState === "selectDifficulty") {
        // PLAY BUTTON //
        const playBtn = {
            x: 250,
            y: 50,
            w: 300,
            h: 100,
        }
        playBtn.xw = playBtn.x + playBtn.w
        playBtn.yh = playBtn.y + playBtn.h
        mouseOver.play = (mouseX > playBtn.x && mouseX < playBtn.xw) && (mouseY > playBtn.y && mouseY < playBtn.yh)
        const playGrad = ctx.createLinearGradient(playBtn.x, playBtn.y, playBtn.xw, playBtn.yh)
        const playGrad2 = ctx.createLinearGradient(playBtn.x, playBtn.yh, playBtn.xw, playBtn.y)
        
        if (mouseOver.play) {
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
        ctx.fillRect(playBtn.x, playBtn.y, playBtn.w, playBtn.h)
        ctx.strokeStyle = playGrad2;
        ctx.beginPath()
        ctx.moveTo(playBtn.x, playBtn.yh)
        ctx.lineTo(playBtn.xw, playBtn.y)
        ctx.stroke()

        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        let greenBtnColors = ['lime', 'white'];

        if (mouseOver.play) greenBtnColors = ['white', 'lime'];
        else greenBtnColors = ['lime', 'white'];
        
        // swaps between 2 types of buttons for going in and out of the difficulty selection screen
        if (innerGameState === "mainMenu") {
            ctx.strokeStyle = greenBtnColors[0];
            ctx.strokeText('Start', playBtn.x + 70, playBtn.y + 30);
        
            ctx.strokeStyle = greenBtnColors[1];
            ctx.strokeText('Playing', playBtn.x + 220, playBtn.y + 85);
        } else if (innerGameState === "selectDifficulty") {
            ctx.strokeStyle = greenBtnColors[0];
            ctx.strokeText('Back To', playBtn.x + 70, playBtn.y + 30);
        
            ctx.strokeStyle = greenBtnColors[1];
            ctx.strokeText('Main Menu', playBtn.x + 220, playBtn.y + 85);
        }
    }
    if (innerGameState === "mainMenu" || innerGameState === "selectDodger") {
        // DODGER SLECTOR BUTTON //
        const selectorBtn = {
            x: 250,
            y: 475,
            w: 300,
            h: 100,
        }
        selectorBtn.xw = selectorBtn.x + selectorBtn.w
        selectorBtn.yh = selectorBtn.y + selectorBtn.h
        mouseOver.selector = (mouseX > selectorBtn.x && mouseX < selectorBtn.xw) && (mouseY > selectorBtn.y && mouseY < selectorBtn.yh);
        const selectorGrad = ctx.createLinearGradient(selectorBtn.x, selectorBtn.y, selectorBtn.xw, selectorBtn.yh)
        const selectorGrad2 = ctx.createLinearGradient(selectorBtn.x, selectorBtn.yh, selectorBtn.xw, selectorBtn.y)
        
        if (mouseOver.selector) {
            selectorGrad.addColorStop(0, "rgb(114, 114, 114)");
            selectorGrad.addColorStop(1, "rgb(255, 255, 255)");

            selectorGrad2.addColorStop(0, "rgb(255, 255, 255)");
            selectorGrad2.addColorStop(1, "rgb(114, 114, 114)");
        } else {
            selectorGrad.addColorStop(0, "rgb(255, 255, 255)");
            selectorGrad.addColorStop(1, "rgb(114, 114, 114)");

            selectorGrad2.addColorStop(0, "rgb(114, 114, 114)");
            selectorGrad2.addColorStop(1, "rgb(255, 255, 255)");
        }

        ctx.fillStyle = selectorGrad;
        ctx.fillRect(selectorBtn.x, selectorBtn.y, selectorBtn.w, selectorBtn.h)
        ctx.strokeStyle = selectorGrad2;
        ctx.beginPath()
        ctx.moveTo(selectorBtn.x, selectorBtn.yh)
        ctx.lineTo(selectorBtn.xw, selectorBtn.y)
        ctx.stroke()

        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        let greyBtnColors = ['grey', 'white'];

        if (mouseOver.selector) greyBtnColors = ['white', 'grey'];
        else greyBtnColors = ['grey', 'white'];

        // swaps between 2 types of buttons for going in and out of the dodger selection screen
        if (innerGameState === "mainMenu") {
            ctx.strokeStyle = greyBtnColors[0];
            ctx.strokeText('Dodger', selectorBtn.x + 70, selectorBtn.y + 30);
        
            ctx.strokeStyle = greyBtnColors[1];
            ctx.strokeText('Selector', selectorBtn.x + 220, selectorBtn.y + 85);
        } else if (innerGameState === "selectDodger") {
            ctx.strokeStyle = greyBtnColors[0];
            ctx.strokeText('Back To', selectorBtn.x + 70, selectorBtn.y + 30);
        
            ctx.strokeStyle = greyBtnColors[1];
            ctx.strokeText('Main Menu', selectorBtn.x + 220, selectorBtn.y + 85);
        }
    }
}

function drawSettings() {
    const gear = { x: 750, y: 600, };
    const distGear = Math.hypot(gear.x+20 - mouseX, gear.y+20 - mouseY); // (770, 620) is the center of the gear
    mouseOver.settings = distGear < 30;

    if (innerGameState === "mainMenu") ctx.drawImage(document.getElementById("gear-filled"), gear.x, gear.y, 40, 40);
    else if (innerGameState === "settings") {
        ctx.drawImage(document.getElementById("gear-unfilled"), gear.x, gear.y, 40, 40);
        
        ctx.font = "bold 15px Arial";
        ctx.textAlign = "left";
        
        // Enemy Outlines Button
        mouseOver.enemyOutBtn = (mouseX > 170 && mouseX < 190 && mouseY > 35 && mouseY < 55);
        if (settings.enemyOutlines) ctx.fillStyle = "lime";
        else ctx.fillStyle = "red";
        ctx.fillRect(170, 35, 20, 20);

        ctx.fillStyle = "black";
        ctx.fillText("Enemy Outlines", 50, 50);
    
        // Disable Mouse Movement Button
        mouseOver.disableMMBtn = (mouseX > 317.5 && mouseX < 337.5 && mouseY > 85 && mouseY < 105);
        if (settings.disableMM) ctx.fillStyle = "lime";
        else ctx.fillStyle = "red";
        ctx.fillRect(317.5, 85, 20, 20);

        ctx.fillStyle = "black";
        ctx.fillText("Disable Mouse Movement Activation", 50, 100);

        // Music Volume Slider
        const distVolumeSlider = Math.hypot(settings.volumeSliderX - mouseX, 145 - mouseY);
        mouseOver.volumeSlider = distVolumeSlider < 20;
        if (mouseDown && mouseOver.volumeSlider) {
            if (mouseX <= 315 && mouseX >= 165) settings.volumeSliderX = mouseX;
            if (mouseX >= 315) settings.volumeSliderX = 315;
            if (mouseX <= 165) settings.volumeSliderX = 165;
        }

        // outline
        ctx.strokestyle = "white";
        ctx.linewidth = 2;
        ctx.beginPath();
        ctx.roundRect(165, 140, 150, 10, 5);
        ctx.stroke();

        // fill
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.roundRect(165, 140, settings.volumeSliderX - 165, 10, 5);
        ctx.fill();

        drawCircle(settings.volumeSliderX, 145, 10);

        ctx.fillStyle = "black";
        ctx.fillText("Music Volume", 50, 150);

        ctx.font = "15px Arial";
        ctx.fillStyle = "white";
        volume = Math.floor((settings.volumeSliderX - 160)/1.5);
        ctx.fillText(`${volume}`, 345, 150);
    }
}

function drawDifficultySelection() {
    // BackGrounds
    function decideFillStyle(bool, lightColor, darkColor) {
        if (bool) {
            ctx.fillStyle = lightColor;
        } else {
            ctx.fillStyle = darkColor;
        }
    }

    mouseOver.easy = (mouseX > 50 && mouseX < 250) && (mouseY > 250 && mouseY < 350);
    decideFillStyle(mouseOver.easy, "rgb(0, 191, 216)", "rgb(0, 171, 194)");
    ctx.fillRect(50, 250, 200, 100);

    mouseOver.medium = (mouseX > 300 && mouseX < 500) && (mouseY > 250 && mouseY < 350);
    decideFillStyle(mouseOver.medium, "rgb(220, 220, 0)", "rgb(200, 200, 0)");
    ctx.fillRect(300, 250, 200, 100);

    mouseOver.hard = (mouseX > 550 && mouseX < 750) && (mouseY > 250 && mouseY < 350);
    decideFillStyle(mouseOver.hard, "rgb(60, 60, 60)", "rgb(40, 40, 40)");
    ctx.fillRect(550, 250, 200, 100);

    mouseOver.alarm9 = (mouseX > 50 && mouseX < 250) && (mouseY > 450 && mouseY < 550);
    decideFillStyle(mouseOver.alarm9, "rgb(128, 0, 128)", "rgb(100, 0, 100)");
    ctx.fillRect(50, 450, 200, 100);
    
    // Text
    function drawDifficultyText(color, difficultyName, description, x, y) {
        ctx.fillStyle = color;
        ctx.font = "25px 'Lucida Console'";
        ctx.fillText(difficultyName, x, y);
        ctx.font = "14px 'Lucida Console'";
        ctx.fillText(description, x, y + 50);
    }
    
    // titles
    ctx.textAlign = "center";
    ctx.fillStyle = "grey";
    
    ctx.font = "30px Arial";
    ctx.fillText("ENDLESS", cnv.width/2, 220);
    
    ctx.font = "30px Arial";
    ctx.fillText("MUSIC", cnv.width/2, 420);

    // levels
    ctx.textAlign = "left";
    
    drawDifficultyText("rgb(0, 225, 255)", "EASY", "Normal Enemies", 60, 280);
    drawDifficultyText("rgb(255, 255, 0)", "MEDIUM", "+Decelerating Enemies", 310, 280);
    drawDifficultyText("rgb(0, 0, 0)", "HARD", "+Homing Enemies", 560, 280);
    
    drawDifficultyText("rgb(163, 0, 163)", "ALARM 9", "By Blue Cxve", 60, 480);
}

function drawDodgerSelection() {
    // Inner function to make life easier
    function decideFillStyle(bool, color1, color2) {
        if (bool) {
            ctx.fillStyle = color1;
        } else {
            ctx.fillStyle = color2;
        }
    }

    // Coordinates
    const evader = { x: 50, y: 50, };
    mouseOver.evader = (mouseX > evader.x && mouseX < evader.x + 200) && (mouseY > evader.y && mouseY < evader.y + 100);

    const jsab = { x: 300, y: 50, };
    mouseOver.jsab = (mouseX > jsab.x && mouseX < jsab.x + 200) && (mouseY > jsab.y && mouseY < jsab.y + 100);

    const jötunn = { x: 550, y: 50, };
    mouseOver.jötunn = (mouseX > jötunn.x && mouseX < jötunn.x + 200) && (mouseY > jötunn.y && mouseY < jötunn.y + 100);

    const jolt = { x: 300, y: 200, };
    mouseOver.jolt = (mouseX > jolt.x && mouseX < jolt.x + 200) && (mouseY > jolt.y && mouseY < jolt.y + 100);
    
    // Backgrounds
    decideFillStyle(mouseOver.evader, "rgb(230, 230, 230)", "rgb(220, 220, 220)");
    ctx.fillRect(evader.x, evader.y, 200, 100);
    
    decideFillStyle(mouseOver.jsab, "rgb(220, 0, 0)", "rgb(200, 0, 0)");
    ctx.fillRect(jsab.x, jsab.y, 200, 100);
   
    decideFillStyle(mouseOver.jötunn, "rgb(70, 175, 219)", "rgb(65, 166, 209)");
    ctx.fillRect(jötunn.x, jötunn.y, 200, 100);
    
    decideFillStyle(mouseOver.jolt, "rgb(220, 220, 0)", "rgb(200, 200, 0)");
    ctx.fillRect(jolt.x, jolt.y, 200, 100);

    // Text
    function drawDodgerText(color, dodgerName, description, dodger) {
        ctx.fillStyle = color;
        drawCircle(dodger.x + 170, dodger.y + 20)
        
        ctx.font = "25px 'Lucida Console'";
        ctx.fillText(dodgerName, dodger.x + 10, dodger.y + 30);
        ctx.font = "15px 'Lucida Console'";
        ctx.fillText(description, dodger.x + 10, dodger.y + 80);
    }
    
    ctx.textAlign = 'left';
    drawDodgerText("rgb(255, 255, 255)", "EVADER", "ABILITY: NONE", evader);
    drawDodgerText("rgb(255, 0, 0)", "JSAB", "ABILITY: DASH", jsab);
    drawDodgerText("rgb(79, 203, 255)", "JÖTUNN", "ABILITY: STAGNATION", jötunn);
    drawDodgerText("rgb(255, 255, 0)", "JOLT", "ABILITY: SHOCKWAVE", jolt);
}

function drawGameOver() {
    const grad = ctx.createLinearGradient(250, 50, 550, 150)
    const grad2 = ctx.createLinearGradient(250, 150, 550, 50)

    mouseOver.restart = (mouseX > 250 && mouseX < 550) && (mouseY > 50 && mouseY < 150);

    if (mouseOver.restart) {
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
    if (mouseOver.restart) {
        gameOverColor = 'white'
        tryAgainColor = 'red'
    }
    else {
        gameOverColor = 'red'
        tryAgainColor = 'white'
    }
    
    ctx.strokeStyle = gameOverColor;
    ctx.strokeText('Game Over', 335, 80);

    ctx.strokeStyle = tryAgainColor;
    ctx.strokeText('Try Again', 480, 135);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    drawCircle(player.x, player.y, player.radius);
}

function drawEnemies() {
    allEnemies.forEach(enemy => {
        if (enemy.ability == "decelerator") {
            ctx.fillStyle = "rgba(177, 88, 88, 0.47)"
            drawCircle(enemy.x, enemy.y, enemy.auraRadius);
        }

        if (settings.enemyOutlines) {
            ctx.fillStyle = "black"
            drawCircle(enemy.x, enemy.y, enemy.radius * 1.11)
        }

        ctx.fillStyle = enemy.color
        drawCircle(enemy.x, enemy.y, enemy.radius)
    })
}

function drawText() { // draws the current time, highest time, and enemy count
    // Current time in seconds
    currentTime = ((now-startTime) / 1000).toFixed(2);
    timeLeft = (music.duration - currentTime).toFixed(2);
    
    if (gameState === "gameOn") {
        // Updates the highscore and saves it to local storage
        if (Number(currentTime) > Number(highscore[difficulty.level])) {
            highscore[difficulty.level] = currentTime;
            highscoreColor = difficulty.color

            userData.highscore = highscore;
            // Saves data every 5 seconds (incase the user disconnects/crashes)
            if (now - lastSave >= 5000) {
                localStorage.setItem('localUserData', JSON.stringify(userData));
                lastSave = Date.now();
            }
        }

        // Draws the times and the enemy count
        ctx.font = "20px Verdana";
        ctx.textAlign = 'center';
        ctx.fillStyle = "rgb(87, 87, 87)";
        ctx.fillText(`Time Elapsed: ${currentTime}s`, 200, 40);
        ctx.fillText(`Enemy Count: ${allEnemies.length}`, 600, 620);

        if (highscoreColor === difficulty.color) ctx.font = "bold 20px 'Verdana'";
        ctx.fillStyle = highscoreColor;
        // Displays the highest score and the current difficulty (capitalized)
        ctx.fillText(
            `Highest Time (${difficulty.level.charAt(0).toUpperCase() + difficulty.level.slice(1)}): ${highscore[difficulty.level]}s`,
            600, 40);
    }
    if (gameState === "musicMode") {
        // Draws the time left
        ctx.font = "30px Verdana"
        ctx.textAlign = 'center';

        let timeLeftColor;
        if (timeLeft <= 3) timeLeftColor = "rgb(235, 157, 157)";
        else if (timeLeft <= 2) timeLeftColor = "rgb(235, 79, 79)";
        else if (timeLeft <= 1) timeLeftColor = "rgb(235, 0, 0)";
        else timeLeftColor = "rgb(235, 235, 235)";
        
        ctx.fillStyle = timeLeftColor;
        ctx.fillText(`${timeLeft}s`, cnv.width/2, 40);
        
        // Draws the music name and artist
        ctx.font = "20px Verdana"
        ctx.fillStyle = music.color;
        ctx.fillText(`${music.name} - ${music.artist}`, 600, 620);
    }
    
    // Abilites
    ctx.font = "20px 'Verdana'";
    ctx.textAlign = 'center';
    ctx.fillStyle = player.subColor;

    // The text should be centered unless the gameState is gameOn or gameOver
    textX = 200;
    if (gameState === "gameOn" || gameState === "gameOver" || gameState === "musicMode") textX = 200
    else textX = cnv.width/2

    // No Abiliy
    if (player.dodger === "evader") ctx.fillText(`Passive: Skill`, textX, 620);

    // Stagnation
    else if (player.dodger === "jötunn") ctx.fillText(`Passive: Stagnation`, textX, 620);

    // Dash
    else if (player.dodger === "jsab") {
        // Dash CD
        let dashCDLeft = ((1100 - (now - dash.lastEnded)) / 1000).toFixed(2);

        if (now - dash.lastEnded >= 1100) { // 1.1s
            dash.usable = true;

            if (lastPressing === "mouse") ctx.fillText(`Active: Dash (RMB)`, textX, 620);
            else if (lastPressing === "kb") ctx.fillText(`Active: Dash (Q/J)`, textX, 620);
        } else {
            dash.usable = false;
            ctx.fillText(`Active: ${dashCDLeft}s`, textX, 620);
        }
    }

    // Shockwave
    else if (player.dodger === "jolt") {
        // Shockwave CD
        let shockwaveCDLeft = ((2000 - (now - shockwave.lastEnded)) / 1000).toFixed(2);

        if (now - shockwave.lastEnded >= 2000) { // 2s
            shockwave.usable = true;

            if (lastPressing === "mouse") ctx.fillText(`Active: Shockwave (RMB)`, textX, 620);
            else if (lastPressing === "kb") ctx.fillText(`Active: Shockwave (Q/J)`, textX, 620);
        } else {
            shockwave.usable = false;
            ctx.fillText(`Active: ${shockwaveCDLeft}s`, textX, 620);
        }
    }
}

function createEnemy() { // Creates an individual enemy with unique attributes
    let oneEnemy = {
        x: (Math.random() * (cnv.width-60))+30,  // between 30 and 770
        y: (Math.random() * (cnv.height-60))+30,  // between 30 and 520
        radius: (Math.random() * 7.5) + 10,  // between 10 and 17.5
        color: "rgb(100, 100, 100)",
        resetRadius: 0,
    }
    oneEnemy.baseRadius = oneEnemy.radius;
    
    // Initializes the enemy's ability and other important values based on their ability
    enemyAbilitiesAndStats(oneEnemy);
    
    if (difficulty.level === "easy") oneEnemy.speed = Math.random() + 1; // between 1 and 2

    if (difficulty.level === "medium") oneEnemy.speed = Math.random() + 1.25; // between 1.25 and 2.25
    
    if (difficulty.level === "hard") {
        if (oneEnemy.ability === "homing") oneEnemy.speed = (Math.random() * 0.7) + 1.5; // between 1.5 and 2.2
        else oneEnemy.speed = Math.random() + 1.5; // between 1.5 and 2.5 (as fast as the player)
    }
    

    let dx = player.x - oneEnemy.x;
    let dy = player.y - oneEnemy.y;
    let distFromPlayer = Math.hypot(dx, dy);

    // used to prevent the enemy from spawning too close to the player
    while(distFromPlayer < 300) {
        oneEnemy.x = (Math.random() * (cnv.width-60))+30;
        oneEnemy.y = (Math.random() * (cnv.height-60))+30;

        dx = player.x - oneEnemy.x;
        dy = player.y - oneEnemy.y;
        distFromPlayer = Math.hypot(dx, dy);
    }

    // used to make the enemy move toward the player once it spanws
    oneEnemy.movex = (dx / distFromPlayer) * oneEnemy.speed;
    oneEnemy.movey = (dy / distFromPlayer) * oneEnemy.speed;

    // Using base values to extend the possibility of what can be done to the enemies speed
    oneEnemy.baseMoveX = oneEnemy.movex
    oneEnemy.baseMoveY = oneEnemy.movey


    // Initialization foe the angle the enemy moves towards (avoids the weird snapping-towards-the-player effect)
    const angleToPlayer = Math.atan2(dy, dx); // angle toward the player
    oneEnemy.facingAngle = angleToPlayer;

    return oneEnemy;
}

function spawnEnemyPeriodically() {
    if (allEnemies.length < 100 && now - lastSpawn >= enemySpawnPeriod) {
        allEnemies.push(createEnemy());  

        // filter and re-order the array just like in the restartEndless() function (prevents inconsistent overlapping)
        allEnemies = [
            ...allEnemies.filter(enemy => enemy.ability === "decelerator"),
            ...allEnemies.filter(enemy => enemy.ability !== "decelerator")
        ]
        
        lastSpawn = Date.now();

        // Enemy spawn period is 3000ms by default. This decreases it by 200ms for every 10 enemies spawned to increase difficulty
        if (allEnemies.length % 10 == 0) enemySpawnPeriod -= 200;
    }
}


// PLAYER AND ENEMY MOVEMENT
function keyboardControls() {
    let dxKB = 0;
    let dyKB = 0;

    if (wPressed) dyKB -= 1;
    if (sPressed) dyKB += 1;
    if (aPressed) dxKB -= 1;
    if (dPressed) dxKB += 1;

    // Normalize diagonal movement
    if (dxKB !== 0 && dyKB !== 0) {
        const scale = Math.SQRT1_2; // 1 / √2 ≈ 0.7071
        dxKB *= scale;
        dyKB *= scale;
    }
    
    // Moves the player with the keyboard
    if (keyboardMovementOn){
        lastPressing = "kb";
        if (!dash.activated){
            player.speed = 2.5 * shiftPressed * player.slowed;
        }

        player.x += dxKB * player.speed;
        player.y += dyKB * player.speed;

        // Doesn't allow the player to leave the map (wall collisions)
        if (player.x - player.radius  <= 0 || player.x + player.radius  >= cnv.width) player.x -= dxKB * player.speed;
        if (player.y - player.radius  <= 0 || player.y + player.radius  >= cnv.height) player.y -= dyKB * player.speed;
    }
    
    // Determines the angle the player is facing
    if (lastPressing === "kb") {
        if (dxKB !== 0 || dyKB !== 0) player.facingAngle = Math.atan2(dyKB, dxKB);
    }
}

function mouseMovement() {
    const dxMouse = mouseX - player.x;
    const dyMouse = mouseY - player.y;
    const distance = Math.hypot(dxMouse, dyMouse);

    // Moves the player towards the cursor
    if (mouseMovementOn && !keyboardMovementOn) {
        lastPressing = "mouse";
        if (!dash.activated) {
            player.speed = 2.5 * shiftPressed * player.slowed;
        }

        const slowStart = player.radius + 40;
        let slowFactor;
        
        if (distance < slowStart) {
            const factor = (distance) / (slowStart); // 0 -> 1
            slowFactor = 0.3 + 0.7 * factor; // Transition from 0.3x speed to 1x speed
            player.x += (dxMouse / distance) * player.speed * slowFactor;
            player.y += (dyMouse / distance) * player.speed * slowFactor;
        } else {
            player.x += (dxMouse / distance) * player.speed;
            player.y += (dyMouse / distance) * player.speed;
        }

        // Doesn't allow the player to leave the map (wall collisions)
        if (player.x - player.radius  <= 0 || player.x + player.radius  >= cnv.width) {
            if (distance < slowStart) player.x -= (dxMouse / distance) * player.speed * slowFactor;
            else player.x -= (dxMouse / distance) * player.speed;
        }
        if (player.y - player.radius  <= 0 || player.y + player.radius  >= cnv.height) {
            if (distance < slowStart) player.y -= (dyMouse / distance) * player.speed * slowFactor;
            else player.y -= (dyMouse / distance) * player.speed;
        }
    }
    
    // Determines the angle the player is facing
    if (lastPressing === "mouse") {
        player.facingAngle = Math.atan2(dyMouse, dxMouse);
    }
}

function moveEnemies() { // Loops through the allEnemies array to move each enemy with their movex and movey
    allEnemies.forEach(enemy => {
        const dxEnemy = player.x - enemy.x;
        const dyEnemy = player.y - enemy.y;
        const enemyDist = Math.hypot(dxEnemy, dyEnemy);
        let homingIn = false;

        // Homing enemies move toward the player (if the player is close enough)
        if (enemy.ability === "homing")  {
            if (enemyDist <= enemy.detectionRadius) {
                const angleToPlayer = Math.atan2(dyEnemy, dxEnemy); // Target angle

                // Calculate shortest angular difference
                let angleDiff = angleToPlayer - enemy.facingAngle;

                // Normalize to [-PI, PI] for shortest rotation direction
                angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

                const turnSpeed = 0.01; // radians per frame
                enemy.facingAngle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnSpeed);

                // Move forward in direction of facingAngle — speed stays constant
                enemy.baseMoveX = Math.cos(enemy.facingAngle) * enemy.speed;
                enemy.baseMoveY = Math.sin(enemy.facingAngle) * enemy.speed;

                // Set homingIn to true so they bounce off the walls correctly
                homingIn = true;
            }
        } 
        
        if (player.dodger == "jötunn") {
            // Similar to mouse movement mechanics, but theres a limit to how slow the enemies move
            // Calculates the distance from the edge of the enemy to the edge of the player, so I subtract the radii
            const slowStart = 175 - enemy.radius - player.radius;
            const slowEnd = 75 - enemy.radius - player.radius;

            if (enemyDist < slowStart) {
                // Limit distance to avoid going below slowEnd
                const maxDist = Math.max(enemyDist, slowEnd);
                const factor = (maxDist - slowEnd) / (slowStart - slowEnd);
                const slowFactor = 0.3 + 0.7 * factor;

                enemy.movex = enemy.baseMoveX * slowFactor;
                enemy.movey = enemy.baseMoveY * slowFactor;
            } else {
                enemy.movex = enemy.baseMoveX;
                enemy.movey = enemy.baseMoveY;
                enemy.color = enemy.baseColor;
            }
        } else {
                enemy.movex = enemy.baseMoveX;
                enemy.movey = enemy.baseMoveY;
        }
        
        enemy.x += enemy.movex
        enemy.y += enemy.movey
        
        // Doesn't allow the enemies to leave the map (wall collisions)
        if (enemy.x - enemy.radius  <= 0 || enemy.x + enemy.radius  >= cnv.width) {
            // Left or right wall → reflect across the Y axis
            if (!homingIn) enemy.baseMoveX *= -1;
            enemy.facingAngle = Math.PI - enemy.facingAngle;
        }
        if (enemy.y - enemy.radius  <= 0 || enemy.y + enemy.radius  >= cnv.height) {
            // Top or bottom wall → reflect across the X axis
            if (!homingIn) enemy.baseMoveY *= -1;
            enemy.facingAngle = -enemy.facingAngle;
        }
        // Normalize the angle with the ever reliable Math.atan2()
        enemy.facingAngle = Math.atan2(Math.sin(enemy.facingAngle), Math.cos(enemy.facingAngle));
    })
}


// GAMESTATE CHANGES
function restartEndless() { // Resets certain variables once the play button is pressed
    allEnemies = []
    // The starting amount of enemies is different based on the difficulty
    startAmount = 10;
    if (difficulty.level === "medium") startAmount = 20;
    if (difficulty.level === "hard") startAmount = 30;
    for(let i = 1; i < startAmount; i++) {
        allEnemies.push(createEnemy());
    }
    
    // Re-order the allEnemies array to draw the enemies with the auras (decelerator enemies) first
    // this prevents inconsistent overlapping when they're drawn
    allEnemies = [
        ...allEnemies.filter(enemy => enemy.ability === "decelerator"),
        ...allEnemies.filter(enemy => enemy.ability !== "decelerator")
    ]

    
    startTime = Date.now();
    currentTime = 0;
    enemySpawnPeriod = 3000;
    lastSpawn = 0;
    dash.lastEnded = 0;
    shockwave.lastEnded = 0;
    gameState = "gameOn"
}

function collisions() { // Keeps track of when the player touches any enemy in the allEnemies array
    let underAura = 0;
    allEnemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.hypot(dx, dy);

        // Gives the player some time to get out of an enemy they dashed onto (0.3s)
        if (!dash.activated && !(now - dash.lastEnded < 300)) {
            if (distance < player.radius + enemy.radius) {
                highscoreColor = "rgb(87, 87, 87)";
                difficulty.color = "rgb(87, 87, 87)";
                gameState = "gameOver"

                // Saves data once the user dies
                userData.highscore = highscore;
                localStorage.setItem('localUserData', JSON.stringify(userData));
            }
        }

        if (gameState === "gameOver") underAura = 0;
        else if (enemy.ability === "decelerator" && distance < player.radius + enemy.auraRadius) underAura++;
    });
    
    player.slowed = 1 - (underAura/10)
    if (player.slowed < 0.7) player.slowed = 0.7;
}

// ABILITIES
function abilities() { // player-specific-abilities
    // 'Dash' gives the player a powerful but short-lived burst of speed
    if (dash.activated){
        player.speed += dash.speed;
        player.color = "rgb(255, 72, 72)";
        
        if (player.speed > 10) {
            dash.deccelerating = true;
            dash.speed *= -1;
            player.speed += dash.speed;
        }
        if (player.speed <= 2.5 && dash.deccelerating) {
            dash.activated = false;
            dash.deccelerating = false;
            dash.lastEnded = Date.now();
            
            dash.speed *= -1;
            player.speed = 2.5;

            if (player.dodger === "evader") player.color = "white"
            if (player.dodger === "jsab") player.color = "red"
            if (player.dodger === "jötunn") player.color ="rgb(79, 203, 255)"
            if (player.dodger === "jolt") player.color = "yellow"
        }
    }
    // Stagnation's effect changes enemy color based on distance to signify that they're being slowed down
    if (player.dodger === "jötunn") {
        allEnemies.forEach(enemy => {
            const dxEnemy = player.x - enemy.x;
            const dyEnemy = player.y - enemy.y;
            const enemyDist = Math.hypot(dxEnemy, dyEnemy);

            if (enemy.ability === "none") {
                if (enemyDist < 100) {
                    enemy.color = "rgb(55, 77, 107)";
                } else if (enemyDist < 125) {
                    enemy.color = "rgb(68, 84, 107)";
                } else if (enemyDist < 150) {
                    enemy.color = "rgb(81, 91, 105)";
                } else if (enemyDist < 175) {
                    enemy.color = "rgb(95, 100, 107)";
                }
            } else if (enemy.ability === "decelerator") {
                if (enemyDist < 100) {
                    enemy.color = "rgb(210, 0, 0)";
                } else if (enemyDist < 125) {
                    enemy.color = "rgb(220, 0, 0)";
                } else if (enemyDist < 150) {
                    enemy.color = "rgb(230, 0, 0)";
                } else if (enemyDist < 175) {
                    enemy.color = "rgb(240, 0, 0)";
                }
            } else if (enemy.ability === "homing") {
                if (enemyDist < 100) {
                    enemy.color = "rgb(190, 146, 0)";
                } else if (enemyDist < 125) {
                    enemy.color = "rgb(206, 158, 0)";
                } else if (enemyDist < 150) {
                    enemy.color = "rgb(216, 166, 0)";
                } else if (enemyDist < 175) {
                    enemy.color = "rgb(235, 180, 0)";
                }
            }

        })
    }
    if (player.dodger === "jolt") {
        // 'Shockwave' launches a beam that shrinks ememies
        if (shockwave.activated) {
            ctx.fillStyle = 'rgba(255, 255, 255, 1)'

            // create the beams path
            const beamPath = new Path2D();
            beamPath.moveTo(0, -shockwave.radius);
            beamPath.bezierCurveTo(shockwave.radius, -2, shockwave.radius, 2, 0, shockwave.radius);
            beamPath.bezierCurveTo(shockwave.radius/2, 2, shockwave.radius/2, -2, 0, -shockwave.radius);

            // save and transform the canvas
            ctx.save();
            ctx.translate(shockwave.x, shockwave.y);
            ctx.rotate(shockwave.facingAngle);

            // draw the beam
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.fill(beamPath);

            // checks for collisions
            allEnemies.forEach(enemy => {
                if (ctx.isPointInPath(beamPath, enemy.x, enemy.y)) {
                    enemy.radius = enemy.baseRadius/2;
                    if (enemy.ability === "decelerator") enemy.auraRadius = enemy.baseAuraRadius/2;
                    
                    enemy.resetRadius = Date.now(); // starts the time which an enemy got hit
                }
            })

            ctx.restore();

            // increase the radius of the beam and move it every frame
            shockwave.radius *= 1.025;
            shockwave.x += shockwave.movex;
            shockwave.y += shockwave.movey;

            // once the radius is greater than 150, end the entire ability
            if (shockwave.radius >= 150) {
                shockwave.activated = false;
                shockwave.radius = 25;
                shockwave.lastEnded = Date.now();
            }
        }
        allEnemies.forEach(enemy => {
            // Restore the radius of enemies after 5 seconds have passed
            if (now - enemy.resetRadius >= 5000) {
                enemy.radius = enemy.baseRadius;
                if (enemy.ability === "decelerator") enemy.auraRadius = enemy.baseAuraRadius;
            }
            // Decrease the radius of enemies under the effect of shockwave
            else {
                enemy.radius = enemy.baseRadius/2;
                if (enemy.ability === "decelerator") enemy.auraRadius = enemy.baseAuraRadius/2;
            }
        })
    }
}
           

function enemyAbilitiesAndStats(enemy) {
    num = Math.random();

    // All enemies on easy difficulty have no abilities
    if (difficulty.level === "easy")  enemy.ability = "none";

    else if (difficulty.level === "medium") {
        // 25% Chance to get the decelerator ability
        if (num > 0.75) enemy.ability = "decelerator";
        else enemy.ability = "none";
    }
        
    else if (difficulty.level === "hard") {
        // 25% Chance to get the decelerator ability, 15% for the homing ability
        if (num > 0.85) enemy.ability = "homing";
        else if (num > 0.6) enemy.ability = "decelerator";
        else enemy.ability = "none";
    }

    
    if (enemy.ability === "none") enemy.baseColor = "rgb(100, 100, 100)";

    // decelerators need an aura radius for their ability (and are red)
    else if (enemy.ability === "decelerator") {
        enemy.baseColor = "rgb(255, 0, 0)";
        enemy.auraRadius = (Math.random() * 20) + 80;
        enemy.baseAuraRadius = enemy.auraRadius;
    }

    // homings need a detection radius for their ability (and are gold)
    else if (enemy.ability === "homing") {
        enemy.baseColor = "rgb(255, 196, 0)";
        enemy.detectionRadius = 200;
    }
    enemy.color = enemy.baseColor;
}
