window.addEventListener("load", function() {
    var form = document.forms[0];
    var passw = form.passw;
    var confirm_passw = form.confirm_passw;
    
    // проверка на совпадение паролей
    confirm_passw.onkeyup = function() {
        if (this.value != passw.value || this.value == '') {
            this.classList.remove('passw-valid');
            this.classList.add('passw-invalid');
        } else {
            this.classList.remove('passw-invalid');
            this.classList.add('passw-valid');
        };
    }
    
    passw.onkeyup = function() {
        if (this.value != confirm_passw.value || this.value == '') {
            confirm_passw.classList.remove('passw-valid');
            confirm_passw.classList.add('passw-invalid');
        } else {
            confirm_passw.classList.remove('passw-invalid');
            confirm_passw.classList.add('passw-valid');
        };
    }

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
    elem.onfocus = function () {
        if (regExp.test(this.value)) return;

        this.nextElementSibling.classList.add("tip");
        this.nextElementSibling.innerHTML = tip;
    };

    elem.oninput =function() {
        if (regExp.test(this.value)) {
            this.nextElementSibling.classList.remove("tip");
            this.nextElementSibling.innerHTML = '';
        } else {
            this.nextElementSibling.classList.add("tip");
            this.nextElementSibling.innerHTML = tip;
        }
    };

    elem.onblur =function() {
        this.nextElementSibling.classList.remove("tip");
        this.nextElementSibling.innerHTML = '';
    };
}