
let quoteArray = [];
loadQuotes();
randomQuotes();

function randomQuotes(){
    document.querySelector("#quote").innerHTML = quoteArray[Math.floor(Math.random() * quoteArray.length)];
    // Generate random quote from list;

}

function loadQuotes(){
    quoteArray = [
        "\"A year from now you may wish you had started today.\" - Karen Lamb",
        "\"When you have a dream, you've got to grab it and never let go.\" - Carol Burnett",
        "\"The bad news is time flies. The good news is you're the pilot.\" - Michael Altshuler",
        "\"Success is not final, failure is not fatal: it is the courage to continue that counts.\" - Winston Churchill",
        "\"I am experienced enough to do this. I am knowledgeable enough to do this. I am prepared enough to do this. I am mature enough to do this. I am brave enough to do this.\" - Alexandria Ocasio-Cortez",
        "\"No matter what people tell you, words and ideas can change the world.\" - Robin Williams",
        "\"I'm not going to continue knocking that old door that doesn't open for me. I'm going to create my own door and walk through that.\" - Ava DuVernay"
    ]
}