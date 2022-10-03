let timeRemaining;
let countDownDate = 0;
let currentInterval;
let focusEnabled = false;
let timerValue;
let defaultTimerValue = 1;

onPageLoad();
document.querySelector("#StartTimer")

function onPageLoad() {
    chrome.storage.local.get(['startingtTimerValue'], function(result) {      
        if(result.startingtTimerValue === undefined){
            timerValue = defaultTimerValue;
        } else {
            timerValue = result.startingtTimerValue;
        } 
        // for testing only
        // timerValue = defaultTimerValue;
        displayTimer(timerValue, 0);
        startOrResumeTimer();
        checkFocusStatus();   
    });    
}

// Check focus status on page load and set UI elements accordingly
function checkFocusStatus() {
  chrome.storage.local.get(['focusEnabled'], function(result) {      
    if(result.focusEnabled === undefined){
        focusEnabled = false;
    } else {
        focusEnabled = result.focusEnabled;
    }   
    updateFocusMode(focusEnabled, false);    
});     
}

// Toggle on-demand focus mode
let focusModeToggle = document.getElementById("focusToggle");
focusModeToggle.addEventListener("click", async () => {   
    // If the checkbox is checked, display the output text
    if (focusModeToggle.checked == true){
        chrome.storage.local.set({focusEnabled: true});
        updateFocusMode(true, false)
    } else {
        chrome.storage.local.set({focusEnabled: false});
        updateFocusMode(false, false)
    }
});

// Button to start the timer
let startTimerButton = document.getElementById("StartTimer");
startTimerButton.addEventListener("click", async () => {
    chrome.storage.local.set({focusTimerStarted: true});
    startTimerButton.style.display = "none";
    document.querySelector("#StopTimer").style.display = "inline";
    setTimerCountDown(timerValue);
    startOrResumeTimer();
});

// Button to stop the timer
let stopTimerButton = document.getElementById("StopTimer");
stopTimerButton.addEventListener("click", async () => {
    chrome.storage.local.set({focusTimerStarted: true});
    stopTimerButton.style.display = "none";
    document.querySelector("#StartTimer").style.display = "inline";
    chrome.storage.local.set({countdown: 0});
    clearInterval(currentInterval);
    updateFocusMode(false, false);  
    
    chrome.storage.local.set({focusEnabled: false});
    timerDuration = timerValue;
    displayTimer(timerDuration, 0);
});

// Button to set custom time - 15 minutes
let minuteButton15 = document.getElementById("15minutes");
minuteButton15.addEventListener("click", async () => {
    chrome.storage.local.set({startingtTimerValue: 15});
    onPageLoad();
    // displayTimer(15, 0);
});

// Button to set custom time - 15 minutes
let minuteButton30 = document.getElementById("30minutes");
minuteButton30.addEventListener("click", async () => {
    chrome.storage.local.set({startingtTimerValue: 30});
    onPageLoad();
    // displayTimer(15, 0);
});

// Button to set custom time - 15 minutes
let minuteButton45 = document.getElementById("45minutes");
minuteButton45.addEventListener("click", async () => {
    chrome.storage.local.set({startingtTimerValue: 45});
    onPageLoad();
    // displayTimer(15, 0);
});

// Button to set custom time - 15 minutes
let minuteButton60 = document.getElementById("60minutes");
minuteButton60.addEventListener("click", async () => {
    chrome.storage.local.set({startingtTimerValue: 60});
    onPageLoad();
    // displayTimer(15, 0);
});

// Settings button
// let settingsButton = document.querySelector("#settings");
// settingsButton.addEventListener("click", async () => {
//     chrome.tabs.create({
//         url: 'settings.html'
//       });
// });

function startTimer(countDownDate) {    
    chrome.storage.local.set({focusEnabled: true});
    
    updateFocusMode(true, true);  
    // focusModeToggle
    currentInterval = setInterval(function() {
        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        displayTimer(minutes, seconds);

        // If the count down is finished, write some text
        if (distance <= 0) {
            clearInterval(currentInterval);
            chrome.storage.local.set({focusEnabled: false});
            updateFocusMode(false, false);  
            displayTimer(timerValue, 0);
            stopTimerButton.style.display = "none";
            document.querySelector("#StartTimer").style.display = "inline";
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

            startTimerButton.style.display = "none";
            document.querySelector("#StopTimer").style.display = "inline";

            let now = new Date().getTime();

            // Find the distance between now and the count down date
            let distance = countDownDate - now;

            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            displayTimer(minutes, seconds);
            startTimer(countDownDate);
        } else {
            chrome.storage.local.set({focusTimerStarted: false});
            displayTimer(timerValue, 0);
        }
    });
}

// Calculate the countdown time and store value in local storage
function setTimerCountDown(minutes) {
    milliseconds = minutes * 60 * 1000;
    countDownDate = new Date().getTime() + milliseconds;
    chrome.storage.local.set({countdown: countDownDate});
}

function overlayOn() {
    document.getElementById("overlay").style.display = "block";
}
  
function overlayOff() {
    document.getElementById("overlay").style.display = "none";
}

// Utility - Update the focus toggle button and text based on status
function updateFocusMode(focusStatus, disable) {
    focusModeToggle.checked = focusStatus;
    focusModeToggle.disabled = disable;
    var focusModeStatus = document.querySelector("#focus-status");
    if(focusStatus === true) {
        focusModeStatus.innerHTML = "On"
    } else {
        focusModeStatus.innerHTML = "Off"
    }
}

// Utility - Format the timer display with two digits for both minutes and seconds
function displayTimer(minutes, seconds) {
    var secondsFormatted;
        var minutesFormatted;
        if(seconds < 10) {
            secondsFormatted = "0"+seconds;
        } else {
            secondsFormatted = seconds;
        }

        if(minutes < 10) {
            minutesFormatted = "0"+minutes;
        } else {
            minutesFormatted = minutes;
        }

        document.getElementById("timer").innerHTML = minutesFormatted + ":" + secondsFormatted;
}