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
    
    $.ajax({
      url: "/user_avatar",
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data){
        $("form[name='chooseAvatar']").addClass('choosePicture');
        location.reload();
        alert("Updated to " + data +"! Page will be restart");
      }
    });
    
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
   
        var who = $(event.target).html().match(/[\w\d_]+/)[0];
        
        $.post(
            '/getUserProfile',
            {from: $("title").html(), who: who},
            function(response) {
                $('.userdata').removeClass('edit');
                $('.userName').html(response.name);
                $('.userInformation tr.date td').html(response.date);
                $('.userInformation tr.city td').html(response.city);
                $('.userInformation tr.email td').html(response.email);
                $('.avatar img').attr('src', response.avatar);
            },
            "json"
        );
        
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
        
        $.post(
            '/updateUserProfile',
            {
                login: $("title").html(), 
                name: $(".editData .name input").val(),
                surname: $(".editData .surname input").val(),
                date: $(".editData .date input").val(),
                city: $(".editData .city input").val(),
                email: $(".editData .email input").val()
            },
            function(response) {
                var fullname = response.name+" "+response.surname;
                $(".userName").html(fullname);
                $(".userInformation .date td").html(response.date);
                $(".userInformation .city td").html(response.city);
                $(".userInformation .email td").html(response.email);
                $('.userdata').removeClass('edit');
            },
            "json"
        );
        
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