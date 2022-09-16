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

/* 
TODO save focusEnabled in local storage instead of background.js.  
Then in background.js, set the focusEnabled value in storage to false every time extension loads.
That way when the extension loads when the browser is opened, the value will be set back
to false so focus mode does not remain on after brower closing.

Need to test this out to see if it will work or if it will reset the focusEnabled to false ever
time the background scripe wakes up again.
*/

chrome.runtime.onStartup.addListener(function () {
    /* TODO set focusEnabled back to false when extension/browser loads.
    Set the false value in local storage.
    */
    chrome.storage.local.clear(() => {
        console.log('All local storage data has been cleared.');
    });
});

// chrome.tabs.query({
//         active: true,
//         lastFocusedWindow: true
//     }, 
//     function(tabs) {
//         // and use that tab to fill in out title and url
//         var tab = tabs[0];
//         console.log(tab.url);
//         // alert(tab.url);
//     }
// );

// SAMPLE CODE to get active tab URL change.
// Seems to work.  Maybe move domain check to this script/method
// chrome.tabs.onUpdated.addListener(
//     function(tabId, changeInfo, tab) {
//       // read changeInfo data and do something with it
//       // like send the new url to contentscripts.js
//       if (changeInfo.url) {
//         // chrome.tabs.sendMessage( tabId, {
//         //   message: 'hello!',
//         //   url: changeInfo.url
//         // })
//         // chrome.tabs.update(tabId, {url: "../blockpage.html"});
//         console.log(changeInfo.url);
//       }
//     }
//   );

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {      
    if (request.blockedSite === "true"){
        let currentTab = getCurrentTab();
        chrome.tabs.update(currentTab.id, {url: "../blockpage.html"});    
        console.log("This is the blocked site redirect in background script.");
        sendResponse({message: "site blocked"});
    }
    });


async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
    }

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