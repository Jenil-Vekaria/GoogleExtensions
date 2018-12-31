window.totalEntries = 0;
var page = chrome.extension.getBackgroundPage();
window.onload = function(){  
    console.log(document.cookie);

    //Get background page
    window.totalEntries = totalEntry();

    var data = document.cookie.split("ž");

    for(var x = 1; x <= window.totalEntries; x++){
        var individualData = data[x].split("=");
        var key = individualData[0].trim();
        var value = individualData[1];
        
        if(key != null && value != null){
          if(page.showFav){
            if(key.charAt(0) === 'F')
                appendNewBar(x,value,key);
          }else{
                var elem = document.getElementById("home")
                elem.style.color = "red";

                appendNewBar(x,value,key);
          }
            console.log("Key=" + key);
        }
    }

    if(!page.showFav){
        var elem = document.getElementById("home")
        elem.style.color = "#28a745";
    }else{
        var elem = document.getElementById("favourite")
        elem.style.color = "#ffc107";
        if(!document.cookie.includes("FInfo")){
            document.getElementById("mssg1").innerHTML = "Your favourite history is empty☹️";
            document.getElementById("mssg2").innerHTML = "Favourite something to see it here";
        }
    }

    if(page.word.length > 0){
        location.reload();
        page.word = "";
    }
}

function totalEntry(){
    var data = document.cookie.split("ž");
    var individualData = data[0].split("=");
    return parseInt(individualData[1]);
}

function appendNewBar(number,value,key,to){

    //Clear out the empty message
    document.getElementById("mssg1").innerHTML = "";
    document.getElementById("mssg2").innerHTML = "";

    var all = document.getElementById("all");

    //Make The Inner Div Class
    var singleData = document.createElement("div");
    singleData.className = "singleData";

    //Make Copy Button
    var copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.value="Info"+number;
    copyButton.className = "btn btn-success btn-sm";
    var copyWord = document.createTextNode("copy");
    copyButton.appendChild(copyWord);

    //Make Input
    var input = document.createElement("input");
    input.type = "text";
    input.id = "Info"+number;
    input.value = value;
    input.readOnly = true;

    //Make Delete Button
    var delButton = document.createElement("button");
    delButton.type = "button";
    delButton.value = "X"+number;
    delButton.className = "btn btn-danger btn-sm";
    var del= document.createElement("i");
    del.className = "material-icons";
    del.innerHTML = "clear";
    del.value = "X"+number;
    delButton.appendChild(del); 

    //Make Favourite Button
    var favButton = document.createElement("button");
    favButton.type = "button";
    favButton.className = "btn btn-warning btn-sm";
    favButton.value = "F"+number;
    var star = document.createElement("i");
    star.className = "material-icons";

    if(key.charAt(0) === 'F')
        star.innerHTML = "star";
    else
        star.innerHTML = "star_border";
    star.value = "F"+number;
    favButton.appendChild(star);  

    //Make Download Button
    var downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.value = "D"+number;
    downloadButton.className = "btn btn-primary btn-sm";
    var arrow = document.createElement("i");
    arrow.className = "material-icons";
    arrow.innerHTML = "arrow_downward";
    arrow.value = "D"+number;
    downloadButton.appendChild(arrow);  

    singleData.appendChild(copyButton);
    singleData.appendChild(input);
    singleData.appendChild(delButton);
    singleData.appendChild(favButton);
    singleData.appendChild(downloadButton);

    all.insertBefore(singleData,all.childNodes[0]);

}

document.addEventListener('DOMContentLoaded', function(){
    var parentButton = document.querySelector("#all");
    parentButton.addEventListener("click",action, false);

    var home = document.querySelector("#home");
    home.addEventListener("click",displayHome, false);

    var favourite = document.querySelector("#favourite");
    favourite.addEventListener("click",displayFavourite, false);

    var download = document.querySelector("#download");
    download.addEventListener("click",downloadAll, false);

    var clear = document.querySelector("#clear");
    clear.addEventListener("click",clearAll, false);
});

function action(e){

    if(e.target !== e.currentTarget){
        var string = e.target.value;
        if(string != null){
            if(string.charAt(0) === 'D')
                download(string.substring(1));
            else if(string.charAt(0) === 'X')
                   deleteInfo(string);
            else if(string.charAt(0) === 'F')
                    Favourite(string.substring(1));
            else
                copy(string);
        }
    }

    e.stopPropagation();
}


function displayFavourite()
{
    page.showFav = true;
    location.reload();
}



function displayHome() {
    var x = document.getElementById("all");
    x.style.display = "block";
    page.showFav = false;
    location.reload();
}

function clearAll() {
    if(document.cookie != "Entry=0ž" ){  
        var input = confirm("Are you sure that you want to delete all?");

        if(input){
            if(page.showFav){
                deleteAllFav();
            }else{
                document.cookie = "Entry=0ž";
                location.reload();
            }
        }
    }
    else
        alert("No Entries");
}

function deleteAllFav(){
    var data = document.cookie.split("ž");
    var string = "";
    var count = 0;
    for(var x = 1; x <= window.totalEntries; x++){
        var individualData = data[x].split("=");
        var key = individualData[0].trim();
        var value = individualData[1];
        if(!key.includes("FInfo")){
            count++;
            string += "Info"+count+"="+value+"ž";
        }
    }
    string = "Entry="+count+"ž"+string;
    document.cookie = string;
    location.reload();
}

function downloadAll(){
    var data = document.cookie.split("ž");
    var size = totalEntry();
    var string = "";
    for(var x = 1; x <= size; x++){
        var individualData = data[x].split("=");
        var key = individualData[0];
        var value = individualData[1];
        string += key + ":\r\n"+value+"\r\n\r\n";
    }

    if(string.length != 0){
        var fileName = prompt("Save As:", "Clipboard");
        if(fileName != null)
            downloadFile(fileName,string);
    }
    else
        alert("No Entries");
}



function Favourite(idNumber){
    var newKeyValue = "FInfo"+idNumber;
    var searchKeyValue = "Info"+idNumber;


    //Cookie
    var cookie = document.cookie;

    //Check if the data is favourited
    if(cookie.includes("FInfo"+idNumber)){
        newKeyValue = "Info"+idNumber;
        searchKeyValue = "FInfo"+idNumber;
    }

    //Relpace Info# with FInfo#
    cookie = cookie.replace(searchKeyValue,newKeyValue);

    //Update Cookie
    document.cookie = cookie;

    //Referesh
    location.reload();

    
}

function copy(string){
    var text = document.getElementById(string);
    var range = document.createRange();

    range.selectNode(text);
    window.getSelection().addRange(range);
    text.select();
    document.execCommand('copy');
}

function download(string){
    var fileName = prompt("Save As:", "File"+string);
    
    var data = document.getElementById("Info"+string).value;

    // Start file download.
    if(fileName != null)
        downloadFile(fileName,data);
}

function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  



function deleteInfo(id){

    var key = "Info"+id.substring(1);
    var value = document.getElementById(key).value;

    if(value != null){
        
        if(document.cookie.includes("F"+key))
            key = "F"+key;

        var fullString = key+"="+value+"ž";
        var indexToDelete = parseInt(id.substring(1));

        var cookie = document.cookie;
        cookie = cookie.replace(fullString,"");

        //Shift All The Entry Key Values DOWN
        for(var start = indexToDelete+1; start <= window.totalEntries; start++){

            var oldKeyValue = "Info"+start+"=";
            var newKeyValue = "Info"+(start-1)+"=";
            cookie = cookie.replace(oldKeyValue,newKeyValue);
        }

        var splitAll = cookie.split("ž");
        var cookieEntry = splitAll[0].split("=");
        var oldEntryValue = cookieEntry[0]+"="+cookieEntry[1]+"ž";
        var newEntryValue = cookieEntry[0]+"="+(parseInt(cookieEntry[1])-1)+"ž";
        cookie = cookie.replace(oldEntryValue, newEntryValue);

        document.cookie = cookie;

        console.log("Replace("+oldEntryValue+","+newEntryValue+")");
        console.log(cookie);
        location.reload();
    }
}

