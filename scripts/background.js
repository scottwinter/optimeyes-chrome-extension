let countDownDate = 0;
let now;
let distance;

let focusEnabled = false;

chrome.runtime.onStartup.addListener(function () {
   // Clear local storage to reset when browser is closed and opened new.
    chrome.storage.local.clear(() => {
        console.log('All local storage data has been cleared.');
    });
});

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

chrome.alarms.onAlarm.addListener(function(alarm) {
    
    chrome.storage.local.set({focusEnabled: false});

    });
