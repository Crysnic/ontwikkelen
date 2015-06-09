$( function() {

  // отправка данных на сервер
  $('.login-form form').submit(function() {
    var data = getLoginData();
    
    if (data) {
        var xhr = new XMLHttpRequest();    
        xhr.open("POST", '/login', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;
            
            if (xhr.status == 401) {
                alert("Ошибка логина или пароля");
                return false;
            }
            
            
            document.documentElement.innerHTML = this.responseText;
            
            // Начинаем работать с полученной страницей
            // подключаем к ней скрипты
            $("<script>").attr("src", "/js/user.js").appendTo("head");
        }
        
        xhr.send(data);
    }
    
    return false;
  });
  
 
  // Internal functions
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
      
      return JSON.stringify({"login": login, "passwd": passwd});
  }
  
  
});