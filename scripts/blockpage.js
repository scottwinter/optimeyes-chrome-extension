
let quoteArray = [];
loadQuotes();
randomQuotes();

function randomQuotes(){
    // generate randome number from 0 to array length -1
    var randomQuoteNum = Math.floor(Math.random() * quoteArray.length);
    // Get the quote string form array and update html
    document.querySelector("#quote").innerHTML = quoteArray[randomQuoteNum];
}

function loadQuotes(){
    quoteArray = [
        "\"A year from now you may wish you had started today.\" - Karen Lamb",
        "\"When you have a dream, you've got to grab it and never let go.\" - Carol Burnett",
        "\"The bad news is time flies. The good news is you're the pilot.\" - Michael Altshuler",
        "\"Success is not final, failure is not fatal: it is the courage to continue that counts.\" - Winston Churchill",
        "\"No matter what people tell you, words and ideas can change the world.\" - Robin Williams",
        "\"I'm not going to continue knocking that old door that doesn't open for me. I'm going to create my own door and walk through that.\" - Ava DuVernay"
    ]
}