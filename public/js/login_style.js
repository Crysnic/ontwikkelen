$( function() {
  
  $(".login-form input[name='passwd']").attr("type", "text");

  // Form styles
  $(".login-form input[name='login']")
    .bind('focus', function() {
        if (this.value == "Логин") this.value = '';
        this.style.borderColor = "rgba(0,191,255,0.5)";
    })
    .bind('blur', function() {
        if (this.value == "") this.value = "Логин";
        this.style.borderColor = "#dcdcdc";
    });

  $(".login-form input[name='passwd']") 
    .bind('focus', function() {
        if (this.value == "Пароль") {
          this.value = ''
          this.type = 'password';
        };
        this.style.borderColor = "rgba(0,191,255,0.5)";
    })
    .bind('blur', function() {
        if (this.value == "") {
          this.value = "Пароль";
          this.type = "text";
        }
        this.style.borderColor = "#dcdcdc";
    }); 
  
});