window.addEventListener("load", function() {
  
  var form = document.forms[0];
  var login = form.login;
  var passwd = form.passwd;

  // отправка данных на сервер
  form.onsubmit = function() {
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
            var script = document.createElement('script');
            script.src = "/js/user.js";

            document.body.appendChild(script);
        }
        
        xhr.send(data);
    }
    
    return false;
  };
  
 
  // Internal functions
  function getLoginData() {

      if (login.value == "Логин" || !login.value) {
          alert("Введите Логин");
          return false;
      }
      if (passwd.value == "Пароль" || !login.value) {
          alert("Введите Пароль");
          return false;
      }
      
      return JSON.stringify({"login": login.value, "passwd": passwd.value});
  }
  
  
});