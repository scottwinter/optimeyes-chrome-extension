// let timerID;
// let timerTime;

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.cmd === 'START_TIMER') {
//     timerTime = new Date(request.when);
//     timerID = setTimeout(() => {
//        // the time is app, alert the user.
//     }, timerTime.getTime() - new Date());
//     sendResponse({ time: ''});
//   } else if (request.cmd === 'GET_TIME') {
//     sendResponse({ time: timerTime });
//   }
// });

let countDownDate = 0;
let now;
let distance;

let focusEnabled = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.cmd === 'TOGGLE_FOCUS') {       
        focusEnabled = request.value;  
        sendResponse({ focus: focusEnabled })      
    }

    if (request.cmd === 'GET_FOCUS') {
        sendResponse({ focus: focusEnabled })
    }

    if (request.cmd === 'START_TIME') {
        // if(countDownDate === 0 ){
            countDownDate = new Date().getTime() + 300000;
        // }
        
        // Update the count down every 1 second
        let x = setInterval(function() {

            // Get today's date and time
            now = new Date().getTime();

            // Find the distance between now and the count down date
            distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            // var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            // document.getElementById("demo").innerHTML = days + "d " + hours + "h "
            // + minutes + "m " + seconds + "s ";
            console.log('Distance value:  ' + distance);
            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                countDownDate = 0;
                // document.getElementById("demo").innerHTML = "EXPIRED";
            }
        }, 1000);

        sendResponse({ time: countDownDate});
        
    } else if (request.cmd === 'GET_TIME') {

       

        if(distance < 0){
            countDownDate = 0;
        }
        sendResponse({ time: countDownDate });
    }

});