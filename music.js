console.log("drawEndLevel");// DODGE.IO - JSAB.JS
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
    ctx.fillRect(cnv.width/2, cnv.height/2, 100, 100);

    dist = Math.hypot(player.x - cnv.width/2, player.y - cnv.height/2);

    if (dist + player.radius <= 100) {

    }

    if (player.x + player.radius < cnv.width/2 + 100) {
      
    }
  }
}

function musicCollisions() {

}
