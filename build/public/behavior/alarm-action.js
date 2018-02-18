var submitter = $("#formSubmitter");
submitter.prop('disabled', true);
var loginObj = {
    title: "",
    awake: "",
};
function titleChecker(val) {
    var titleCheck = /^[ 0-9a-zA-Z!@#$%^&*()_+]{1,20}$/;
    if (titleCheck.test(val) === true) {
        return "OK";
    }
    else {
        return "That's not a valid title. Keep it within 15 characters.";
    }
}
function awakeChecker(val) {
    var awakeCheck = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
    if (awakeCheck.test(val)) {
        return "OK";
    }
    else {
        return "Military time with leading zeros.";
    }
}
//id determines error function to pass
function inputValidator(id, val) {
    console.log(id);
    if (id === "title") {
        return titleChecker(val);
    }
    else if (id === "awake") {
        return awakeChecker(val);
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
    if (submitRelease(loginObj)) {
        if (inputValidator(this.id, val) !== "OK") {
            $("#formSubmitter").addClass("unavailable").removeClass('yes').prop('disabled', true);
        }
        else {
            $("#formSubmitter").addClass("yes").removeClass('unavailable').prop('disabled', false);
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
//# sourceMappingURL=loginAction.js.map
//# sourceMappingURL=alarm-action.js.map