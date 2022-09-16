/*
Loads the list of domainds to block from local storage.
Check the focusEnabled status to see if focus modes is turned on and sites need to be blocked.

TODO
Try to overlay site rather than wiping out the HTML
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
  // chrome.storage.session.get(['focusEnabled'], function(result) {      
  //   if(result.focusEnabled === undefined){
  //       focusEnabled = false;
  //   } else {
  //       focusEnabled = result.focusEnabled;
  //   }       
  // });
  // chrome.runtime.sendMessage({ cmd: 'GET_FOCUS' }, response => {
  //   focusEnabled = response.focus;
  // });

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

      // TODO send message to background script to redirct to internall blocked page.


      // var blockPageContents = 
      // '<html><head>'+
      // '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">'+
      // '<link rel="stylesheet" href="css/style.css" />'+
      // '<title>Focus Companion</title></head><body><h1>You are in focus mode - With document.write()</h1>'+
      // '<p>This site is blocked while in focus mode.  Please get back to work.</p></body></html>';

      
      
      
      // TODO randomly select quote text from list - LATEST CODE HERE
      // var quoteText = '"A year from now you may wish you had started today." - Karen Lamb';
      // var blockPageContents = 
      // '<!DOCTYPE html><html lang="en"><head>'+
      // '<meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">'+
      //     // '<script src="../assets/fontawesome/js/all.js"></script>'+
      //     '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">'+
      //     '<link rel="stylesheet" href="../css/blocksitestyle.css" />'+
      //     '<style>html {text-align: center;font-family: Arial, Helvetica, sans-serif;}'+
      //     '.container {box-sizing: border-box;padding: 16px;}'+
      //     'h1 {padding-top: 50px;}'+
      //     '#quote {font-size: 2em;padding-top: 50px;}'+
      //     '#note {font-size: 1em;padding-top: 20px;}</style>'+
      //     '<title>Focus Companion</title>'+
      // '</head><body>'+
      //     '<h1><i class="fa-solid fa-ban"></i>Don\'t Get Distracted From Your Goals<i class="fa-solid fa-ban"></i></h1>'+
      //     '<h3>This site is blocked while focus mode is on</h2>'+
      //     `<div id="quote">${quoteText}</div>`+
      //     '<div id="note"><i class="fa-solid fa-comment"></i>If you feel this site should not be blocked, open the extention, visit the settings page and update the blocked list.</div>'+
      // '</body></html>';


      // document.open();
      // document.write(blockPageContents);
      // document.close();
      // document.documentElement.scrollTop = 0;

    }
  }
}


// //BLOCK WORDS
// findString = function findText(text) {
//   if(window.find(text)){
//     document.documentElement.innerHTML = '';
//     document.documentElement.innerHTML = 'This site is blocked (findString)';
//     document.documentElement.scrollTop = 0;
//   };
// }

// findString("stack");

// //BLOCK THE PARTIAL DOMAINS
// findURL = function changeURL(text){
//   var current = window.location.href;
//   if(current === text){
//     window.location.replace("https://www.google.com");
//   }
// }



// findURL("https://www.quora.com/");
// changeAllURL("https://www.facebook.com/");

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//       // listen for messages sent from background.js
//       if (request.message === 'hello!') {
//         console.log(request.url) // new url is now in content scripts!
//       }
//   });