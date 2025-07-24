console.log("startTIme");// DODGE.IO - JSAB.JS
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
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(cnv.width/2, cnv.height/2, 200, 200);

    // Find the closest point on the rectangle to the circle
    let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
    // Calculate the distance from the circle's center to this point
    let dx = circle.x - closestX;
    let dy = circle.y - closestY;
    let distance = Math.hypot(dx, dy);
    
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "30px Verdana";

    if (distance <= circle.radius*2) {
      ctx.fillText(`Exiting In ${Math.ceil(5 - (now-startTime)/1000)}`, x, y);
      if (now - startTime >= 5000) {
        gameState = "startScreen";
        innerGameState = "mainMenu";
      }
    }
    else {
      startTime = Date.now();
      ctx.fillText("Level Complete", x, y);
    }
  }
}

function musicCollisions() {

}
