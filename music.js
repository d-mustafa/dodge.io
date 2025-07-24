console.log("alarm9 volume");// DODGE.IO - JSAB.JS
function restartMusicMode() {
  if (music.name === "Alarm 9") {
    alarm9.currentTime = 0;
    alarm9.volume = volume/100;
    music.promise = alarm9.play();
    music.duration = alarm9.duration;
  }

  startTime = Date.now();
  currentTime = ((now-startTime) / 1000).toFixed(2);
  timeLeft = (music.duration - currentTime).toFixed(2);
  dash.lastEnded = 0;
  shockwave.lastEnded = 0;
  gameState = "musicMode";
}

function pauseAudio(audio) { // Pause music without causing errors
  if (music.promise !== undefined) {
    music.promise.then(_ => {
      audio.pause();
    })
    .catch(error => {
      console.warn(error);
    });
  }
}

function musicCollisions() {

}
