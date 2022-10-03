let quoteArray = [];
let timeRemaining;
let countDownDate = 0;
let currentInterval;
let focusViaTimer;
let focusEnabled = false;
let timerValue;
let defaultTimerValue = 1;

loadQuotes();
randomQuotes();
onPageLoad();

function onPageLoad() {
    chrome.storage.local.get(['focusTimerStarted'], function(result) {   
        console.log("-- result: " + result);   
        console.log("-- result.focusTimerStarted: " + result.focusTimerStarted); 
        if(result.focusTimerStarted === undefined){
            console.log("--- focusTimerStarted value undefined.")
            focusViaTimer = false;
        } else {
            console.log("--- focusTimerStarted value defined.")
            focusViaTimer = result.focusTimerStarted;
        }

        if(focusViaTimer === false) {
            updateTimerText();  
        } 
        
        console.log("--- focusTimerStarted value: " + focusViaTimer);

        if(focusViaTimer === true) {
            chrome.storage.local.get(['startingtTimerValue'], function(result) {      
                if(result.startingtTimerValue === undefined){
                    timerValue = defaultTimerValue;
                } else {
                    timerValue = result.startingtTimerValue;
                } 
                // for testing only
                displayTimer(timerValue, 0);
                startOrResumeTimer();
            });  
        }  
    });      
}

function startTimer(countDownDate) {    
    chrome.storage.local.set({focusEnabled: true});
    
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
            displayTimer(timerValue, 0);
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
            displayTimer(minutes, seconds);
            startTimer(countDownDate);
        } else {
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

function updateTimerText() {
    document.getElementById("timer").innerHTML = "Focus Mode is on.";
    document.getElementById("time-remaining").innerHTML = "";    
}


function randomQuotes(){
    // generate randome number from 0 to array length -1
    var randomQuoteNum = Math.floor(Math.random() * quoteArray.length);
    // Get the quote string form array and update html
    document.querySelector("#quote").innerHTML = quoteArray[randomQuoteNum];
}

function loadQuotes(){
    quoteArray = [
        "\"A year from now you may wish you had started today.\" - Karen Lamb",
        "\"When you have a dream, you've got to grab it and never let go.\" - Carol Burnett",
        "\"The bad news is time flies. The good news is you're the pilot.\" - Michael Altshuler",
        "\"Success is not final, failure is not fatal: it is the courage to continue that counts.\" - Winston Churchill",
        "\"No matter what people tell you, words and ideas can change the world.\" - Robin Williams",
        "\"I'm not going to continue knocking on that old door that doesn't open for me. I'm going to create my own door and walk through that.\" - Ava DuVernay"
    ]
}