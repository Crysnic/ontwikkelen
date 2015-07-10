$(function() {

    // отправка данных на сервер
    $('.login-form form').submit(function() {
        var data = getLoginData();

        if (data) {
            // загрузка страницы user
             $.post('login', data, function(response) {
                 document.documentElement.innerHTML = response;
                 $("<script>").attr("src", "/js/user.js").appendTo("head");
            });

        }

        return false;
    });

    function getLoginData() {

        var login = $(".login-form input[name='login']").val();
        var passwd = $(".login-form input[name='passwd']").val();

        if (login == "Логин" || !login) {
            alert("Введите Логин");
            return false;
        }
        if (passwd == "Пароль" || !login) {
            alert("Введите Пароль");
            return false;
        }

        return {"login": login, "passwd": passwd};
    }
  
});
