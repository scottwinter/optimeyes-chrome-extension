

const blockList = [
  'facebook',
  'netflix',
  'paramountplus',
  'twitter',
  'instagram',
  'pinterest',
  'pintrest'
]

let focusEnabled = false;
checkFocusStatus();


function checkFocusStatus() {
  chrome.runtime.sendMessage({ cmd: 'GET_FOCUS' }, response => {
    focusEnabled = response.focus;
    changeAllURL(blockList);
  });
}

//BLOCK THE ENTIRE DOMAIN WITH THE FOLLOWING FUNCTION
function changeAllURL(blockList){

  chrome.runtime.sendMessage({ cmd: 'GET_FOCUS' }, response => {
    focusEnabled = response.focus;
  });

  if(focusEnabled === true) {
    var current = window.location.hostname;

    blockMatch = false;
    blockList.forEach(blockDomain => {    
      if(current.includes(blockDomain) && blockMatch === false){
        blockMatch = true;
      }
    });

    if(blockMatch === true){
      document.documentElement.innerHTML = '';
      document.documentElement.innerHTML = 
      '<html><head><title>Focus Companion</title></head><body><h1>You are in focus mode</h1>'+
      '<p>This site is blocked while in focus mode.  Please get back to work.</p></body></html>';
      document.documentElement.scrollTop = 0;

      // Attempt to do a overlay of the blocked website

      // const el = document.createElement('div');
      // el.setAttribute(
      //   'style',
      //   'position: fixed; display: block; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 10;  cursor: pointer;',
      // );
      // el.setAttribute('id', 'blockedsite')
      // el.textContent = 'This site is blocked';

      // const body = document.body;
      // body.appendChild(el);
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