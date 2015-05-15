var form = document.forms.chooseAvatar;
var avatarButton = document.getElementsByClassName('avatar')[0];

// send a picture on server
form.onsubmit = function() {
    var formData = new FormData(form);
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/user_avatar", true);
    
    xhr.onload = function() {
        if (xhr.status == 200) {
            alert("Updated to " + xhr.responseText +"! Please restart this page");
        } else {
            alert("Error " + xhr.status + " occurred uploading your file.<br \/>");
        }
      };
    
    xhr.send(formData);
    return false;
}

var socket = new WebSocket("ws://192.168.0.100:3000");
    
document.forms.publish.onsubmit = function() {
    
    var outgoingMessage = this.message.value;
    if (outgoingMessage) {
        this.message.value = '';
        socket.send(JSON.stringify({
            "from": document.getElementsByTagName("title")[0].innerHTML,
            "message": outgoingMessage
        }));
    }
    return false;
}

socket.onmessage = function (event) {
    if (isJson(event.data)) {
        var resObj = JSON.parse(event.data);
        showMessage(resObj.from, resObj.message);
    }
};

// показать сообщение в div#subscribe
function showMessage(from, message) {
  document.getElementById('subscribe').value += 
                from + ":  " + message + "\n";
}

// press on a avatar
avatarButton.onclick = function(event) {
    if (event.target.tagName === "IMG")
        form.classList.toggle('choosePicture');
};

// Internal functions
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}