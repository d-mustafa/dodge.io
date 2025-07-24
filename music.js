console.log("restartMusicMode");// DODGE.IO - JSAB.JS
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

function musicCollisions() {

}
