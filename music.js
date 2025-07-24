console.log("cnv.width/2, cnv.height/2");// DODGE.IO - JSAB.JS
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
    let rectX = cnv.width/4;
    let rectY = cnv.height/4;
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(rectX, rectY, 200, 200);

    // Find the closest point on the rectangle to the circle
    let closestX = Math.max(rectX, Math.min(player.x, rectX + 200));
    let closestY = Math.max(rectY, Math.min(player.y, rectY + 200));

    let dx = player.x - closestX;
    let dy = player.y - closestY;
    let distance = Math.hypot(dx, dy);
    
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "30px Verdana";

    if (distance <= circle.radius*2) {
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
