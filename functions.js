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
    if ((event.code == "KeyQ" || event.code == "KeyJ") && dash.usable) {
        dash.activated = true;
    }
    if (event.code == "ShiftLeft" || event.code == "ShiftRight") {
        shiftPressed = 0.5
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
    // Mouse Movement
    if (gameState != "gameOver") {
        if (mouseMovementOn) {
            mouseMovementOn = false
        } else if (!mouseMovementOn) {
            mouseMovementOn = true;
        }  
    }
    // Play Button
    if (gameState == "startScreen" && mouseOver.play) {
        restartGame()
        mouseOver.play = false;
    }
    // Play Again Button
    if (gameState == "gameOver" && mouseOver.restart) {
        gameState = "startScreen"
        mouseOver.restart = false;
    }
    
    // Hero Choice
    if (gameState == "pickDodger") {
        if (mouseOver.weaver) {
            player.dodger = "weaver";
            player.color = "rgb(255, 255, 255)";
            player.subColor = "rgb(230, 230, 230)";
        }
        else if (mouseOver.jsab) {
            player.dodger = "jsab";
            player.color = "rgb(255, 0, 0)";
            player.subColor = "rgb(127, 0, 0)";
        }
        else if (mouseOver.jotunn) {
            player.dodger = "jotunn";
            player.color = "rgb(79, 203, 255)";
            player.subColor = "rgb(62, 158, 199)";
        }
    }
}

// Draw Stuff
function drawStartScreen() {
    // DODGER SLECTOR BUTTON //
    const selectorGrad = ctx.createLinearGradient(250, 50, 550, 150)
    const selectorGrad2 = ctx.createLinearGradient(250, 150, 550, 50)

    mouseOver.selector = (mouseX > 250 && mouseX < 550) && (mouseY > 50 && mouseY < 150);
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
    ctx.fillRect(250, 50, 300, 100)
    ctx.strokeStyle = selectorGrad2;
    ctx.beginPath()
    ctx.moveTo(250, 150)
    ctx.lineTo(550, 50)
    ctx.stroke()

    ctx.font = '30px Arial';
    ctx.textAlign = 'center';

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

    ctx.strokeStyle = color1;
    ctx.strokeText('Dodger', 320, 80);
    
    ctx.strokeStyle = color2;
    ctx.strokeText('Selector', 470, 135);


    // PLAY BUTTON //
    const playGrad = ctx.createLinearGradient(250, 500, 550, 600)
    const playGrad2 = ctx.createLinearGradient(250, 600, 550, 500)

    mouseOver.play = (mouseX > 250 && mouseX < 550) && (mouseY > 500 && mouseY < 600);

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
    ctx.fillRect(250, 500, 300, 100)

    ctx.strokeStyle = playGrad2;
    ctx.beginPath()
    ctx.moveTo(250, 600)
    ctx.lineTo(550, 500)
    ctx.stroke()


    let color3 = 'lime'
    let color4 = 'white'

    if (mouseOver.play) {
        color3 = 'white'
        color4 = 'lime'
    }
    else {
        color3 = 'lime'
        color4 = 'white'
    }
    
    ctx.strokeStyle = color3;
    ctx.strokeText('Start', 320, 530);
    
    ctx.strokeStyle = color4;
    ctx.strokeText('Playing', 470, 585);
}

function drawDodgerSelection() {

}

function drawGameOver() {
    const grad = ctx.createLinearGradient(250, 50, 550, 150)
    const grad2 = ctx.createLinearGradient(250, 150, 550, 50)

    mouseOver.restart = (mouseX > 250 && mouseX < 550) && (mouseY > 50 && mouseY < 150);

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

function drawScore() {
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
        
    ctx.fillStyle = "rgb(87, 87, 87)";
    ctx.fillText(`Score: ${score}`, 200, 40);
    ctx.fillText(`Enemy Count: ${allEnemies.length}`, 600, 40);

    ctx.fillStyle = highscoreColor;
    ctx.fillText(`Highscore: ${highscore}`, 400, 40);
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
    time++;
    score = Math.round(time/10);
    if (Number(score) > Number(highscore)) {
        highscore = score;
        highscoreColor = player.subColor;
    }

    if (allEnemies.length < 100 && time > 500) {
        if (time % enemySpawnTime == 0) {
            allEnemies.push(createEnemy());
        

            if (allEnemies.length % 10 == 0) {
                enemySpawnTime -= 20;
            }
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

    time = 0;
    score = 0;
    enemySpawnTime = 200;
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
    // Dash (Active)
    now = Date.now()
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
        
        // Cooldown Text
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = player.subColor;
        ctx.fillText(`Dash: ${dashCDLeft}s`, 400, 620);
    }
    else dash.usable = true;
    

    // Stagnation (Passive)
    allEnemies.forEach(enemy => {
        const dx = player.x - enemy["x"];
        const dy = player.y - enemy["y"];
        const distance = Math.hypot(dx, dy)
        
        if (distance < 100) {
            enemy["movex"] = enemy["baseMoveX"] / 1.7
            enemy["movey"] = enemy["baseMoveY"] / 1.7
            enemy["color"] = "rgb(55, 77, 107)"
        } else if (distance < 125) {
            enemy["movex"] = enemy["baseMoveX"] / 1.5
            enemy["movey"] = enemy["baseMoveY"] / 1.5
            enemy["color"] = "rgb(68, 84, 107)"
        } else if (distance < 150) {
            enemy["movex"] = enemy["baseMoveX"] / 1.3
            enemy["movey"] = enemy["baseMoveY"] / 1.3
            enemy["color"] = "rgb(81, 91, 105)"
        } else if (distance < 175) {
            enemy["movex"] = enemy["baseMoveX"] / 1.1
            enemy["movey"] = enemy["baseMoveY"] / 1.1
            enemy["color"] = "rgb(95, 100, 107)"
        } else {
            enemy["movex"] = enemy["baseMoveX"]
            enemy["movey"] = enemy["baseMoveY"]
            enemy["color"] = "rgb(100, 100, 100)"
        }
    })
}


