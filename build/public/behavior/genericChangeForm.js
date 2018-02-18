var submitter = $("#formSubmitter");
// submitter.prop('disabled', true);
var loginObj = {
    email: "",
    password: "",
};
$('.numericOnly').on('keypress', function (e) {
    return e.metaKey || // cmd/ctrl
        e.which <= 0 || // arrow keys
        e.which == 8 || // delete key
        /[0-9]/.test(String.fromCharCode(e.which)); // numbers
});
function emailChecker(val) {
    var emailCheck = /^[a-zA-Z0-9\._\$%\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9]{2,6}/;
    if (emailCheck.test(val) === true) {
        return "OK";
    }
    else {
        return "That's not a valid email. Try again";
    }
}
function phoneChecker(val) {
    var phoneCheck = /^[0-9]+$/;
    if (phoneCheck.test(val) === true) {
        return "OK";
    }
    else {
        return "Somehow you used something other than numbers. It's a phone number, so stick to numbers.";
    }
}
function phoneChecker(val) {
    var phoneCheck = /^[0-9]+$/;
    if (phoneCheck.test(val) === true) {
        return "OK";
    }
    else {
        return "Somehow you used something other than numbers. It's a phone number, so stick to numbers.";
    }
}
function passwordChecker(val) {
    var passCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    if (passCheck.test(val)) {
        return passwordMatcher(val);
    }
    else {
        return "Password must be at least 8 characters, contain one lowercase letter, one uppercase letter, and a symbol. Try again.";
    }
}
//id determines error function to pass
function inputValidator(id, val) {
    // console.log(loginObj);
    if (id === "email") {
        return emailChecker(val);
    }
    else if (id === "phone") {
        return phoneChecker(val);
    }
    else if (id === "password" || id === "confirmPassword") {
        if (id === 'password') {
            return passwordChecker(val);
        }
        return passwordMatcher(val);
    }
    else {
        return "None of these ids are correct";
    }
}
$("input.userFormItem").focus(function () {
    var id = $("#" + this.id);
    // console.log('the script is running ' + this.id);
    id.addClass("formCompletedSuccess");
}).keyup(function () {
    var val = this.value;
    var key = this.id;
    loginObj[key] = val.trim();
    // console.log(submitRelease(loginObj))
    // if (submitRelease(loginObj)) {
    //  if (inputValidator(this.id, val) !== "OK") {
    //   $("#formSubmitter").addClass("unavailable").removeClass('yes').prop('disabled', true);
    //  } else {
    //   $("#formSubmitter").addClass("yes").removeClass('unavailable').prop('disabled', false);
    //  }
    // }
}).blur(function () {
    var id = $("#" + this.id);
    var val = this.value.trim();
    var errorId = $("#" + this.id + "Error");
    if (val === '') {
        var err = 'Try typing something in.';
        errorId.text(err);
        id.addClass('formCompletedFailure').removeClass('formCompletedSuccess');
    }
    else if (inputValidator(this.id, val) !== "OK") {
        var err = inputValidator(this.id, val);
        errorId.text(err);
        id.addClass('formCompletedFailure').removeClass('formCompletedSuccess');
    }
    else {
        errorId.text('');
        id.addClass('formCompletedSuccess').removeClass('formCompletedFailure');
    }
});
//check if all inputs have been completed successfully
function submitRelease(obj) {
    for (var k in obj) {
        if (obj[k] === '') {
            return false;
        }
    }
    return true;
}
//using the enter key
$(".userFormItem").keypress(function (e) {
    if (e.which === 13) {
        if ($("#stringSubmitter").hasClass("yes")) {
            //  submitAThing();
            console.log('you submitted a thing');
        }
        else {
            console.log("submitter isn't working right now");
        }
        return false;
    }
});
//# sourceMappingURL=genericChangeForm.js.map 
//# sourceMappingURL=genericChangeForm.js.map