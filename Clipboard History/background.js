console.log("Background (0.0.1)");

chrome.runtime.onMessage.addListener(reciever);

window.word = "";
window.totalEntries = 0;
window.showFav = false;
function reciever(request, sender, sendResponse){
    if(document.cookie.length == 0)
        document.cookie="Entry=0ž";


    //Get sent text
    window.word = request;
    window.totalEntries = entries();

    if(window.word.length > 0 && !doesExist()){
        //Increment the count
        window.totalEntries = entries()+1;

        //Add the data into the cookie
        document.cookie = document.cookie + "Info" + window.totalEntries + "=" + window.word + "ž";
        //Update the entry number
       updateEntry();
       location.reload();
    }

}

function entries(){
    var data = document.cookie.split("ž");
    var individualData = data[0].split("=");
    var count = 0;
    if(individualData[1] == NaN){
        return count;
    }
    var count = parseInt(individualData[1]);
    return count;
}


//Making sure there are no duplicates
function doesExist()
{
    var data = document.cookie.split("ž");
    var size = totalEntries;

    for(var x = 1; x <= size; x++){
        var individualData = data[x].split("=");
        var key = individualData[0];
        var value = individualData[1];
        
        if(value === window.word)
            return true;
    }
    
    return false;
}

function updateEntry()
{
    var cookie = document.cookie;
    totalEntriesLength = window.totalEntries+"";
    var startFrom = totalEntriesLength.length+7;
    cookie = "Entry" + "="+ window.totalEntries + "ž" + document.cookie.substring(startFrom)+"ž";
    cookie = cookie.replace(/ž+/g,"ž");
    document.cookie = cookie;

    console.log(cookie);
}
