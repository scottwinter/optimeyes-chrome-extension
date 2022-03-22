
//BLOCK WORDS
findString = function findText(text) {
  if(window.find(text)){
    document.documentElement.innerHTML = '';
    document.documentElement.innerHTML = 'This site is blocked (findString)';
    document.documentElement.scrollTop = 0;
  };
}

findString("WordToBlock");

//BLOCK THE PARTIAL DOMAINS
findURL = function changeURL(text){
  var current = window.location.href;
  if(current === text){
    window.location.replace("https://www.google.com");
  }
}

//BLOCK THE ENTIRE DOMAIN WITH THE FOLLOWING FUNCTION
findAllURL = function changeAllURL(text){
  var current = window.location.href;
  if(current.startsWith(text)){
    document.documentElement.innerHTML = '';
    document.documentElement.innerHTML = '<html><head><title>Focus Companion</title></head><body><h1>Domain is blocked</h1></body></html>';
    document.documentElement.scrollTop = 0;
  }
}


findURL("https://www.quora.com/");
findAllURL("https://www.facebook.com/");

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//       // listen for messages sent from background.js
//       if (request.message === 'hello!') {
//         console.log(request.url) // new url is now in content scripts!
//       }
//   });