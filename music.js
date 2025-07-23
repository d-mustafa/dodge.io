// DODGE.IO - JSAB.JS
console.log("music")
function restartMusicMode() {
  alarmNine.currentTime = 0;
  if (difficulty.level === "alarmNine") {
    alarmNine.play();
    musicDuration = alarmNine.duration;
  }

  startTime = Date.now();
  currentTime = (now-startTime) / 1000;
  timeLeft = (musicDuration - currentTime).toFixed(2);
  dash.lastEnded = 0;
  shockwave.lastEnded = 0;
  gameState = "musicMode";
}

function pauseAudio(promise, audio) {
  // Pause music without causing errors
  if (promise !== undefined) {
    promise.then(_ => {
      audio.pause();
    })
    .catch(error => {
      console.warn(error);
    });
  }
}
