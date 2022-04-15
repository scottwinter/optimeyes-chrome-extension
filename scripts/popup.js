let timeRemaining;
let countDownDate = 0;
let currentInterval;
let focusEnabled = false;


startOrResumeTimer();

checkFocusStatus();

let focusModeToggle = document.getElementById("flexSwitchCheckDefault");
function checkFocusStatus() {
//   chrome.runtime.sendMessage({ cmd: 'GET_FOCUS' }, response => {
//     focusEnabled = response.focus;
//     focusModeToggle.checked = focusEnabled;
//   });

  chrome.storage.local.get(['focusEnabled'], function(result) {      
    if(result.focusEnabled === undefined){
        focusEnabled = false;
    } else {
        focusEnabled = result.focusEnabled;
    }       
    focusModeToggle.checked = focusEnabled; 
});     
}

// Toggle on-demand focus mode
focusModeToggle.addEventListener("click", async () => {   
    // If the checkbox is checked, display the output text
    if (focusModeToggle.checked == true){
        chrome.storage.local.set({focusEnabled: true});
        // chrome.runtime.sendMessage({ cmd: 'TOGGLE_FOCUS', value : true });
    } else {
        chrome.storage.local.set({focusEnabled: false});
        // chrome.runtime.sendMessage({ cmd: 'TOGGLE_FOCUS', value : false });
    }
});

// Button to start the timer
let timerButton = document.getElementById("StartTimer");
timerButton.addEventListener("click", async () => {
    timerDuration = document.querySelector('#timerDuration').value;
    // let timerText = document.getElementById("testelement");
    // timerText.innerHTML = 'Timer has started.';
    // document.getElementById("testelement").innerHTML = 'Button clicked';
    document.getElementById("time").innerHTML = `${timerDuration}m 00s`;
    setTimerCountDown(timerDuration);
    startOrResumeTimer();
});

// Button to stop the timer
let stopTimerButton = document.getElementById("StopTimer");
stopTimerButton.addEventListener("click", async () => {
    chrome.storage.local.set({countdown: 0});
    clearInterval(currentInterval);
    focusModeToggle.checked = false;
    focusModeToggle.disabled = false;
    // chrome.runtime.sendMessage({ cmd: 'TOGGLE_FOCUS', value : false });
    chrome.storage.local.set({focusEnabled: false});

    timerDuration = document.querySelector('#timerDuration').value;

    document.getElementById("time").innerHTML = `${timerDuration}m 00s`;
});

// Settings button
let settingsButton = document.getElementById("settings");
settingsButton.addEventListener("click", async () => {
    chrome.tabs.create({
        url: 'settings.html'
      });
});

function startTimer(countDownDate) {    
    // chrome.runtime.sendMessage({ cmd: 'TOGGLE_FOCUS', value : true });
    chrome.storage.local.set({focusEnabled: true});
    focusModeToggle.checked = true;
    focusModeToggle.disabled = true;
    focusModeToggle
    currentInterval = setInterval(function() {
        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("time").innerHTML = minutes + "m " + seconds + "s ";        

        // If the count down is finished, write some text
        if (distance <= 0) {
            clearInterval(currentInterval);
            // chrome.runtime.sendMessage({ cmd: 'TOGGLE_FOCUS', value : false });
            chrome.storage.local.set({focusEnabled: false});
            focusModeToggle.checked = false;
            document.getElementById("time").innerHTML = 'Focus time ended.';
        }
    }, 1000);
}

// Check local storage paramater for a running timer and update UI based on stored time
function startOrResumeTimer() {
    chrome.storage.local.get(['countdown'], function(result) {
        if(result){
            countDownDate = result.countdown;
        }

        if (countDownDate > new Date().getTime()) {

            let now = new Date().getTime();

            // Find the distance between now and the count down date
            let distance = countDownDate - now;

            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            document.getElementById("time").innerHTML = minutes + "m " + seconds + "s ";
            startTimer(countDownDate);
        } else {
            // document.getElementById("testelement").innerHTML = 'storage value not set';
            document.getElementById("time").innerHTML = 'Please start new focus time. ';
        }
    });
}

// Calculate the countdown time and store value in local storage
function setTimerCountDown(minutes) {
    milliseconds = minutes * 60 * 1000;
    countDownDate = new Date().getTime() + milliseconds;
    chrome.storage.local.set({countdown: countDownDate});
}