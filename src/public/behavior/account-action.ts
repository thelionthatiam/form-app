var submitter = $("#formSubmitter");
submitter.prop('disabled', true);
var userProfileObj = {
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
};
//identical for now
var string = userProfileObj;
//list of char types
var atoz = "qwertyuiopasdfghjklzxcvbnm";
var AtoZ = atoz.toUpperCase();
var symboles = "!@#$%^&*()_+-=`~[]{}|?/><";
var numbers = "0123456789";
var whiteSpace = " ";
// disallows non-numeric keypress
$('.numericOnly').on('keypress', function (e) {
    return e.metaKey || // cmd/ctrl
        e.which <= 0 || // arrow keys
        e.which == 8 || // delete key
        /[0-9]/.test(String.fromCharCode(e.which)); // numbers
});
//adds "and" when there are more than 1 problem chars
function grammer(arr) {
    if (arr.length > 1) {
        var newArr = arr.splice(arr.length - 1, 0, ' and ');
        var pluralRpt = arr.join('') + ", which are not allowed.";
        return pluralRpt;
    }
    else {
        var pluralRpt = arr.join(', ') + ", which is not allowed.";
        return pluralRpt;
    }
}
//takes char and tests if present in string
function charFinder(char, string) {
    string.split('');
    console.log(string);
    var error = '';
    for (var i = 0; i < string.length; i++) {
        if (string[i] === char) {
            if (char === ' ') {
                error = ' a space';
            }
            else {
                error = " " + char;
            }
            console.log(error);
            return error;
        }
    }
}
//takes list of chars and runs through charFinder()
function usingBadChars(badChars, string) {
    string.split('');
    var errorChars = [];
    for (var i = 0; i < badChars.length; i++) {
        if (charFinder(badChars[i], string) !== undefined) {
            errorChars.push(charFinder(badChars[i], string));
        }
    }
    if (errorChars.length === 0) {
        return "Nothing written";
    }
    else {
        var errorRept = grammer(errorChars);
        var err = ("You used" + errorRept);
        return err;
    }
}
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
function passwordChecker(val) {
    // var passCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    if ($('#password').hasClass('passing')) {
        return passwordMatcher(val);
    }
    else {
        return "Password must be at least 'strong', you credit card may be used in this application!";
    }
}
function passwordMatcher(val) {
    if (userProfileObj['confirmPassword'] !== userProfileObj['password']) {
        return "Passwords must match.";
    }
    else {
        $("#passwordError").text('');
        $("#password").addClass('formCompletedSuccess').removeClass('formCompletedFailure');
        $("#confirmPasswordError").text('');
        $("#confirmPassword").addClass('formCompletedSuccess').removeClass('formCompletedFailure');
        return "OK";
    }
}
//id determines error function to pass
function inputValidator(id, val) {
    // console.log(userProfileObj);
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
    userProfileObj[key] = val.trim();
    console.log(submitRelease(userProfileObj));
    if (submitRelease(userProfileObj)) {
        console.log('full obj');
        if (inputValidator(this.id, val) !== "OK") {
            $("#formSubmitter").prop('disabled', true).addClass("unavailable").removeClass('yes');
            console.log('false');
        }
        else {
            console.log('true');
            $("#formSubmitter").prop('disabled', false).addClass("yes").removeClass('unavailable');
        }
    }
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
//using the button
submitter.click(function () {
    if (submitRelease(userProfileObj) === true) {
        // submitAThing();
        console.log('you submitted a thing');
    }
    else {
        console.log("submitter isn't available right now");
    }
});
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
