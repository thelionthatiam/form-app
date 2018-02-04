var topicList = [
    "United Nations Childrens Fund",
    "UNICEF",
    "Human Rights Watch",
    "HRW",
    "Museum of Modern Art",
    "MOMA",
    "Human Rights Campaign",
    "Do Something",
    "American Civil Liberties Union",
    "ACLU",
    "Doctors Without Borders",
    "Kiva",
    "Rotary International",
    "Rotary",
    "Sierra Club",
    "NPR",
    "Republican National Committee",
    "RNC",
    "The Heritage Foundation",
    "The Cato Institute",
    "Citizens Against Government Waste",
    "Media Research Center",
    "Townhall",
    "National Federation of Republican Women",
    "National Right to Life",
    "National Rifle Association",
    "NRA",
    "American Enterprise Institute"
];
// $('.dropdownList').scrollTop(1).scrollTop(0);
function dropdownMatcher(string, array) {
    var re = new RegExp("^(" + string + ").*", 'i');
    if (string === undefined) {
        $('.dropdownList').empty();
        for (var i = 0; i < array.length; i++) {
            $(".dropdownList").append("<li class='dropdownItem'>" + array[i] + "</li>");
        }
        $('.dropdownWrapper').removeClass('none');
    }
    else if (string.length === 1) {
        $('.dropdownList').empty();
        var re = new RegExp("^(" + string + ").*", 'i');
        for (var i = 0; i < array.length; i++) {
            if (re.test(array[i]) === true) {
                $(".dropdownList").append("<li class='dropdownItem'>" + array[i] + "</li>");
            }
        }
        $('.dropdownWrapper').removeClass('none');
    }
    else {
        $('.dropdownList').empty();
        for (var i = 0; i < array.length; i++) {
            if (re.test(array[i]) === true) {
                $(".dropdownList").append("<li class='dropdownItem'>" + array[i] + "</li>");
            }
        }
        $('.dropdownWrapper').removeClass('none');
    }
}
$('.dropdownSearch').focus(function () {
    var string = $(this).val().split('')[0];
    dropdownMatcher(string, topicList);
}).keyup(function () {
    var string = $(this).val();
    dropdownMatcher(string, topicList);
});
//click an item from the
$('.dropdownList').on('click', '.dropdownItem', function () {
    console.log('dopdowitem clicked', $(this).text());
    $('.dropdownSearch').val($(this).text());
    $('.dropdownList').empty();
    $('.dropdownWrapper').addClass('none');
});
//elements to clear upon window click
$(document).click(function () {
    $('.dropdownList').empty();
    $('.dropdownWrapper').addClass('none');
});
//stops event from window click
$('.dropdownWrapper, .dropdownSearch').click(function (e) {
    e.stopPropagation();
});
//# sourceMappingURL=search-bar.js.map