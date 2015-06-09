$(function() {
    var header = document.getElementsByTagName("h1")[0];
    var form = document.forms[0];
    var passw = form.passw;
    var confirm_passw = form.confirm_passw;
    
    // header
    $("#header").click(function() {
        window.location.assign("/");
    });
    
    // проверка на совпадение паролей
    $("[name='confirm_passw']").keyup(function() {
        if (this.value != $("[name='passw']").val() || this.value == '') {
            $("[name='confirm_passw']")
                .removeClass('passw-valid')
                .addClass('passw-invalid');
        } else {
            $("[name='confirm_passw']")
                .removeClass('passw-invalid')
                .addClass('passw-valid');
        };
    });
    
    $("[name='passw']").keyup(function() {
        if (this.value != $("[name='confirm_passw']").val() || this.value=='') {
            $("[name='confirm_passw']")
                .removeClass('passw-valid')
                .addClass('passw-invalid');
        } else {
            $("[name='confirm_passw']")
                .removeClass('passw-invalid')
                .addClass('passw-valid');
        };
    });

    // Подсказки для элементов формы
    makeTipFor(form.login, /^[A-Za-z0-9]{4,10}$/,
        "4-8 символов, латинскими буквамы и цифрами");
        
    makeTipFor(form.date, /^\d{2}[ \-.]{1}\d{2}[ \-.]{1}\d{4}$/,
        "формат даты DD-MM-YEAR");

    makeTipFor(form.name, /[A-Za-zА-Яа-яЁё]{3,12}/,
        "3-12 символов, буквами кирилицы или латыни");
        
    makeTipFor(form.surname, /[A-Za-zА-Яа-яЁё]{3,12}/,
        "3-12 символов, буквами кирилицы или латыни");

    makeTipFor(form.city, /[A-Za-zА-Яа-яЁё]{3,20}/,
        "3-20 символов, буквами кирилицы или латыни");

    makeTipFor(form.passw, /^[A-Za-zА-Я0-9]{6,10}$/,
        "6-10 символов, латинскими буквамы и цифрами");
});

// Internal functions
function makeTipFor(elem, regExp, tip) {
    $(elem)
        .focus(function () {
            if (regExp.test(this.value)) return;

            this.nextElementSibling.classList.add("tip");
            this.nextElementSibling.innerHTML = tip;
        })
        .bind("input", function() {
            if (regExp.test(this.value)) {
                this.nextElementSibling.classList.remove("tip");
                this.nextElementSibling.innerHTML = '';
            } else {
                this.nextElementSibling.classList.add("tip");
                this.nextElementSibling.innerHTML = tip;
            }
        })
        .blur(function() {
            this.nextElementSibling.classList.remove("tip");
            this.nextElementSibling.innerHTML = '';
        });
}