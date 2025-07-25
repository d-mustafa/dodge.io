console.log("beam variants");// DODGE.IO - MUSIC.JS
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
    if (timeLeft <= 0) {
        let rectX = (cnv.width/2 - 100);
        let rectY = (cnv.height/2 - 100);
        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fillRect(rectX, rectY, 200, 200);
        
        ctx.textAlign = "center";
        ctx.fillStyle = "rgb(235, 235, 235)";
        ctx.font = "30px Verdana";
        if (player.x + player.radius <= rectX + 200 && player.x - player.radius >= rectX &&
            player.y + player.radius <= rectY + 200 && player.y - player.radius >= rectY) {
            ctx.fillText(`Exiting In`, cnv.width/2, cnv.height/2 - 25);
            ctx.fillText(`${Math.ceil(5 - (now-startTime)/1000)}`, cnv.width/2, cnv.height/2 + 25);
            if (now - startTime >= 5000) {
                gameState = "startScreen";
                innerGameState = "mainMenu";
            }
        }
        else {
            startTime = Date.now();
            ctx.fillText("Level", cnv.width/2, cnv.height/2 - 25);
            ctx.fillText("Complete", cnv.width/2, cnv.height/2 + 25);
        }
    } else startTime = Date.now();
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
        if (timeLeft > 0 && danger.colorValue >= 250 && now - player.hit >= 1500 && !dash.activated && !(now - dash.lastEnded < 300)) {
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
    // Draws player lives
    ctx.textAlign = "center";
    ctx.font = "20px Impact";
    ctx.fillStyle = player.subColor;
    ctx.fillText(player.lives, player.x, player.y + 6.5);
}
