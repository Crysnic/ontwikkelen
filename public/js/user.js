var socket = new WebSocket("ws://127.0.0.1:3000");

// Save page owner data
$(".user").data("user", {
    title: $("title").html(),
    name: $(".userName").html(),
    date: $(".date td").html(),
    city: $(".city td").html(),
    email: $(".email td").html(),
    avatar: $(".avatar img").attr("src")
});

// Focus on textarea
$("#sendMessage textarea").focus();

// Header main menu
$(".mainmenu h1").click(function() {
    window.location.assign('/');
});
$(".mainmenu .owner").click(function() {
    var pageOwnerData = $(".user").data("user");
    $('.userdata').removeClass('edit');
    
    $("title").html(pageOwnerData.title);
    $(".avatar img").attr("src", pageOwnerData.avatar);
    $(".userName").html(pageOwnerData.name);
    $(".userInformation .date td").html(pageOwnerData.date);
    $(".userInformation .city td").html(pageOwnerData.city);
    $(".userInformation .email td").html(pageOwnerData.email);
});

// send a picture on server
$("form.choosePicture").submit(function(event) {
    var formData = new FormData(this);

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
    event.preventDefault();
});

// press on a avatar
$(".avatar").click(function(event) {
    if (event.target.tagName === "IMG") {
        $("form[name='chooseAvatar']").toggleClass('choosePicture');
    }
});

// chat
$("#sendMessage").bind({
    "submit": sendMessageHandler,
    "keydown": function(event) {
        if (event.which == 13 && event.ctrlKey) {
            var message = $("[name='message']").val();
            $("[name='message']").val(message+"\n");
        } else if (event.which == 13) {
            sendMessageHandler.call(this, event);
        }
    }
});

socket.onmessage = function(event) {
    if (isJson(event.data)) {
        var resObj = JSON.parse(event.data);
        showMessage(resObj.from, resObj.message);
    }
};

// work with data in the chat
$("#chatData").click(function(event) {
    if (event.target.tagName === 'A') {
        window.open($(event.target).attr('href'));
    } else if (event.target.tagName === 'TH') {            
        
        var xhr = new XMLHttpRequest();    
        xhr.open("POST", '/getUserProfile', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        var who = $(event.target).html().match(/[\w\d_]+/)[0];
        xhr.send(JSON.stringify({from: $("title").html(), who: who}));
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                var userProfileData = JSON.parse(xhr.responseText);
                $('.userdata').removeClass('edit');
                $('.userName').html(userProfileData.name);
                $('.userInformation tr.date td').html(userProfileData.date);
                $('.userInformation tr.city td').html(userProfileData.city);
                $('.userInformation tr.email td').html(userProfileData.email);
                $('.avatar img').attr('src', userProfileData.avatar);
            }
        };
        
        return false;
    }
});

// USER PROFILE DATA
$('.editProfile').click(function() {

    $('.userdata').toggleClass('edit');
    
    $('.cancelEditProfile').click(function() {
        var userdata = $(".user").data("user");
        var fullName = userdata.name;
        $(".editData .name input").val(fullName.match(/^[a-zA-Zа-яА-ЯёЁ]+/));
        $(".editData .surname input").val(fullName.match(/[a-zA-Zа-яА-ЯёЁ]+$/));
        $(".editData .date input").val(userdata.date);
        $(".editData .city input").val(userdata.city);
        $(".editData .email input").val(userdata.email);
        
        $('.userdata').removeClass('edit');
    });
    
    $('.saveProfile').click(function() {
        var xhr = new XMLHttpRequest();    
        xhr.open("POST", '/updateUserProfile', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        xhr.send(JSON.stringify({
            login: $("title").html(), 
            name: $(".editData .name input").val(),
            surname: $(".editData .surname input").val(),
            date: $(".editData .date input").val(),
            city: $(".editData .city input").val(),
            email: $(".editData .email input").val()
        }));
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                var userProfileData = JSON.parse(xhr.responseText);
                var fullname = userProfileData.name+" "+userProfileData.surname;
                $(".userName").html(fullname);
                $(".userInformation .date td").html(userProfileData.date);
                $(".userInformation .city td").html(userProfileData.city);
                $(".userInformation .email td").html(userProfileData.email);
                $('.userdata').removeClass('edit');
            } else {
                alert('Error: something was wrong');
                $('.cancelEditProfile').click();
            }
        };
        
        return false;
    });
});

//-- Internal functions --------------------------------------------------------
function showMessage(from, message) {
    message = message.replace(/[\w\d\Sà-ÿÀ-ß¸¨]{29}/g, "$& ");
    message = message.replace(/http[s]{0,1}:\/\/[\w\d\/.]+/g,
        "<a href='$&'>$&</a>");
    
    var messageElem = $("<tr></tr>").append("<th>"+from+": </th>").
      append("<td>"+message+"</td>");
    $("#chatData table").append(messageElem);
    $("#chatData")[0].scrollTop = $("#chatData")[0].scrollHeight;
}

function sendMessageHandler(event) {   
    var outgoingMessage = this.message.value;
    
    if (outgoingMessage) {
        this.message.value = '';
        socket.send(JSON.stringify({
            "from": $("title").text(),
            "message": outgoingMessage
        }));
        
        $("#sendMessage textarea").focus();
    }
    
    event.preventDefault();
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}