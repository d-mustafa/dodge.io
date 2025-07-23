// DODGE.IO - JSAB.JS
console.log("music")
function restartMusicMode() {
  alarmNine.currentTime = 0;
  if (difficulty.level === "alarmNine") alarmNine.play();
  
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
