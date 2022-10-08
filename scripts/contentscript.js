/*
Loads the list of domainds to block from local storage.
Check the focusEnabled status to see if focus modes is turned on and sites need to be blocked.
*/
const blockList = [];
let focusEnabled = false;
loadItemsFromStorage();

function loadItemsFromStorage() {
  chrome.storage.sync.get(['domainBlocklist'], function(result) {
      if(result.domainBlocklist !== undefined){
          result.domainBlocklist.forEach(item => {
              blockList.push(item.domainName);
          });            
      }
      checkFocusStatus();
  });
}

function checkFocusStatus() {
  chrome.storage.local.get(['focusEnabled'], function(result) {      
    if(result.focusEnabled === undefined){
        focusEnabled = false;
    } else {
        focusEnabled = result.focusEnabled;
    }       
    checkblockedUrls(blockList);
  });
}

//BLOCK THE ENTIRE DOMAIN WITH THE FOLLOWING FUNCTION
function checkblockedUrls(blockList){

  if(focusEnabled === true) {
    var current = window.location.hostname;

    blockMatch = false;
    blockList.forEach(blockDomain => {
      let domainWhole = blockDomain.replace('http://', '');
      domainWhole = domainWhole.replace('https://', '');
      let domainParts = domainWhole.split('.');
      let domainPart;
      if(domainParts.length > 2){
        domainPart = domainParts[1];
      } else {
        domainPart = domainParts[0];
      }

      if(current.includes(domainPart) && blockMatch === false){
        blockMatch = true;
      }
    });

    if(blockMatch === true){
      // blocked site match.  Sent message to backgroud script to redirect to internal blocked site page
      chrome.runtime.sendMessage({blockedSite: "true"}, (response) => {
        console.log("This is the blocked site message sender");
        console.log(response.message);
      });
    }
  }
}
