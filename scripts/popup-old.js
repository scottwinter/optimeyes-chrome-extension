// function startTimer(duration, display) {
//     var timer = duration, minutes, seconds;
//     let focusMessageText = document.getElementById("focusMessage");
//     document.getElementById("focusMessage").innerHTML = "In Focus Time";
//     var interval = setInterval(function () {
//         minutes = parseInt(timer / 60, 10);
//         seconds = parseInt(timer % 60, 10);

//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;

//         display.textContent = minutes + ":" + seconds;

//         if (--timer < 0) {
//             timer = duration;
//         }
//         if (minutes == 0 && seconds == 0) {
//             document.getElementById("focusMessage").innerHTML = "Focus time has ended";
//             clearInterval(interval);
//         }
//     }, 1000);
// }

// let timerButton = document.getElementById("StartTimer");

// timerButton.addEventListener("click", async () => {
//     var fiveMinutes = 60 * 1,
//         display = document.querySelector('#time');
//     startTimer(fiveMinutes, display);
//   });




  // Call this when the pop-up is shown
chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
    if (response.time > 0) {
        const countDownDate = response.time;

        if(countDownDate > 0){
            let now = new Date().getTime();

            // Find the distance between now and the count down date
            let distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            // var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            document.getElementById("time").innerHTML = minutes + "m " + seconds + "s ";      
        }


        startTimer(countDownDate)
    } else {
        document.getElementById("time").innerHTML = 'Focus time ended.';
    }
});

let timeRemaining;
let countDownDate;

function startTimer(countDownDate) {
    
    let x = setInterval(function() {

        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        // var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("time").innerHTML = minutes + "m " + seconds + "s ";        

        // If the count down is finished, write some text
        if (distance <= 0) {
            clearInterval(x);
            document.getElementById("time").innerHTML = 'Focus time ended.';
        }
    }, 1000);

}

function startTime() {
    let timerText = document.getElementById("testelement");
    // timerText.innerHTML = 'Timer has started.';
    chrome.runtime.sendMessage({ cmd: 'START_TIME' }, response => {
        countDownDate = response.time;
        // timerText.innerHTML = 'Response received:  ' + response.time;
        startTimer(countDownDate);
    });
}

let timerButton = document.getElementById("StartTimer");

timerButton.addEventListener("click", async () => {
    // let timerText = document.getElementById("testelement");
    // timerText.innerHTML = 'Timer has started.';
    document.getElementById("time").innerHTML = '5m 00s';
    startTime();
});