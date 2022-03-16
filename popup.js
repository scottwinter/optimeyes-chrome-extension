function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    let focusMessageText = document.getElementById("focusMessage");
    document.getElementById("focusMessage").innerHTML = "In Focus Time";
    var interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
        if (minutes == 0 && seconds == 0) {
            document.getElementById("focusMessage").innerHTML = "Focus time has ended";
            clearInterval(interval);
        }
    }, 1000);
}

let timerButton = document.getElementById("StartTimer");

timerButton.addEventListener("click", async () => {
    var fiveMinutes = 60 * 1,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
  });