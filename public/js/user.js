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
    
    $("title").html(pageOwnerData.title);
    $(".avatar img").attr("src", pageOwnerData.avatar);
    $(".userName").html(pageOwnerData.name);
    $(".date td").html(pageOwnerData.date);
    $(".city td").html(pageOwnerData.city);
    $(".email td").html(pageOwnerData.email);
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
                $('.userName').html(userProfileData.name);
                $('tr.date td').html(userProfileData.date);
                $('tr.city td').html(userProfileData.city);
                $('tr.email td').html(userProfileData.email);
                $('.avatar img').attr('src', userProfileData.avatar);
            }
        };
        
        return false;
    }
});

// USER PROFILE DATA
$('.editProfile').click(function() {

    $('.userdata').addClass('edit');

    $('.userName').html('<input type="text" value="'+$('.userName').html()+'">');

    $('.userdata tr td').each(function() {
        var editElement = $('<input>').attr({type: 'text', value: $(this).html()});
        $(this).html(editElement);
    });

    $('.userdata .saveProfile').click(function(){
        $('.userName').html( $('.userName input').val() );

        $('.userdata tr td').each(function() {
            $(this).html( $(this).children().first().val() );
        });
        $('.userName').show();
        $('.userdata').removeClass('edit');
    });

    $('.userdata .cancelEditProfile').click(function(){
        var profileData = $('.user').data('user');
        
        $('.userName').html(profileData.name);
        $('.city td').html(profileData.city);
        $('.date td').html(profileData.date);
        $('.email td').html(profileData.email);

        $('.userName').show();
        $('.userdata').removeClass('edit');
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