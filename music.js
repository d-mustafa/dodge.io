console.log("w: 2, h: 1.5");// DODGE.IO - MUSIC.JS
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
    music.timestamps = [...music.backUpTS];
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
        let inExitRect = player.x + player.r <= exitX + 200 && player.x - player.r >= exitX && player.y + player.r <= exitY + 200 && player.y - player.r >= exitY;
        let redoX = 450;
        let redoY = (cnv.height/2 - 100);
        let inRedoRect = player.x + player.r <= redoX + 200 && player.x - player.r >= redoX && player.y + player.r <= redoY + 200 && player.y - player.r >= redoY;
        
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
        // Exit Rect Conditional
        ctx.fillStyle = "rgb(235, 235, 235)";
        if (inExitRect) {
            ctx.fillText(`Exiting In`, 250, cnv.height/2 - 25);
            ctx.fillText(`${Math.ceil(3 - (now-startTime)/1000)}`, 250, cnv.height/2 + 25);
            if (now - startTime >= 3000) {
                music = {var: aNewStart, name: "A New Start", artist: "Thygan Buch"};
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
        ctx.fillStyle = music.textColor;
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

function createBeam(variant="none") {
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
    if (variant !== "none") beam.variant = variant;
    allEnemies.unshift(beam);
    return beam;
}

function createCircle(variant="none") {
    let circle = {
        type: "circle",
        variant: Math.random(),
        x: Math.random() * cnv.width,
        y: Math.random() * cnv.height,
        r: (Math.random() * 40) + 80,
        colorValue: 185,
        get color() {
            return `rgb(${this.colorValue}, ${this.colorValue}, ${this.colorValue})`;
        },
        get lineWidth() {
            return this.r;
        },
    }
    if (circle.variant > 0.5) circle.variant = "bomb";
    else circle.variant = "ring";
    if (variant !== "none") circle.variant = variant;
    allEnemies.unshift(circle);
    return circle;
}

function createSpike(variant="none") {
    let spike = {
        type: "spike",
        variant: "none",
        x: Math.random() * cnv.width,
        y: Math.random() * cnv.height,
        r: (Math.random() * 10) + 10,
        speed: 2,
        launched: false,
        colorValue: 185,
        get color() {
            return `rgb(${this.colorValue}, ${this.colorValue}, ${this.colorValue})`;
        },
        get reachedWall() {
            if (this.colorValue >= 255) {
                if (this.x - this.r - 2 < 0 || this.x + this.r + 2 > cnv.width ||
                    this.y - this.r - 2 < 0 || this.y + this.r + 2 > cnv.height) {
                    return true
                }
            }
            else return false
        },
    }
    const rand = Math.random();
    if (rand < 0.25) spike.x = spike.r + 2;
    else if (rand < 0.5) spike.x = cnv.width - spike.r - 2;
    else if (rand < 0.75) spike.y = spike.r + 2;
    else if (rand < 1) spike.y = cnv.height - spike.r - 2;
    
    if (variant !== "none") spike.variant = variant;
    allEnemies.unshift(spike);
    return spike;
}

function spawnAndDrawDanger() {
    // Enemy Spawning
    if (music.timestamps.length > 0) {
        for (let i = music.timestamps.length-1; i >= 0; i--) {
            let timestamp = music.timestamps[i][0];
            let dangerType = music.timestamps[i][1];
            if (music.var.currentTime >= timestamp) {
                if (dangerType === "beam" || dangerType === "horizontal" || dangerType === "vertical") {
                    createBeam();
                    if (dangerType === "vertical") allEnemies[0].variant = "vertical";
                    else if (dangerType === "horizontal") allEnemies[0].variant = "horizontal";
                    
                    // determines the beams x value based off the timestamp
                    let xMulti = Math.floor(timestamp*100/cnv.width);
                    allEnemies[0].x = (timestamp*100)-(cnv.width*xMulti);
                    
                    // determines the beams y value based off the timestamp
                    let yMulti = Math.floor(timestamp*100/cnv.height);
                    allEnemies[0].y = (timestamp*100)-(cnv.height*yMulti);
                } else if (dangerType === "circle" || dangerType === "bomb" || dangerType === "ring") {
                    createCircle();
                    if (dangerType === "bomb") allEnemies[0].variant = "bomb";
                    else if (dangerType === "ring") allEnemies[0].variant = "ring";
        
                    // the circle's x and y will mimic the players
                    allEnemies[0].x = player.x;
                    allEnemies[0].y = player.y;
                } else if (dangerType === "spike") {
                    createSpike();

                    // spikes aim and shoot at the player
                }
                music.timestamps.splice(i, 1);
            }
        }
    }

    // Enemy Deleting
    function keepDanger(danger) {
        if (danger.colorValue < 255) return true;
        else if (danger.colorValue >= 255) {
            if (danger.type !== "spike") return false
            if (danger.type === "spike") {
                if (danger.reachedWall) return false
                else return true;
            }
        }
    }
    allEnemies = allEnemies.filter(danger => keepDanger(danger));

    // Enemy Drawing
    allEnemies.forEach(danger => {
        ctx.fillStyle = danger.color;
        ctx.strokeStyle = danger.color;
        if (danger.colorValue <= 255) danger.colorValue += 0.25;
        
        if (danger.type === "beam") {
            if (danger.variant === "vertical") ctx.fillRect(danger.x, 0, danger.w, cnv.height);
            else if (danger.variant === "horizontal") ctx.fillRect(0, danger.y, cnv.width, danger.h);
        }
        else if (danger.type === "circle") {
            if (danger.variant === "bomb") drawCircle(danger.x, danger.y, danger.r);
            else if (danger.variant === "ring") {
                ctx.lineWidth = danger.lineWidth;
                drawCircle(danger.x, danger.y, danger.r, "stroke");
            }
        }
        else if (danger.type === "spike") {
            drawCircle(danger.x, danger.y, danger.r);
            let w = 2;
            let h = 1.5;
            // Top Spike
            ctx.beginPath();
            ctx.moveTo(danger.x-danger.r/w, danger.y-danger.r/w);
            ctx.lineTo(danger.x, danger.y - danger.r*h);
            ctx.lineTo(danger.x+danger.r/w, danger.y-danger.r/w);
            ctx.fill();
            // Bottom Spike
            ctx.beginPath();
            ctx.moveTo(danger.x-danger.r/w, danger.y+danger.r/w);
            ctx.lineTo(danger.x, danger.y + danger.r*h);
            ctx.lineTo(danger.x+danger.r/w, danger.y+danger.r/w);
            ctx.fill();
            // Left Spike
            ctx.beginPath();
            ctx.moveTo(danger.x-danger.r/w, danger.y-danger.r/w);
            ctx.lineTo(danger.x-danger.r*h, danger.y);
            ctx.lineTo(danger.x-danger.r/w, danger.y+danger.r/w);
            ctx.fill();
            // Right Spike
            ctx.beginPath();
            ctx.moveTo(danger.x+danger.r/w, danger.y-danger.r/w);
            ctx.lineTo(danger.x+danger.r*h, danger.y);
            ctx.lineTo(danger.x+danger.r/w, danger.y+danger.r/w);
            ctx.fill();
            
            if (danger.colorValue >= 255 && !danger.launched) {
                const dx = player.x - danger.x;
                const dy = player.y - danger.y;
                const dist = Math.hypot(dx, dy);
                danger.movex = (dx/dist)*danger.speed;
                danger.movey = (dy/dist)*danger.speed;
                danger.facingAngle = Math.atan2(dx, dy);
                danger.launched = true;
            }
            
            if (danger.colorValue >= 255 && !danger.reachedWall) {
                danger.x += danger.movex;
                danger.y += danger.movey;
            }
        }
    })
}

function musicCollisions() {
    allEnemies.forEach(danger => {
        const distance = Math.hypot(player.x-danger.x, player.y-danger.y);
        if (timeLeft > 0 && innerGameState !== "musicModeFail" && danger.colorValue >= 250 &&
            now-player.hit >= 1500 && !dash.activated && now-dash.lastEnded >= 300) {
            if (danger.type === "beam") {
                if ((danger.variant === "vertical" && player.x+player.r >= danger.x && player.x-player.r <= danger.x+danger.w) ||
                   (danger.variant === "horizontal" && player.y+player.r >= danger.y && player.y-player.r <= danger.y+danger.h)) {
                    player.lives--;
                    player.hit = Date.now();
                    sharpPop.currentTime = 0;
                    sharpPop.play();
                }
            }
            if (danger.type === "circle") {
                if ((danger.variant === "bomb" && distance <= danger.r+player.r) ||
                   (danger.variant === "ring" && distance <= danger.r+danger.lineWidth/2+player.r &&
                    distance >= danger.r-danger.lineWidth/2-player.r)) {
                    player.lives--;
                    player.hit = Date.now();
                    sharpPop.currentTime = 0;
                    sharpPop.play();
                }
            }
            if (danger.type === "spike") {
                if (distance <= danger.r+player.r) {
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
