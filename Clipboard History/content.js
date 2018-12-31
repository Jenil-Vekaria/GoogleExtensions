console.log("Pop Up (0.0.1)");

window.addEventListener('mouseup', selectedText);
document.addEventListener("keydown", PressedKey);
document.addEventListener("keyup", ReleasedKey);

var keyMap = {
    17: false,  //CONTROL
    67: false   //C
};

window.sendText = "";

function selectedText(){
    //Get selected text
    window.sendText = window.getSelection().toString().trim();
    window.sendText = window.sendText.replace(/\n+/g," ");
}



function PressedKey(e){
    keyMap[e.which] = true;
    //Send if CONTROL + C is pressed
    if(keyMap[17] && keyMap[67]){
        //Send the text to the background
        if(window.sendText.length > 0){
            chrome.runtime.sendMessage(window.sendText);
        }
    }
}
function ReleasedKey(e){keyMap[e.which] = false;}
