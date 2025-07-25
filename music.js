console.log("growthfactor and layers");// DODGE.IO - MUSIC.JS
function restartMusicMode() {
    allEnemies = [];
    player.lives = 3;
    player.hit = 0;
    volume = Math.floor((settings.volumeSliderX - 165) / 1.5);
    timestampIndex = 0;
    music.var.volume = volume/100;
    music.var.currentTime = 0;
    music.promise = music.var.play();
    timeLeft = (music.var.duration - music.var.currentTime).toFixed(2);
    dash.lastEnded = 0;
    shockwave.lastEnded = 0;
    innerGameState = 'inMusicMode';
    gameState = "musicMode";
}

function pauseAudio() { // Pause music without causing errors
    if (music.promise !== undefined) {
        music.promise.then(_ => {
            music.var.pause();
        })
        .catch(error => {
            console.warn(error);
        });
    }
}

function drawEndLevel() {
    if (timeLeft <= 0 || innerGameState === "musicModeFail") {
        let exitX = 150;
        let exitY = (cnv.height/2 - 100);
        let inExitRect = player.x + player.radius <= exitX + 200 && player.x - player.radius >= exitX && player.y + player.radius <= exitY + 200 && player.y - player.radius >= exitY;
        let redoX = 450;
        let redoY = (cnv.height/2 - 100);
        let inRedoRect = player.x + player.radius <= redoX + 200 && player.x - player.radius >= redoX && player.y + player.radius <= redoY + 200 && player.y - player.radius >= redoY;
        
        // Exit Rect
        if (timeLeft <= 0) ctx.fillStyle = "rgb(0, 235, 0)";
        if (innerGameState === "musicModeFail") ctx.fillStyle = "rgb(235, 0, 0)";
        ctx.fillRect(exitX, exitY, 200, 200);
        
        // Redo Rect
        ctx.fillStyle = music.color;
        ctx.fillRect(redoX, redoY, 200, 200);
        
        // Loading Rect
        let growthFactor = ((now-startTime)/1000)*40;
        if (inExitRect) {
            if (timeLeft <= 0) ctx.fillStyle = "rgb(0, 245, 0)";
            if (innerGameState === "musicModeFail") ctx.fillStyle = "rgb(245, 0, 0)";
            ctx.fillRect(exitX, exitY, growthFactor, growthFactor);
        } else if (inRedoRect) {
            ctx.fillStyle = music.subColor;
            ctx.fillRect(redoX, redoY, growthFactor, growthFactor);
        }
        
        ctx.textAlign = "center";
        ctx.font = "30px Verdana";
        ctx.fillStyle = "rgb(235, 235, 235)";

        // Exit Rect Conditional
        if (inExitRect) {
            ctx.fillText(`Exiting In`, 250, cnv.height/2 - 25);
            ctx.fillText(`${Math.ceil(5 - (now-startTime)/1000)}`, 250, cnv.height/2 + 25);
            if (now - startTime >= 5000) {
                gameState = "startScreen";
                innerGameState = "mainMenu";
            }
        }
        else {
            ctx.fillText("Level", 250, cnv.height/2 - 25);
            if (timeLeft <= 0) ctx.fillText("Complete", 250, cnv.height/2 + 25);
            if (innerGameState === "musicModeFail") ctx.fillText("Failed", 250, cnv.height/2 + 25);
        }
        // Redo Rect conditional
        if (inRedoRect) {
            ctx.fillText(`Restarting In`, 550, cnv.height/2 - 25);
            ctx.fillText(`${Math.ceil(5 - (now-startTime)/1000)}`, 550, cnv.height/2 + 25);
            if (now - startTime >= 5000) restartMusicMode();
        }
        else {
            ctx.fillText("Restart", 550, cnv.height/2 - 25);
            ctx.fillText("Level", 550, cnv.height/2 + 25);
        }
        // Reset StartTime
        if (!inExitRect && !inRedoRect) startTime = Date.now();
    }
    if (timeLeft > 0 && innerGameState !== "musicModeFail") startTime = Date.now();
}

function createBeam() {
    let beam = {
        type: "beam",
        variant: Math.random(),
        x: Math.random() * cnv.width,
        y: Math.random() * cnv.height,
        w: (Math.random() * 20) + 80,
        h: (Math.random() * 20) + 50,
        colorValue: 185,
        get color() {
            return `rgb(${this.colorValue}, ${this.colorValue}, ${this.colorValue})`;
        },
    }
    if (beam.variant > 0.5) beam.variant = "vertical";
    else beam.variant = "horizontal";
    return beam;
}

function createBomb() {
    let bomb = {
        type: "bomb",
        variant: Math.random(),
        x: Math.random() * cnv.width,
        y: Math.random() * cnv.height,
        r: (Math.random() * 30) + 20,
        colorValue: 185,
        get color() {
            return `rgb(${this.colorValue}, ${this.colorValue}, ${this.colorValue})`;
        },
    }
    return bomb;
}

function spawnAndDrawDanger() {
    // Enemy Spawning
    if (timestampIndex < music.timestamps.length) {
        if (music.var.currentTime >= music.timestamps[timestampIndex]) {
            allEnemies.unshift(createBeam());
            
            // determines the dangers x value based off the timestamp
            let xMulti = Math.floor(music.timestamps[timestampIndex]*100/cnv.width);
            allEnemies[0].x = (music.timestamps[timestampIndex]*100)-(cnv.width*xMulti);

            // determines the dangers y value based off the timestamp
            let yMulti = Math.floor(music.timestamps[timestampIndex]*100/cnv.height);
            allEnemies[0].y = (music.timestamps[timestampIndex]*100)-(cnv.height*yMulti);
            
            timestampIndex++;
        }
    }

    // Enemy Deleting
    allEnemies = allEnemies.filter(danger => danger.colorValue < 255);

    // Enemy Drawing
    allEnemies.forEach(danger => {
        ctx.fillStyle = danger.color;
        danger.colorValue += 0.25;
        
        if (danger.type === "beam") {
            if (danger.variant === "vertical") ctx.fillRect(danger.x, 0, danger.w, cnv.height);
            if (danger.variant === "horizontal") ctx.fillRect(0, danger.y, cnv.width, danger.h);
        }
        else if (danger.type === "bomb") drawCircle(danger.x, danger.y, danger.r);
    })
}

function musicCollisions() {
    allEnemies.forEach(danger => {
        if (timeLeft > 0 && innerGameState !== "musicModeFail" && danger.colorValue >= 250 && now - player.hit >= 1500 && !dash.activated && !(now - dash.lastEnded < 300)) {
            if (danger.type === "beam") {
                if ((danger.variant === "vertical" && player.x + player.radius >= danger.x && player.x - player.radius <= danger.x + danger.w) ||
                   (danger.variant === "horizontal" && player.y + player.radius >= danger.y && player.y - player.radius <= danger.y + danger.h)) {
                    player.lives--;
                    player.hit = Date.now();
                }
            }
            if (danger.type === "bomb") {
                if (Math.hypot(player.x - danger.x, player.y - danger.y) <= player.radius + danger.radius) {
                    player.lives--;
                    player.hit = Date.now();
                }
            }
        }
    })
    if (player.lives === 0 && innerGameState !== "musicModeFail" && innerGameState !== "mainMenu") {
        pauseAudio();
        innerGameState = "musicModeFail";
    }
    
    // Draws player lives
    ctx.textAlign = "center";
    ctx.font = "20px Impact";
    ctx.fillStyle = player.subColor;
    ctx.fillText(player.lives, player.x, player.y + 6.5);
}
