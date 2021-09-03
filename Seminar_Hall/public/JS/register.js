let loginPage = document.querySelector(".btn1");
// let sidebarBtn = document.querySelector(".sidebarBtnIcon");
loginPage.onclick = function () {
    // sidebar.classList.toggle("active-nav");
    window.location.replace("/login");
};

window.addEventListener("keyup", () => {
    let name, regExp, nameClass;
    nameClass = document.getElementById("name1");
    name = document.getElementById("name1").value;
    document.getElementById("nameField");
    regExp = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (name == "") {
        document.getElementById("nameMessage").innerHTML = "";
        document.getElementById("nameField").style = "border: 1px solid #c9c9c9;";
        nameClass.classList.remove("field1");
        nameClass.classList.add("field");
    } else {
        if (regExp.test(name)) {
            document.getElementById("nameField").style = "border: 1px solid green;";
            document.getElementById("nameMessage").innerHTML = "<small>Valid name !!!</small>";
            nameMessage.style = "color: green;";
        } else if (regExp.test(name) !== true) {
            document.getElementById("nameField").style = "border: 1px solid red;";
            document.getElementById("nameMessage").innerHTML = "<small>Invalid name !!!</small>";
            nameMessage.style = "color: red; font-size:14.4px;";
            nameClass.classList.remove("field");
            nameClass.classList.add("field1");
        }
    }
});
function InvalidMsg(name) {
    let regExp = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (name.value === "") {
        name.setCustomValidity("Entering an Name is necessary !!!");
    } else if (regExp.test(name.value)) {
        name.setCustomValidity("");
    } else {
        name.setCustomValidity("Please enter two words name !!!");
    }
    return true;
}
window.addEventListener("keyup", () => {
    let email, regExp, emailClass;
    emailClass = document.getElementById("email1");
    email = document.getElementById("email1").value;
    document.getElementById("emailField");
    regExp = /[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}/;
    if (email == "") {
        document.getElementById("emailMessage").innerHTML = "";
        document.getElementById("emailField").style = "border: 1px solid #c9c9c9;";
        emailClass.classList.remove("field1");
        emailClass.classList.add("field");
    } else {
        if (regExp.test(email)) {
            document.getElementById("emailField").style = "border: 1px solid green;";
            document.getElementById("emailMessage").innerHTML = "<small>Valid email !!!</small>";
            emailMessage.style = "color: green;";
        } else {
            document.getElementById("emailField").style = "border: 1px solid red;";
            document.getElementById("emailMessage").innerHTML = "<small>Invalid email !!!</small>";
            emailMessage.style = "color: red; font-size:14.4px;";
            emailClass.classList.remove("field");
            emailClass.classList.add("field1");
        }
    }
});
function InvalidEmail(email) {
    let regExp = /[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}/;
    if (email.value === "") {
        email.setCustomValidity("Entering an Email is necessary !!!");
    } else if (regExp.test(email.value)) {
        email.setCustomValidity("");
    } else {
        email.setCustomValidity("Please enter valid email using '@' and '.' ");
    }
    return true;
}
window.addEventListener("keyup", () => {
    let password, regExp, passwordClass;
    passwordClass = document.getElementById("password1");
    password = document.getElementById("password1").value;
    document.getElementById("passwordField");
    // regExp = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    regExp = /^[A-Z](?=.*\d)(?=.*[!@#&()–[{}])(?=.*[a-z]).{6,14}[+a-z0-9]$/gm;
    if (password == "") {
        document.getElementById("passwordMessage").innerHTML = "";
        document.getElementById("passwordField").style = "border: 1px solid #c9c9c9;";
        passwordClass.classList.remove("field1");
        passwordClass.classList.add("field");
    } else {
        if (regExp.test(password)) {
            document.getElementById("passwordField").style = "border: 1px solid green;";
            document.getElementById("passwordMessage").innerHTML = "<small>Valid password !!!</small>";
            passwordMessage.style = "color: green;";
        } else {
            document.getElementById("passwordField").style = "border: 1px solid red;";
            document.getElementById("passwordMessage").innerHTML = "<small>Invalid password !!!</small>";
            passwordMessage.style = "color: red; font-size:14.4px;";
            passwordClass.classList.remove("field");
            passwordClass.classList.add("field1");
        }
    }
});
function InvalidPass(password) {
    // let regExp = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    let regExp = /^[A-Z](?=.*\d)(?=.*[!@#&()–[{}])(?=.*[a-z]).{6,14}[+a-z0-9]$/gm;
    if (password.value === "") {
        password.setCustomValidity("Entering an password is necessary !!!");
    } else if (regExp.test(password.value)) {
        password.setCustomValidity("");
    } else {
        password.setCustomValidity("Please enter minimum 8 character !!! \n Start from Uppercase Letter \n At least 1 Lowercase character \n At least 1 Digit \n At least 1 Special Symbol");
    }
    return true;
}
window.addEventListener("keyup", () => {
    let number, regExp, numberClass;
    numberClass = document.getElementById("number1");
    number = document.getElementById("number1").value;
    document.getElementById("numberField");
    regExp = /^[6,7,8,9](\+\d{1,2}[\-\ ]{1}?)?\d{9}$/;
    if (number == "") {
        document.getElementById("numberMessage").innerHTML = "";
        document.getElementById("numberField").style = "border: 1px solid #c9c9c9;";
        numberClass.classList.remove("field1");
        numberClass.classList.add("field");
    } else {
        if (regExp.test(number)) {
            document.getElementById("numberField").style = "border: 1px solid green;";
            document.getElementById("numberMessage").innerHTML = "<small>Valid number !!!</small>";
            numberMessage.style = "color: green;";
        } else {
            document.getElementById("numberField").style = "border: 1px solid red;";
            document.getElementById("numberMessage").innerHTML = "<small>Invalid number !!!</small>";
            numberMessage.style = "color: red; font-size:14.4px;";
            numberClass.classList.remove("field");
            numberClass.classList.add("field1");
        }
    }
});
function InvalidNumber(number) {
    let regExp = /^[6,7,8,9](\+\d{1,2}[\-\ ]{1}?)?\d{9}$/;
    if (number.value === "") {
        number.setCustomValidity("Entering an number is necessary !!!");
    } else if (regExp.test(number.value)) {
        number.setCustomValidity("");
    } else {
        number.setCustomValidity("Please enter 10 digit number only !!!");
    }
    return true;
}
