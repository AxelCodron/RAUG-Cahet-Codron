const blackScreenElement = document.getElementById('blackscreen');
const introText = document.getElementById('intro-text');

function showIntroduction() {
  blackScreenElement.style.visibility = "visible";
  introText.style.visibility = "visible";
}

function hideIntroduction() {
  blackScreenElement.style.visibility = "hidden";
  introText.style.visibility = "hidden";
}

function waitForAnyKey(callback) {
  function onKeyDown(event) {
    window.removeEventListener("keydown", onKeyDown);
    if (callback) {
      callback(event);
    }
  }
  window.addEventListener("keydown", onKeyDown);
}

export { showIntroduction, hideIntroduction, waitForAnyKey };