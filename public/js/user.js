window.addEventListener("load", function() {
    var form = document.forms[0];
    var avatarButton = form.getElementsByClassName('avatar')[0];
    
    avatarButton.onclick = function(event) {
        if (event.target.tagName == "IMG")
            form.classList.toggle('choosePicture');
    }
});