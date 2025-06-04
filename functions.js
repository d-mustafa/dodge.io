// KEYBAORD AND MOUSE EVENTS
// keeps track of when certain buttons are pressed/held
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
    if ((event.code == "KeyQ" || event.code == "KeyJ") && gameState != "gameOver") {
        if (player.dodger == "jsab" && dash.usable) {
            dash.activated = true;
        }
    }
    if (event.code == "ShiftLeft" || event.code == "ShiftRight") {
        shiftPressed = 0.7;
    }

    if (wPressed || aPressed || sPressed || dPressed) {
        keyboardMovementOn = true;
    }
}

// keeps track of when certain buttons are released
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

// Keeps track of clicking certain areas on the screen. Needed to make buttons work.
function recordMouseClicked() {
    // Variable to keep mouse movement the way it was if the player pressed a button
    let previousMM;
    
    // Mouse Movement
    if (mouseMovementOn) {
        mouseMovementOn = false;
        previousMM = true;
    } else if (!mouseMovementOn) {
        mouseMovementOn = true;
        previousMM = false;
    }
    
    // Start screen Buttons
    if (gameState == "startScreen") {
        if (mouseOver.play) {
            gameState = "selectDifficulty"
            mouseMovementOn = previousMM;
        } else if (mouseOver.selector) {
            gameState = "selectDodger"
            mouseMovementOn = previousMM;
        }
    }
    // Back to start screen buttons
    else if (gameState == "gameOver" && mouseOver.restart || gameState == "selectDodger" && mouseOver.selector || gameState == "selectDifficulty" && mouseOver.play) {
        gameState = "startScreen"
        mouseMovementOn = previousMM;
    }

    // Difficulty Choice
    else if (gameState == "selectDifficulty") {
        if (mouseOver.easy || mouseOver.medium || mouseOver.hard) {
            if (mouseOver.easy) player.difficulty = "easy";
            else if (mouseOver.medium) player.difficulty = "medium";
            else if (mouseOver.hard) player.difficulty = "hard";

            restartGame()
            mouseMovementOn = previousMM;
        }
    }
    
    // Hero Choice
    else if (gameState == "selectDodger") {
        if (mouseOver.weaver) {
            player.dodger = "weaver";
            player.color = "rgb(255, 255, 255)";
            player.subColor = "rgb(230, 230, 230)";
            mouseMovementOn = previousMM;
        }
        else if (mouseOver.jsab) {
            player.dodger = "jsab";
            player.color = "rgb(255, 0, 0)";
            player.subColor = "rgb(230, 0, 0)";
            mouseMovementOn = previousMM;
        }
        else if (mouseOver.jötunn) {
            player.dodger = "jötunn";
            player.color = "rgb(79, 203, 255)";
            player.subColor = "rgb(70, 186, 235)";
            mouseMovementOn = previousMM;
        }
    }
}


// FUNCTIONS THAT DRAWS STUFF TO THE SCREEN
// Draws the main menu
function drawStartScreen() {
    if (gameState == "startScreen" || gameState == "selectDifficulty") {
        // PLAY BUTTON //
        let playBtn = {
            x: 250,
            y: 75,
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


        let color1 = 'lime'
        let color2 = 'white'

        if (mouseOver.play) {
            color1 = 'white'
            color2 = 'lime'
        } else {
            color1 = 'lime'
            color2 = 'white'
        }
        
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        
        // swaps between 2 types of buttons for going in and out of the character selection screen
        // (this way i dont need to rewrite over 50 lines of code)
        if (gameState == "startScreen") {
            ctx.strokeStyle = color1;
            ctx.strokeText('Start', playBtn.x + 70, playBtn.y + 30);
        
            ctx.strokeStyle = color2;
            ctx.strokeText('Playing', playBtn.x + 220, playBtn.y + 85);
        } else if (gameState == "selectDifficulty") {
            ctx.strokeStyle = color1;
            ctx.strokeText('Back To', playBtn.x + 70, playBtn.y + 30);
        
            ctx.strokeStyle = color2;
            ctx.strokeText('Main Menu', playBtn.x + 220, playBtn.y + 85);
        }
    }
    if (gameState == "startScreen"  || gameState == "selectDodger") {
                // DODGER SLECTOR BUTTON //
        let selectorBtn = {
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

        let color3 = 'grey'
        let color4 = 'white'

        if (mouseOver.selector) {
            color3 = 'white'
            color4 = 'grey'
        }
        else {
            color3 = 'grey'
            color4 = 'white'
        }

        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        
        // swaps between 2 types of buttons for going in and out of the character selection screen
        // (this way i dont need to rewrite over 50 lines of code)
        if (gameState == "startScreen") {
            ctx.strokeStyle = color3;
            ctx.strokeText('Dodger', selectorBtn.x + 70, selectorBtn.y + 30);
        
            ctx.strokeStyle = color4;
            ctx.strokeText('Selector', selectorBtn.x + 220, selectorBtn.y + 85);
        } else if (gameState == "selectDodger") {
            ctx.strokeStyle = color3;
            ctx.strokeText('Back To', selectorBtn.x + 70, selectorBtn.y + 30);
        
            ctx.strokeStyle = color4;
            ctx.strokeText('Main Menu', selectorBtn.x + 220, selectorBtn.y + 85);
        }
    }
}

// Draws the difficulty options screen
function drawDifficultySelection() {
    function decideFillStyle(bool, color1, color2) {
        if (bool) {
            ctx.fillStyle = color1;
        } else {
            ctx.fillStyle = color2;
        }
    }

    // BackGrounds
    mouseOver.easy = (mouseX > 50 && mouseX < 250) && (mouseY > 200 && mouseY < 300);
    decideFillStyle(mouseOver.easy, "rgb(0, 191, 216)", "rgb(0, 171, 194)");
    ctx.fillRect(50, 200, 200, 100);
    

    mouseOver.medium = (mouseX > 300 && mouseX < 500) && (mouseY > 200 && mouseY < 300);
    decideFillStyle(mouseOver.medium, "rgb(220, 220, 0)", "rgb(200, 200, 0)");
    ctx.fillRect(300, 200, 200, 100);
    

    mouseOver.hard = (mouseX > 550 && mouseX < 750) && (mouseY > 200 && mouseY < 300);
    decideFillStyle(mouseOver.hard, "rgb(30, 30, 30)", "rgb(50, 50, 50)");
    ctx.fillRect(550, 200, 200, 100);

    // Text
    ctx.textAlign = 'left';

    ctx.fillStyle = "rgb(0, 225, 255)";

    ctx.font = "25px 'Lucida Console'";
    ctx.fillText("EASY", 60, 230);
    ctx.font = "15px 'Lucida Console'";
    ctx.fillText("Normal Enemies", 60, 280);


    ctx.fillStyle = "rgb(255, 255, 0)";

    ctx.font = "25px 'Lucida Console'";
    ctx.fillText("MEDIUM", 310, 230);
    ctx.font = "15px 'Lucida Console'";
    ctx.fillText("Decelerating Enemies", 310, 280);


    ctx.fillStyle = "rgb(0, 0, 0)";

    ctx.font = "25px 'Lucida Console'";
    ctx.fillText("HARD", 560, 230);
    ctx.font = "15px 'Lucida Console'";
    ctx.fillText("Homing Enemies", 560, 280);
}

// Convenience function to draw simple circles
function drawCircle(x, y, r = 12.5) {
    ctx.beginPath()
    ctx.arc(x, y, r, Math.PI * 2, 0)
    ctx.fill()
}

// Draws the character selection screen
function drawDodgerSelection() {
    // Inner function to make life easier
    function decideFillStyle(bool, color1, color2) {
        if (bool) {
            ctx.fillStyle = color1;
        } else {
            ctx.fillStyle = color2;
        }
    }

    // BackGrounds
    mouseOver.weaver = (mouseX > 50 && mouseX < 250) && (mouseY > 200 && mouseY < 300);
    decideFillStyle(mouseOver.weaver, "rgb(230, 230, 230)", "rgb(220, 220, 220)");
    ctx.fillRect(50, 200, 200, 100);
    

    mouseOver.jsab = (mouseX > 300 && mouseX < 500) && (mouseY > 200 && mouseY < 300);
    decideFillStyle(mouseOver.jsab, "rgb(220, 0, 0)", "rgb(200, 0, 0)");
    ctx.fillRect(300, 200, 200, 100);
    

    mouseOver.jötunn = (mouseX > 550 && mouseX < 750) && (mouseY > 200 && mouseY < 300);
    decideFillStyle(mouseOver.jötunn, "rgb(70, 175, 219)", "rgb(65, 166, 209)");
    ctx.fillRect(550, 200, 200, 100);

    // Text
    ctx.textAlign = 'left';

    ctx.fillStyle = "rgb(255, 255, 255)";
    drawCircle(220, 220)

    ctx.font = "25px 'Lucida Console'";
    ctx.fillText("WEAVER", 60, 230);
    ctx.font = "15px 'Lucida Console'";
    ctx.fillText("ABILITY: NONE", 60, 280);


    ctx.fillStyle = "rgb(255, 0, 0)";
    drawCircle(470, 220)

    ctx.font = "25px 'Lucida Console'";
    ctx.fillText("JSAB", 310, 230);
    ctx.font = "15px 'Lucida Console'";
    ctx.fillText("ABILITY: DASH", 310, 280);


    ctx.fillStyle = "rgb(79, 203, 255)";
    drawCircle(730, 220)

    ctx.font = "25px 'Lucida Console'";
    ctx.fillText("JÖTUNN", 560, 230);
    ctx.font = "15px 'Lucida Console'";
    ctx.fillText("ABILITY: STAGNATION", 560, 280);
}

// Draws the game over screen
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

function drawPlayer() { // self explanatory no?
    ctx.fillStyle = player.color
    ctx.beginPath()
    ctx.arc(player.x, player.y, player.radius, Math.PI*2, 0)
    ctx.fill()
}

// Loops through the allEnemies array and draws all of them with their own unique attributes
function drawEnemies() {
    allEnemies.forEach(enemy => {
        ctx.fillStyle = enemy.color
        drawCircle(enemy.x, enemy.y, enemy.radius)
        
        if (enemy.ability == "decelerator") {
            ctx.fillStyle = "rgba(177, 88, 88, 0.47)"
            drawCircle(enemy.x, enemy.y, enemy.auraRadius);
        }
    })
}

// draws the current time, highest time, and enemy count
function drawText() {
    if (gameState == "gameOn") {
        currentTime = ((now-startTime) / 1000).toFixed(2);

        // Updates the highscore
        if (Number(currentTime) > Number(highscore)) {
            highscore = currentTime;
            highscoreColor = player.subColor;
        }

        // Actually draws the times (and the enemy count)
        ctx.font = "20px 'Verdana'";
        ctx.textAlign = 'center';
            
        ctx.fillStyle = "rgb(87, 87, 87)";
        ctx.fillText(`Time Elapsed: ${currentTime}s`, 200, 40);
        ctx.fillText(`Enemy Count: ${allEnemies.length}`, 600, 620);

        ctx.fillStyle = highscoreColor;
        ctx.fillText(`Highest Time: ${highscore}s`, 600, 40);
    }
    // Abilites
    ctx.font = "20px 'Verdana'";
    ctx.textAlign = 'center';
    ctx.fillStyle = player.subColor;

    // The text should be centered unless the gameState is gameOn
    textX = 200;
    if (gameState == "gameOn") textX = 200
    else textX = 400

    // No Abiliy
    if (player.dodger == "weaver") ctx.fillText(`Passive: Skill`, textX, 620);

    // Dash
    else if (player.dodger == "jsab") {
        // Dash CD
        let dashCDLeft = ((dash.cooldown - (now - dash.lastUsed)) / 1000).toFixed(2)
        if (now - dash.lastUsed < dash.cooldown) {
            dash.usable = false;
            ctx.fillText(`Active: ${dashCDLeft}s`, textX, 620);
        } else {
            dash.usable = true;
            ctx.fillText(`Active: Dash(Q/J)`, textX, 620);
        }
    }
    
    // Stagnation (Passive)
    else if (player.dodger == "jötunn") ctx.fillText(`Passive: Stagnation`, textX, 620);
}

// Creates an individual enemy with unique attributes
function createEnemy() {
    let oneEnemy = {
        x: (Math.random() * (cnv.width-60))+30,
        y: (Math.random() * (cnv.height-60))+30,
        radius: (Math.random() * 7.5) + 10,
        speed: Math.random() + 0.3,
        color: "rgb(100, 100, 100)",
    }

    let dx = player.x - oneEnemy.x;
    let dy = player.y - oneEnemy.y;
    let distance = Math.hypot(dx, dy);

    // used to prevent the enemy from spawning too close to the player
    while(distance < 300) {
        oneEnemy.x = (Math.random() * (cnv.width-60))+30;
        oneEnemy.y = (Math.random() * (cnv.height-60))+30;

        dx = player.x - oneEnemy.x;
        dy = player.y - oneEnemy.y;
        distance = Math.hypot(dx, dy);
    }

    // used to make the enemy move toward the player once it spanws
    oneEnemy.movex = (dx / distance) * oneEnemy.speed;
    oneEnemy.movey = (dy / distance) * oneEnemy.speed;

    // used so modifications can be made to movex and movey without losing their original values
    oneEnemy.baseMoveX = oneEnemy.movex
    oneEnemy.baseMoveY = oneEnemy.movey
    
    giveEnemyAbility(oneEnemy);

    return oneEnemy;
}

// Spawns an enemy every 3s
function spawnEnemyPeriodically() {
    if (allEnemies.length < 100 && now - lastSpawn > enemySpawnPeriod) {
        allEnemies.push(createEnemy());
        lastSpawn = Date.now();

        // Enemy spawn period is 3000ms by default. This decreases it by 200ms for every 10 enemies spawned to increase difficulty
        if (allEnemies.length % 10 == 0) enemySpawnPeriod -= 200;
    }
}

// PLAYER AND ENEMY MOVEMENT
// Keeps track of WASD inputs to move the player
function keyboardControls() {
    if (keyboardMovementOn){
        if (!dash.activated){
            player.speed = 2.5 * shiftPressed * player.slowed;
        }
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
}

// Keeps track of the cursor to move the player towards it
function mouseMovement() {
    if (mouseMovementOn && !keyboardMovementOn) {
        const dx = mouseX - player.x;
        const dy = mouseY - player.y;
        const distance = Math.hypot(dx, dy);
        if (!dash.activated){
            player.speed = 2.5 * shiftPressed * player.slowed;
        }
        if (distance > 1) {
            player.x += (dx / distance) * player.speed;
            player.y += (dy / distance) * player.speed;
        }

        // Doesnt allow the player to leave the map
        if (player.x - player.radius  <= 0 || player.x + player.radius  >= cnv.width) player.x -= (dx / distance) * player.speed;
        if (player.y - player.radius  <= 0 || player.y + player.radius  >= cnv.height) player.y -= (dy / distance) * player.speed;
    }
}

// Loops through the allEnemies array to move each enemy with their movex and movey
function moveEnemies() {
    allEnemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.hypot(dx, dy);

        if (enemy.ability === "homing") {
            if (distance < enemy.detectionRadius) {
                const targetVX = (dx / distance) * enemy.speed;
                const targetVY = (dy / distance) * enemy.speed;

                // Smoothly adjust velocity toward target vector (homing, but with a delay)
                enemy.baseMoveX += (targetVX - enemy.baseMoveX) * 0.01;
                enemy.baseMoveY += (targetVY - enemy.baseMoveY) * 0.01;
            }
        }
        
        if (player.dodger == "jötunn") {
            if (distance < 175 && distance > 100) {
                enemy.movex = enemy.baseMoveX / (1/distance * 194);
                enemy.movey = enemy.baseMoveY / (1/distance * 194);
            } else if (distance < 100) {
                enemy.movex = enemy.baseMoveX / (1/75 * 194);
                enemy.movey = enemy.baseMoveY / (1/75 * 194);
            } else {
                enemy.movex = enemy.baseMoveX;
                enemy.movey = enemy.baseMoveY;
                enemy.color = enemy.baseColor;
            }
        } else {
                enemy.movex = enemy.baseMoveX;
                enemy.movey = enemy.baseMoveY;


        }

        // if (enemy.ability == "homing") {
        //     enemy.movex = (dx / distance) * enemy.speed;
        //     enemy.movey = (dy / distance) * enemy.speed;
        // }
        
        enemy.x += enemy.movex
        enemy.y += enemy.movey
        
        // Doesnt allow the enemies to leave the map
        if (enemy.x - enemy.radius  <= 0 || enemy.x + enemy.radius  >= cnv.width) enemy.baseMoveX *= -1;
        if (enemy.y - enemy.radius  <= 0 || enemy.y + enemy.radius  >= cnv.height) enemy.baseMoveY *= -1;
    })

}


// GAMESTATE CHANGES

// Resets certain variables once the play button is pressed
function restartGame() {
    allEnemies = []
    startAmount = 10;
    if (player.difficulty == "medium") startAmount = 15;
    if (player.difficulty == "hard") startAmount = 20;
    for(let i = 1; i < startAmount; i++) {
        allEnemies.push(createEnemy());
    }

    startTime = Date.now();
    currentTime = 0;
    enemySpawnPeriod = 3000;
    lastSpawn = 0;
    dash.lastUsed = 0;

    gameState = "gameOn"
}

// Keeps track of when the player touches any enemy in the allEnemies array
function collisions() {
    let underAura = 0;
    allEnemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.hypot(dx, dy);

        if (!dash.activated || now - dash.lastUsed < 200){
            if (distance < player.radius + enemy.radius) {
                highscoreColor = "rgb(87, 87, 87)";
                gameState = "gameOver"

            }
        }

        if (enemy.ability == "decelerator" && distance < player.radius + enemy.auraRadius) {
            underAura += 1;
        }
    });
    player.slowed = 1 - (underAura/15)
    if (player.slowed < 0.8) player.slowed = 0.8;
}

// ABILITIES

// Player abilities
function abilities() {
    if (player.dodger == "jsab") {
        // Dash (Active)
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
                dash.lastUsed = Date.now();
            
                dash.speed *= -1;
                player.speed = 2.5;
                player.color = "rgb(255, 0, 0)";
            }
        }
    }
    
    if (player.dodger == "jötunn") {
        allEnemies.forEach(enemy => {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = Math.hypot(dx, dy);

            if (enemy.ability == "none") {
                if (distance < 100) {
                    enemy.color = "rgb(55, 77, 107)";
                } else if (distance < 125) {
                    enemy.color = "rgb(68, 84, 107)";
                } else if (distance < 150) {
                    enemy.color = "rgb(81, 91, 105)";
                } else if (distance < 175) {
                    enemy.color = "rgb(95, 100, 107)";
                }
            } else if (enemy.ability == "decelerator") {
                if (distance < 100) {
                    enemy.color = "rgb(210, 0, 0)";
                } else if (distance < 125) {
                    enemy.color = "rgb(220, 0, 0)";
                } else if (distance < 150) {
                    enemy.color = "rgb(230, 0, 0)";
                } else if (distance < 175) {
                    enemy.color = "rgb(240, 0, 0)";
                }
            } else if (enemy.ability == "homing") {
                if (distance < 100) {
                    enemy.color = "rgb(190, 146, 0)";
                } else if (distance < 125) {
                    enemy.color = "rgb(206, 158, 0)";
                } else if (distance < 150) {
                    enemy.color = "rgb(216, 166, 0)";
                } else if (distance < 175) {
                    enemy.color = "rgb(235, 180, 0)";
                }
            }

        })
    }
}

// Enemy abilities
function giveEnemyAbility(enemy) {
    if (player.difficulty == "easy") {
        // All enemies on easy difficulty have no abilitis
        enemy.ability = "none";
    } else {
        num = Math.random();

        // 25% chance for an enemy on medium or hard difficulty to be a decelerator
        if ((player.difficulty == "medium" || player.difficulty == "hard") && num > 0.75) enemy.ability = "decelerator";

        // 25% chance for an enemy on hard difficulty to be a homing
        else if (player.difficulty == "hard" && num > 0.5) enemy.ability = "homing";

        // 50% chance for an enemy on meidum or hard difficulty have no ability
        else enemy.ability = "none";
    }

    if (enemy.ability == "none") {
        enemy.baseColor = "rgb(100, 100, 100)";

    } else if (enemy.ability == "decelerator") {
        enemy.baseColor = "rgb(255, 0, 0)";
        enemy.auraRadius = 60;

    } else if (enemy.ability == "homing") {
        enemy.baseColor = "rgb(255, 196, 0)";
        enemy.detectionRadius = 200;
    }
    enemy.color = enemy.baseColor;
}
