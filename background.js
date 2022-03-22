chrome.webRequest.onBeforeRequest.addListener(function(details) { 
    return {cancel: true}; 
},
{urls: ["*://*.google.com/*"]},
["blocking"]);



// chrome.tabs.onUpdated.addListener(
//     function(tabId, changeInfo, tab) {
//       // read changeInfo data and do something with it
//       // like send the new url to contentscripts.js
//       if (changeInfo.url) {
//         chrome.tabs.sendMessage( tabId, {
//           message: 'hello!',
//           url: changeInfo.url
//         })
//       }
//     }
//   );