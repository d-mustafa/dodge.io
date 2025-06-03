// Keyboard and Mouse Events
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
        shiftPressed = 0.75
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
            restartGame()
            mouseMovementOn = previousMM;
        } else if (mouseOver.selector) {
            gameState = "selectDodger"
            mouseMovementOn = previousMM;
        }
    }
    // Back to start screen buttons
    else if (gameState == "gameOver" && mouseOver.restart || gameState == "selectDodger" && mouseOver.selector) {
        gameState = "startScreen"
        mouseMovementOn = previousMM;
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

// Draw Stuff
function drawStartScreen() {
    if (gameState == "startScreen") {
        // PLAY BUTTON //
        let playBtn = {
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


        let color3 = 'lime'
        let color4 = 'white'

        if (mouseOver.play) {
            color3 = 'white'
            color4 = 'lime'
        } else {
            color3 = 'lime'
            color4 = 'white'
        }
        
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        
        ctx.strokeStyle = color3;
        ctx.strokeText('Start', playBtn.x + 70, playBtn.y + 30);
    
        ctx.strokeStyle = color4;
        ctx.strokeText('Playing', playBtn.x + 220, playBtn.y + 85);
    }
    
    // DODGER SLECTOR BUTTON //
    let selectorBtn = {
        x: 250,
        y: 500,
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

    let color1 = 'grey'
    let color2 = 'white'

    if (mouseOver.selector) {
        color1 = 'white'
        color2 = 'grey'
    }
    else {
        color1 = 'grey'
        color2 = 'white'
    }

    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    
    // swap between 'dodger selector' and 'back to main menu' for the button
    if (gameState == "startScreen") {
        ctx.strokeStyle = color1;
        ctx.strokeText('Dodger', selectorBtn.x + 70, selectorBtn.y + 30);
    
        ctx.strokeStyle = color2;
        ctx.strokeText('Selector', selectorBtn.x + 220, selectorBtn.y + 85);
    } else if (gameState == "selectDodger") {
        ctx.strokeStyle = color1;
        ctx.strokeText('Back To', selectorBtn.x + 70, selectorBtn.y + 30);
    
        ctx.strokeStyle = color2;
        ctx.strokeText('Main Menu', selectorBtn.x + 220, selectorBtn.y + 85);
    }
}

function drawDodgerSelection() {
    // Inner functions to make life easier
    function drawCircle(x, y) {
        ctx.beginPath()
        ctx.arc(x, y, 12.5, Math.PI * 2, 0)
        ctx.fill()
    }
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
    ctx.fillStyle = player.color
    ctx.beginPath()
    ctx.arc(player.x, player.y, player.radius, Math.PI*2, 0)
    ctx.fill()
}

function drawEnemies() {
    allEnemies.forEach(enemy => {
        ctx.fillStyle = enemy.color
        ctx.beginPath()
        ctx.arc(enemy["x"], enemy["y"], enemy["radius"], Math.PI*2, 0)
        ctx.fill()
    })
}

function drawTime() {
    currentTime = ((now-startTime) / 1000).toFixed(2);

    console.log("currentTime: " + typeof currentTime)
    console.log("highscore: " + typeof highscore)

    // Updates the highscore
    if (Number(currentTime) > Number(highscore)) {
        highscore = currentTime;
        highscoreColor = player.subColor;
    }

    // Actually draws the times (and the enemy count)
    ctx.font = "17.5px 'Verdana'";
    ctx.textAlign = 'center';
        
    ctx.fillStyle = "rgb(87, 87, 87)";
    ctx.fillText(`Time Elapsed: ${currentTime}s`, 200, 40);
    ctx.fillText(`Enemy Count: ${allEnemies.length}`, 600, 40);

    ctx.fillStyle = highscoreColor;
    ctx.fillText(`Highest Time: ${highscore}s`, 400, 40);
}

function createEnemy() {
    let oneEnemy = {
        x: (Math.random() * (cnv.width-60))+30,
        y: (Math.random() * (cnv.height-60))+30,
        radius: (Math.random() * 10) + 10,
        speed: Math.random() + 0.3,
        color: "rgb(100, 100, 100)"
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
    oneEnemy.baseMoveX = oneEnemy.movex
    oneEnemy.baseMoveY = oneEnemy.movey

    return oneEnemy;
}

function spawnEnemyPeriodically() {
    // Enemy spawn period is 3000ms by default, decreases by 200ms for every 10 enemies spawned to increase difficulty
    if (allEnemies.length < 100 && now - lastSpawn > enemySpawnPeriod) {
        allEnemies.push(createEnemy());
        lastSpawn = Date.now();

        if (allEnemies.length % 10 == 0) {
            enemySpawnPeriod -= 200;
        }
    }
}

// Player and Enemy Movement
function keyboardControls() {
    if (keyboardMovementOn){
        if (!dash.activated){
            player.speed = 2.5 * shiftPressed;
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

function mouseMovement() {
    if (mouseMovementOn && !keyboardMovementOn) {
        const dx = mouseX - player.x;
        const dy = mouseY - player.y;
        const distance = Math.hypot(dx, dy);
        if (!dash.activated){
            player.speed = 2.5 * shiftPressed;
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

function moveEnemies() {
    allEnemies.forEach(enemy => {
        if (player.dodger != "jötunn") {
            enemy["movex"] = enemy["baseMoveX"];
            enemy["movey"] = enemy["baseMoveY"];
        }
        
        enemy["x"] += enemy["movex"]
        enemy["y"] += enemy["movey"]
        
        // Doesnt allow the enemies to leave the map
        if (enemy["x"] - enemy["radius"]  <= 0 || enemy["x"] + enemy["radius"]  >= cnv.width) enemy["baseMoveX"] *= -1
        if (enemy["y"] - enemy["radius"]  <= 0 || enemy["y"] + enemy["radius"]  >= cnv.height) enemy["baseMoveY"] *= -1
    })

}


// GameState Changes
function restartGame() {
    mouseMovementOn = false;

    allEnemies = []
    for(let i = 0; i < 10; i++) {
        allEnemies.push(createEnemy());
    }

    startTime = Date.now();
    currentTime = 0;
    enemySpawnPeriod = 3000;
    lastSpawn = 0;
    dash.lastUsed = 0;

    gameState = "gameOn"
}

function collisions() {
    if (!dash.activated || now - dash.lastUsed < 200){
        allEnemies.forEach(enemy => {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = Math.hypot(dx, dy);

            if (distance < player.radius + enemy.radius) {
                highscoreColor = "rgb(87, 87, 87)";
                gameState = "gameOver"

            }
        });
    }
}

// Abilities
function abilities() {
    ctx.font = "20px 'Verdana'";
    ctx.textAlign = 'center';
    ctx.fillStyle = player.subColor;

    if (player.dodger == "weaver") {
        // No Abiliy
        ctx.fillText(`Passive: Skill`, 400, 620);
    }
    
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
        // Dash CD
        let dashCDLeft = ((dash.cooldown - (now - dash.lastUsed)) / 1000).toFixed(2)
        if (now - dash.lastUsed < dash.cooldown) {
            dash.usable = false;
            ctx.fillText(`Active: ${dashCDLeft}s`, 400, 620);
        }
        else {
            dash.usable = true;
            ctx.fillText(`Active: Dash(Q)`, 400, 620);
        }
    }
    
    if (player.dodger == "jötunn") {
        // Stagnation (Passive)
        ctx.fillText(`Passive: Stagnation`, 400, 620);
        
        allEnemies.forEach(enemy => {
            const dx = player.x - enemy["x"];
            const dy = player.y - enemy["y"];
            const distance = Math.hypot(dx, dy);
        
            if (distance < 175 && distance > 100) {
                enemy["movex"] = enemy["baseMoveX"] / (1/distance * 194);
                enemy["movey"] = enemy["baseMoveY"] / (1/distance * 194);
            } else if (distance < 100) {
                enemy["movex"] = enemy["baseMoveX"] / (1/75 * 194);
                enemy["movey"] = enemy["baseMoveY"] / (1/75 * 194);
                enemy["color"] = "rgb(55, 77, 107)";
            } else {
                enemy["movex"] = enemy["baseMoveX"];
                enemy["movey"] = enemy["baseMoveY"];
                enemy["color"] = "rgb(100, 100, 100)";
            }


            if (distance < 100) {
                enemy["color"] = "rgb(55, 77, 107)";
            } else if (distance < 125) {
                enemy["color"] = "rgb(68, 84, 107)";
            } else if (distance < 150) {
                enemy["color"] = "rgb(81, 91, 105)";
            } else if (distance < 175) {
                enemy["color"] = "rgb(95, 100, 107)";
            }
        })
    }
}
