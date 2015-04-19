window.addEventListener("load", function() {
    
    var form = document.forms[0];

    form.onsubmit = function() {
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
  
    function getRegData() {
        
      return JSON.stringify({
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