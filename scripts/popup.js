let timeRemaining;
let countDownDate = 0;
let currentInterval;
let focusEnabled = false;
let timerValue;
let defaultTimerValue = 1;

onPageLoad();
// document.querySelector("#StartTimer")

function onPageLoad() {
    chrome.storage.local.get(['startingtTimerValue'], function(result) {      
        if(result.startingtTimerValue === undefined){
            timerValue = defaultTimerValue;
        } else {
            timerValue = result.startingtTimerValue;
        } 
        // for testing only
        timerValue = defaultTimerValue;
        displayTimer(timerValue, 0);        
        checkFocusStatus();   
        startOrResumeTimer();
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
    createTimerAlarm(timerValue);
    setTimerCountDown(timerValue);
    startOrResumeTimer();
});

// Button to stop the timer
let stopTimerButton = document.getElementById("StopTimer");
stopTimerButton.addEventListener("click", async () => {
    chrome.storage.local.set({focusTimerStarted: true});
    chrome.alarms.clear("timerAlarm");
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
});

// Button to set custom time - 15 minutes
let minuteButton30 = document.getElementById("30minutes");
minuteButton30.addEventListener("click", async () => {
    chrome.storage.local.set({startingtTimerValue: 30});
    onPageLoad();
});

// Button to set custom time - 15 minutes
let minuteButton45 = document.getElementById("45minutes");
minuteButton45.addEventListener("click", async () => {
    chrome.storage.local.set({startingtTimerValue: 45});
    onPageLoad();
});

// Button to set custom time - 15 minutes
let minuteButton60 = document.getElementById("60minutes");
minuteButton60.addEventListener("click", async () => {
    chrome.storage.local.set({startingtTimerValue: 60});
    onPageLoad();
});

// Button to set custom time - 15 minutes
let minuteButton120 = document.getElementById("120minutes");
minuteButton120.addEventListener("click", async () => {
    chrome.storage.local.set({startingtTimerValue: 120});
    onPageLoad();
});

function createTimerAlarm(timerDuration) {
    chrome.alarms.create("timerAlarm", {delayInMinutes: timerDuration} );
}

function startTimer(countDownDate) {    
    chrome.storage.local.set({focusEnabled: true});
    
    updateFocusMode(true, true);  
    // focusModeToggle
    currentInterval = setInterval(function() {
        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        let minutes = Math.floor(distance / 60000);
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

            let minutes = Math.floor(distance / 60000);
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
    var focusModeLabel = document.querySelector("#turn-focus-on-label");
    if(focusStatus === true) {
        focusModeStatus.innerHTML = "On"
        focusModeLabel.innerHTML = "Distracting websites are blocked."
    } else {
        focusModeStatus.innerHTML = "Off"        
        focusModeLabel.innerHTML = "Use the toggle or timer to block distracting websites."
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


function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}