
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
        chrome.storage.sync.get(['domainBlocklist'], function(result) {      
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
        <td class="align-right"><a href="#" class="btn btn-danger-custom btn-sm delete">X</a></td>
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
        div.className = `alert alert-fixed alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('#body-container');
        const form = document.querySelector('#blocked-site-table-header');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#domain').value = '';
    }
}

let domains;

// Storage Class: Handles Storage
class Storage {
    static getDomains() {      
        chrome.storage.sync.get(['domainBlocklist'], function(result) {      
            if(result.domainBlocklist === undefined){
                domains = [new Domain("domain 1", "1")];
            } else {
                domains = result.domainBlocklist;
            }        
        });      
    }

    static addDomain(domain) {
        chrome.storage.sync.get(['domainBlocklist'], function(result) {      
            console.log("result form storage: " + result);  
            if(result.domainBlocklist === undefined){
                domains = [];
            } else {
                domains = result.domainBlocklist;
            }    
            
            domains.push(domain);
            chrome.storage.sync.set({domainBlocklist: domains});
        });      
    }

    static removeDomain(domainName) {
        chrome.storage.sync.get(['domainBlocklist'], function(result) {      
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
            chrome.storage.sync.set({domainBlocklist: domains});
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

    // Validate
    if(domainName === '') {
        // UI.showAlert('Please fill in all fields', 'danger');
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

        let domains;
        chrome.storage.sync.get(['domainBlocklist'], function(result) {      
            if(result.domainBlocklist === undefined){
                domains = [new Domain("domain 1", "1")];
            } else {
                domains = result.domainBlocklist;
            }      
            
            let domainExists = false;
            for (let i = 0; i < domains.length; i++) {
                // check domain name is same as item in array
                if(domainPart.toLowerCase() === domains[i].domainName.toLowerCase()){
                    domainExists = true;
                    break;
                }
            }

            // If no matches, add domain to list
            if(domainExists === true) {
                UI.showAlert('Domain already exists in the block list', 'danger');
            } else {
                const domain = new Domain(domainPart.toLowerCase(), null);
            
                UI.addDomainToList(domain);
                Storage.addDomain(domain);
                UI.clearFields();
            }        
        }); 
    }
});

// Event: Remove a domain
document.querySelector('#domain-list').addEventListener('click', (e) => {
    UI.deleteDomain(e.target);
    Storage.removeDomain(e.target.parentElement.previousElementSibling.textContent);
});
