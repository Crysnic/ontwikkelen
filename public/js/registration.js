window.addEventListener("load", function() {
    
    var form = document.forms[0];
    var passw = form.passw;
    var confirm_passw = form.confirm_passw;

    form.onsubmit = function() {
        
        if (confirm_passw.value != passw.value) {
            alert("Пароль не совпадает");
            return false;
        }
        
        var data = getRegData();
        
        if (data) {
            var xhr = new XMLHttpRequest();    
            xhr.open("POST", '/registration', true);
            xhr.setRequestHeader('Content-type', 
                'application/json; charset=utf-8');

            xhr.onreadystatechange = function() {
                if (this.readyState != 4) return;

                alert( this.responseText );
            }

            xhr.send(data);
        }

        return false;
    };
    
    confirm_passw.onblur = function() {
        if (this.value != passw.value)
            alert("Пароль не совпадает");
    }
  
    function getRegData() {
        
      return JSON.stringify({
        login: form.login.value,
        name: form.name.value,
        surname: form.surname.value,
        date: form.date.value,
        city: form.city.value,
        email: form.email.value,
        passw: form.passw.value,
        confirm_passw: form.confirm_passw.value
      });
    }
    
    
});