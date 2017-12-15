var submitter = $("#formSubmitter");
//a json file could carry many of these objects to be used depending on the page
var paymentObj = {
	cardNumber:"",
	expirationMonth:"",
	expirationDay:"",
	country:"",
	zipCode:"",
}
//list of char types
var atoz = "qwertyuiopasdfghjklzxcvbnm";
var AtoZ = atoz.toUpperCase();
var symboles = "!@#$%^&*()_+-=`~[]{}|?/><";
var numbers = "0123456789";
var whiteSpace = " ";

var countryList = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];


function dropdownMatcher(string, array) {
 var re = new RegExp("^(" + string + ").*", 'i')
 console.log(string);
 if (string === '') {
  $('.dropdownList').empty();
 } else if (string.length === 1) {
  var re = new RegExp("^(" + string + ").*", 'i')
  for (var i = 0; i < array.length; i++) {
   if (re.test(array[i]) === true) {
    $(".dropdownList").append("<li class='dropdownItem'>" + array[i] + "</li>");
   }
  }
 } else {
  $('.dropdownList').empty();
  for (var i = 0; i < array.length; i++) {
   if (re.test(array[i]) === true) {
    $(".dropdownList").append("<li class='dropdownItem'>" + array[i] + "</li>");
   }
  }
  
 }
}

$('.dropdownSearch').focus(function() {
 var string = $(this).val().split('')[0];
 dropdownMatcher(string, countryList);
}).keyup(function () {
 var string = $(this).val();
 dropdownMatcher(string, countryList);
})

function inMenu(string, array) {
  var re = new RegExp("^(" + string + ").*", 'i')
  for (var i = 0; i < array.length; i++) {
   if (re.test(array[i]) === true) {
    return "OK";
   }
  }
  return "Choose a country on the list.";
}

//click an item from the
$('.dropdownList').on('click', '.dropdownItem', function() {
  $('.dropdownSearch').val($(this).text())
  $('.dropdownList').empty();
});

//elements to clear upon window click
$(document).click(function(){
 $('.dropdownList').empty();
})
//stops event from window click
$('.dropdownWrapper, .dropdownSearch').click(function(e){
 e.stopPropagation();
})


// disallows non-numeric keypress
$('.numericOnly').on('keypress', function(e){
  return e.metaKey || // cmd/ctrl
    e.which <= 0 || // arrow keys
    e.which == 8 || // delete key
    /[0-9]/.test(String.fromCharCode(e.which)); // numbers
})


//card number formatter
$('#cardNumber').on('keypress change', function () {
 var americanExpress = /^(35|37).*$/
  $(this).val(function (index, value) {
   return value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
  });
 if (masterCard.test(val) === true) {
  //currently don't have a regex pattern for this
 } else {
  $(this).val(function (index, value) {
   return value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
  });
 }
});

function cardNumberChecker (val) {
 var visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
 var masterCard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/;
 var americanExpress = /^3[47][0-9]{13}$/;
 var discover = / ^6(?:011|5[0-9]{2})[0-9]{12}$/;
 var rawVal = val.replace(/ /g,'')


 if (visa.test(rawVal) === true) {
  console.log('visa');
  return "OK"
 } else if (masterCard.test(rawVal) === true) {
  console.log('mastercard');
  return "OK"
 } else if (americanExpress.test(rawVal) === true) {
   console.log('americanexpress');
  return "OK"
 } else if (discover.test(rawVal) === true) {
   console.log('discover');
  return "OK"
 } else {
  return "Not a valid credit card. We accept VISA, MasterCard, American Express and Discover."
 }
}

function expirationMonthChecker(val) {
 console.log('monthchecker')
 var monthChecker = /^(0[1-9]|1[0-2]){1}/
 if (monthChecker.test(val) === true ) {
  return "OK";
 } else {
  return "Not a valid month format. Remember to add a '0' if the month is before October!";
 }
}

function expirationDayChecker(val) {

 var dayChecker = /^(0[1-9]|[1-2][0-9]|3[0-1]){1}/;
 if (dayChecker.test(val) === true ) {
  return "OK";
 } else {
  return "Not a valid day format. Remember to add a '0' if the day is before the 10th!";
 }
}
//add country logic later
function zipChecker(val) {
 var zipCheckerRegex = /^\d{5}(?:[-\s]\d{4})?$/;
 if (zipCheckerRegex.test(val) === true) {
  return 'OK';
 } else {
  return "Probably not a valid zip code. Make sure you're in the right country";
 }
}

//id determines error function to pass
function inputValidator (id, val) {
 if (id === "cardNumber") {
  return cardNumberChecker(val);

 } else if (id === "expirationMonth") {
  return expirationMonthChecker(val);

 } else if (id === "expirationDay") {
  return expirationDayChecker(val);

 } else if (id === "country") {
  return inMenu(val, countryList);

 } else if (id === "zipCode") {
  return zipChecker(val);

 } else {
  return "None of these ids are correct";
 }
}


//error handling based on accessing, writing in, and leaving the input field
$("input.userFormItem").focus(function() {
 var id = $("#" + this.id);
 id.addClass("formCompletedSuccess");

}).keyup(function(){

 var val = this.value;
 var key = this.id;
 paymentObj[key] = val.trim();
 //able to submit when something is en every field. Server/database will do the hardcore validating
 submitRelease(paymentObj);

}).blur(function() {
 var id = $("#" + this.id);
 var val = this.value.trim();
 var errorId = $("#" + this.id + "Error");

 if (val === '') {

  var err = 'Try typing something in.';
  errorId.text(err);
  id.addClass('formCompletedFailure').removeClass('formCompletedSuccess');

 } else if (inputValidator(this.id, val) !== "OK") {

  var err = inputValidator(this.id, val);
  errorId.text(err);
  id.addClass('formCompletedFailure').removeClass('formCompletedSuccess');

 } else {

  errorId.text('');
  id.addClass('formCompletedSuccess').removeClass('formCompletedFailure');
  submitRelease(paymentObj);

 }
})


//check if all inputs have been completed successfully
function submitRelease(obj) {
 for (var k in obj) {
  if (obj[k] === '') {
   $("#formSubmitter").addClass("unavailable").removeClass('yes');
   return false;
  }
 }
 $("#formSubmitter").addClass("yes").removeClass('unavailable');
 return true;
}

//standard form submit function
function submitAThing() {
  console.log('thing submitted');
  $.post('/', string);
}

//using the button
submitter.click(function() {
 if (submitRelease(paymentObj) === true) {
  submitAThing();
 } else {
  console.log("submitter isn't available right now");
 }
});

//using the enter key
$(".userFormItem").keypress(function(e) {
	if (e.which == 13) {
		if ($("#stringSubmitter").hasClass("yes")) {
   submitAThing();
  } else {
   console.log("submitter isn't working right now");
  }

		return false;
	}
});
