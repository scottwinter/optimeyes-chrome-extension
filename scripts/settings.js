
class Domain {
    constructor(domainName, domainId) {
        this.domainName = domainName;
        this.domainId = domainId;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayDomains() {
        let domains;
        chrome.storage.local.get(['domainBlocklist'], function(result) {      
            console.log("result form storage: " + result);  
            if(result.domainBlocklist === undefined){
                domains = [];
            } else {
                domains = result.domainBlocklist;
            }    
            
            domains.forEach((domain) => UI.addDomainToList(domain));
        });
    }

    static addDomainToList(domain) {
        const list = document.querySelector('#domain-list');
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${domain.domainName}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteDomain(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#domain').value = '';
        // document.querySelector('#domainId').value = '';
    }
}

let domains;

// Store Class: Handles Storage
class Store {
    static getDomains() {      
        chrome.storage.local.get(['domainBlocklist'], function(result) {      
            if(result.domainBlocklist === undefined){
                domains = [new Domain("domain 1", "1")];
            } else {
                domains = result.domainBlocklist;
            }        
        });      
    }

    static addDomain(domain) {
        chrome.storage.local.get(['domainBlocklist'], function(result) {      
            console.log("result form storage: " + result);  
            if(result.domainBlocklist === undefined){
                domains = [];
            } else {
                domains = result.domainBlocklist;
            }    
            
            domains.push(domain);
            chrome.storage.local.set({domainBlocklist: domains});
        });      
    }

    static removeDomain(domainName) {
        chrome.storage.local.get(['domainBlocklist'], function(result) {      
            if(result.domainBlocklist === undefined){
                domains = [];
            } else {
                domains = result.domainBlocklist;
            }    
            
            domains.forEach((domain, index) => {
                if(domain.domainName === domainName) {
                    domains.splice(index, 1);
                }
            });
            chrome.storage.local.set({domainBlocklist: domains});
        });   
    }
}



// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayDomains);

// Event: Add a Book
document.querySelector('#domain-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const domainName = document.querySelector('#domain').value;
    // const domainId = document.querySelector('#domainId').value;

    // Validate
    if(domainName === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Clean up and format the domain to be saved
        let domainNameTrim = domainName.trim();
        let domainWhole = domainNameTrim.replace('http://', '');
        domainWhole = domainWhole.replace('https://', '');
        let domainParts = domainWhole.split('.');
        let domainPart;
        if(domainParts.length > 2){
          domainPart = domainParts[1];
        } else {
          domainPart = domainParts[0];
        }

        // Instatiate book
        const domain = new Domain(domainPart, null);

        // Add Book to UI
        UI.addDomainToList(domain);

        // Add book to store
        Store.addDomain(domain);

        // Show success message
        UI.showAlert('Domain Added', 'success');

        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove a Book
document.querySelector('#domain-list').addEventListener('click', (e) => {
// Remove book from UI
    UI.deleteDomain(e.target);

    // Remove book from store
    Store.removeDomain(e.target.parentElement.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Domain Removed', 'success');
});

document.querySelector('#clear').addEventListener('click', (e) => {
    domains = [];
    chrome.storage.local.set({domainBlocklist: domains}, function() {
        UI.displayDomains();
        console.log('List cleared.');
    });
});











// const blockArray = [];

// loadItemsFromStorage();

// // Settings button
// let addButton = document.getElementById("addToBlockList");
// addButton.addEventListener("click", async () => {
//     let domainToAdd = document.getElementById("domainToAdd").value;

//     blockArray.push(domainToAdd);

//     populateSettings();
//     // let blockListUl = document.getElementById("blockList");
//     // const li = document.createElement("li");
//     // // + '<button type="button" class="btn btn-secondary" id="removeItem">Remove</button>'
//     // li.appendChild(document.createTextNode(domainToAdd));
//     // li.setAttribute("index", blockArray.length);
//     // blockListUl.appendChild(li);

//     // document.getElementById("testing").innerHTML = 'Array elements: ' + blockArray.length;
    
// });


// let removeButton = document.getElementById("clearItems");
// removeButton.addEventListener("click", async () => {
//     let blockListUl = document.getElementById("blockList");
//     while (blockListUl.firstChild) {
//         blockListUl.removeChild(blockListUl.firstChild);
//     }
    
//     blockArray.length = 0;
// });



// let saveButton = document.getElementById("save");
// saveButton.addEventListener("click", async () => {
//     console.log("Items saved to storage.");
//     chrome.storage.local.set({domainBlocklist: blockArray});
// });


// function loadItemsFromStorage() {
//     chrome.storage.local.get(['domainBlocklist'], function(result) {
//         console.log("Items retrieved from storage.");
//         console.log("Items: " + result.domainBlocklist);
//         if(result){
//             result.domainBlocklist.forEach(item => {
//                 console.log("Adding items to array,  item " + item);
//                 blockArray.push(item);
//             });            
//         }
//         populateSettings();
//     });

// }

// function populateSettings() {
//     let blockListUl = document.getElementById("blockList");

//     console.log('Inside populateSettings()');

//     while (blockListUl.firstChild) {
//         blockListUl.removeChild(blockListUl.firstChild);
//     }

//     console.log('Inside populateSettings() after clear list items');
//     blockArray.forEach(item => {
//         console.log('Item in forEach: ' + item);
//         const li = document.createElement("li");
//         // + '<button type="button" class="btn btn-secondary" id="removeItem">Remove</button>'
//         li.appendChild(document.createTextNode(item));
//         blockListUl.appendChild(li);
//     });
//     console.log('Item added to array:  Array size = ' + blockArray.length);
// }