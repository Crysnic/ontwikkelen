var form = document.forms[0];
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

// press on a avatar
avatarButton.onclick = function(event) {
    if (event.target.tagName === "IMG")
        form.classList.toggle('choosePicture');
};