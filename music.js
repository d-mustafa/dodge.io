console.log("credits");// DODGE.IO - MUSIC.JS
function restartMusicMode() {
    allEnemies = [];
    player.lives = 3;
    player.hit = 0;
    volume = Math.floor((settings.volumeSliderX - 165) / 1.5);
    sfxVolume = Math.floor((settings.sfxSliderX - 152) / 1.5);
    sharpPop.volume = sfxVolume/100;
    music.var.volume = volume/100;
    music.var.currentTime = 0;
    music.promise = music.var.play();
    timestampIndex = 0;
    timeLeft = (music.var.duration - music.var.currentTime).toFixed(2);
    dash.lastEnded = 0;
    shockwave.lastEnded = 0;
    innerGameState = 'inMusicMode';
    gameState = "musicMode";
}

function pauseAudio(promise, audio) { // Pause music without causing errors
    if (promise !== undefined) {
        promise.then(_ => {
            audio.pause();
        })
        .catch(error => {
            console.warn(error);
        });
    }
}

function loopAudio() {
    if (music.var.currentTime === music.var.duration) {
        music.var.currentTime = 0;
        music.promise = music.var.play();
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
        
        // Loading Rect (now-starttime = time left in milliseconds, 200 = width, 3000 = max time in milliseconds)
        let sideLength = (now-startTime)*200/3000;
        if (inExitRect) {
            if (timeLeft <= 0) ctx.fillStyle = "rgb(0, 245, 0)";
            if (innerGameState === "musicModeFail") ctx.fillStyle = "rgb(245, 0, 0)";
            ctx.fillRect(exitX + (100-sideLength/2), exitY + (100-sideLength/2), sideLength, sideLength);
        } else if (inRedoRect) {
            ctx.fillStyle = music.subColor;
            ctx.fillRect(redoX + (100-sideLength/2), redoY + (100-sideLength/2), sideLength, sideLength);
        }
        
        ctx.textAlign = "center";
        ctx.font = "30px Verdana";
        ctx.fillStyle = "rgb(235, 235, 235)";

        // Exit Rect Conditional
        if (inExitRect) {
            ctx.fillText(`Exiting In`, 250, cnv.height/2 - 25);
            ctx.fillText(`${Math.ceil(3 - (now-startTime)/1000)}`, 250, cnv.height/2 + 25);
            if (now - startTime >= 3000) {
                music = {var: aNewStart,name: "A New Start", artist: "Thygan Buch",
                         color: "rgb(105, 105, 105)", subColor: "rgb(115, 115, 115)",};
                music.var.currentTime = 0;
                music.promise = music.var.play();
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
            ctx.fillText(`${Math.ceil(3 - (now-startTime)/1000)}`, 550, cnv.height/2 + 25);
            if (now - startTime >= 3000) restartMusicMode();
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
    let circle = {
        type: "circle",
        variant: Math.random(),
        x: Math.random() * cnv.width,
        y: Math.random() * cnv.height,
        r: (Math.random() * 20) + 100,
        colorValue: 185,
        get color() {
            return `rgb(${this.colorValue}, ${this.colorValue}, ${this.colorValue})`;
        },
        get linewidth() {
            return `${this.r/10}`;
        },
    }
    if (circle.variant > 0.5) circle.variant = "bomb";
    else circle.variant = "ring";
    return circle;
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
        else if (danger.type === "circle") {
            if (danger.variant === "bomb") drawCircle(danger.x, danger.y, danger.r);
            if (danger.variant === "ring") {
                ctx.linewidth = danger.linewidth;
                drawCircle(danger.x, danger.y, danger.r, "stroke");
            }
        }
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
                    sharpPop.currentTime = 0;
                    sharpPop.play();
                }
            }
            if (danger.type === "circle") {
                let distance = Math.hypot(player.x - danger.x, player.y - danger.y);
                if ((danger.variant === "bomb" && distance <= danger.r+player.radius) ||
                   (danger.variant === "ring" && distance <= danger.r+player.radius && distance >= danger.r-danger.linewidth-player.radius)) {
                    player.lives--;
                    player.hit = Date.now();
                    sharpPop.currentTime = 0;
                    sharpPop.play();
                }
            }
        }
    })
    if (player.lives === 0 && innerGameState !== "musicModeFail" && innerGameState !== "mainMenu") {
        pauseAudio(music.promise, music.var);
        innerGameState = "musicModeFail";
    }
    
    // Draws player lives
    ctx.textAlign = "center";
    ctx.font = "20px Impact";
    ctx.fillStyle = player.subColor;
    ctx.fillText(player.lives, player.x, player.y + 6.5);
}
