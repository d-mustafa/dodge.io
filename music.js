console.log("danger");// DODGE.IO - JSAB.JS
function restartMusicMode() {
  allEnemies = [];
  volume = Math.floor((settings.volumeSliderX - 165) / 1.5);
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
    ctx.fillStyle = "white";
    ctx.font = "30px Verdana";
    if (
      player.x + player.radius <= rectX + 200 && 
      player.x - player.radius >= rectX &&
      player.y + player.radius <= rectY + 200 &&
      player.y - player.radius >= rectY
    ) {
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
    x: Math.random() * cnv.width,
    width: (Math.random() * 80) + 20,
    colorValue: 185,
    get color() {
      return `rgb(${this.colorValue}, ${this.colorValue}, ${this.colorValue})`;
    },
  }
  return beam;
}

function createBomb() {
  let bomb = {
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
    [2, 3, 3.5, 4, 4.5].forEach(timeStamp => {
        if (music.var.currentTime >= timeStamp - 0.02 && music.var.currentTime <= timestamp + 0.02) {
            allEnemies.push(createBeam());
        }
    })
  
    allEnemies.forEach(danger => {
        ctx.fillStyle = danger.color;
        danger.colorValue += 0.5;
        ctx.fillRect(danger.x, 0, danger.width, cnv.height);
    })
}

function musicCollisions() {

}
