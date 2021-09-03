let registerPage = document.querySelector(".btn2");
// let sidebarBtn = document.querySelector(".sidebarBtnIcon");
registerPage.onclick = function () {
    // sidebar.classList.toggle("active-nav");
    window.location.replace("/register");
};


window.addEventListener("keyup", () => {
    let email, regExp, emailClass;
    emailClass = document.getElementById("email1");
    email = document.getElementById("email1").value;
    document.getElementById("emailField");
    regExp = /[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}/;
    if (email == "") {
        // document.getElementById("emailMessage").innerHTML = "";
        document.getElementById("emailField").style = "border: 1px solid #c9c9c9;";
        emailClass.classList.remove("field1");
        emailClass.classList.add("field");
    } else {
        if (regExp.test(email)) {
            document.getElementById("emailField").style = "border: 1px solid green;";
            // document.getElementById("emailMessage").innerHTML = "<small>Valid email !!!</small>";
            // emailMessage.style = "color: green;";
        } else {
            document.getElementById("emailField").style = "border: 1px solid red;";
            // document.getElementById("emailMessage").innerHTML = "<small>Invalid email !!!</small>";
            // emailMessage.style = "color: red; font-size:14.4px;";
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
    regExp = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (password == "") {
        // document.getElementById("passwordMessage").innerHTML = "";
        document.getElementById("passwordField").style = "border: 1px solid #c9c9c9;";
        passwordClass.classList.remove("field1");
        passwordClass.classList.add("field");
    } else {
        if (regExp.test(password)) {
            document.getElementById("passwordField").style = "border: 1px solid green;";
            // document.getElementById("passwordMessage").innerHTML = "<small>Valid password !!!</small>";
            // passwordMessage.style = "color: green;";
        } else {
            document.getElementById("passwordField").style = "border: 1px solid red;";
            // document.getElementById("passwordMessage").innerHTML = "<small>Invalid password !!!</small>";
            // passwordMessage.style = "color: red; font-size:14.4px;";
            passwordClass.classList.remove("field");
            passwordClass.classList.add("field1");
        }
    }
});
function InvalidPass(password) {
    let regExp = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (password.value === "") {
        password.setCustomValidity("Entering an password is necessary !!!");
    } else if (regExp.test(password.value)) {
        password.setCustomValidity("");
    } else {
        password.setCustomValidity("Please enter more than 6 digit !!!");
    }
    return true;
}
