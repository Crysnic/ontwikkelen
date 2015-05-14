window.addEventListener("load", function() {
  
  var form = document.forms[0];
  var login = form.login;
  var passwd = form.passwd;
  passwd.type = 'text';
  var registration = document.getElementById('registration');

  // Form styles
  login.onfocus = function() {
    if (this.value == "Логин") this.value = '';
    this.style.borderColor = "rgba(0,191,255,0.5)";
  };

  login.onblur = function() {
    if (this.value == "") this.value = "Логин";
    this.style.borderColor = "#dcdcdc";
  };

  passwd.onfocus = function() {
    if (this.value == "Пароль") {
      this.value = ''
      this.type = 'password';
    };
    this.style.borderColor = "rgba(0,191,255,0.5)";
  };

  passwd.onblur = function() {
    if (this.value == "") {
      this.value = "Пароль";
      this.type = "text";
    }
    this.style.borderColor = "#dcdcdc";
  }; 
  
});