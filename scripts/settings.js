
const blockArray = [];

loadItemsFromStorage();

// Settings button
let addButton = document.getElementById("addToBlockList");
addButton.addEventListener("click", async () => {
    let domainToAdd = document.getElementById("domainToAdd").value;

    blockArray.push(domainToAdd);

    populateSettings();
    // let blockListUl = document.getElementById("blockList");
    // const li = document.createElement("li");
    // // + '<button type="button" class="btn btn-secondary" id="removeItem">Remove</button>'
    // li.appendChild(document.createTextNode(domainToAdd));
    // li.setAttribute("index", blockArray.length);
    // blockListUl.appendChild(li);

    // document.getElementById("testing").innerHTML = 'Array elements: ' + blockArray.length;
    
});


let removeButton = document.getElementById("clearItems");
removeButton.addEventListener("click", async () => {
    let blockListUl = document.getElementById("blockList");
    while (blockListUl.firstChild) {
        blockListUl.removeChild(blockListUl.firstChild);
    }
    
    blockArray.length = 0;
});



let saveButton = document.getElementById("save");
saveButton.addEventListener("click", async () => {
    console.log("Items saved to storage.");
    chrome.storage.local.set({domainBlocklist: blockArray});
});


function loadItemsFromStorage() {
    chrome.storage.local.get(['domainBlocklist'], function(result) {
        console.log("Items retrieved from storage.");
        console.log("Items: " + result.domainBlocklist);
        if(result){
            result.domainBlocklist.forEach(item => {
                console.log("Adding items to array,  item " + item);
                blockArray.push(item);
            });            
        }
        populateSettings();
    });

}

function populateSettings() {
    let blockListUl = document.getElementById("blockList");

    console.log('Inside populateSettings()');

    while (blockListUl.firstChild) {
        blockListUl.removeChild(blockListUl.firstChild);
    }

    console.log('Inside populateSettings() after clear list items');
    blockArray.forEach(item => {
        console.log('Item in forEach: ' + item);
        const li = document.createElement("li");
        // + '<button type="button" class="btn btn-secondary" id="removeItem">Remove</button>'
        li.appendChild(document.createTextNode(item));
        blockListUl.appendChild(li);
    });
    console.log('Item added to array:  Array size = ' + blockArray.length);
}