console.log("inside");// DODGE.IO - JSAB.JS
function restartMusicMode() {
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
      player.x - player.raius >= rectX &&
      player.y + player.radius <= rectY + 200 &&
      player.y - player.radius >= rectY
    ) {
      ctx.fillText(`Exiting In ${Math.ceil(5 - (now-startTime)/1000)}`, cnv.width/2, cnv.height/2);
      if (now - startTime >= 5000) {
        gameState = "startScreen";
        innerGameState = "mainMenu";
      }
    }
    else {
      startTime = Date.now();
      ctx.fillText("Level Complete", cnv.width/2, cnv.height/2);
    }
  }
}

function musicCollisions() {

}
