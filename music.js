// DODGE.IO - JSAB.JS
function restartMusic() {
  alarmNine.currentTime = 0;
  if (difficulty.level === "alarmNine") alarmNine.play();
  
  gameState = "musicOn"
}
