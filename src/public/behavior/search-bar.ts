var topicList = [
 "United Nations Childrens Fund",
 "Human Rights Watch",
 "Museum of Modern Art",
 "Human Rights Campaign",
 "Do Something",
 "American Civil Liberties Union",
 "Doctors Without Borders",
 "Kiva",
 "Rotary International",
 "Rotary",
 "Sierra Club",
 "National Public Radio",
 "Republican National Committee",
 "The Heritage Foundation",
 "The Cato Institute",
 "Citizens Against Government Waste",
 "Media Research Center",
 "Townhall",
 "National Federation of Republican Women",
 "National Right to Life",
 "National Rifle Association",
 "American Enterprise Institute"
];
// $('.dropdownList').scrollTop(1).scrollTop(0);

function dropdownMatcher(string, array) {
  var re = new RegExp("^(" + string + ").*", 'i')
  if (string === undefined) {

    $('.dropdownList').empty();
    for (var i = 0; i < array.length; i++) {
      $(".dropdownList").append("<li class='dropdownItem'>" + array[i] + "</li>");
    }
    $('.dropdownWrapper').removeClass('none');
  } else if (string.length === 1) {
    $('.dropdownList').empty();
    var re = new RegExp("^(" + string + ").*", 'i')
    for (var i = 0; i < array.length; i++) {
      if (re.test(array[i]) === true) {
        $(".dropdownList").append("<li class='dropdownItem'>" + array[i] + "</li>");
      }
    }
    $('.dropdownWrapper').removeClass('none');
  } else {
    $('.dropdownList').empty();
    for (var i = 0; i < array.length; i++) {
      if (re.test(array[i]) === true) {
        $(".dropdownList").append("<li class='dropdownItem'>" + array[i] + "</li>");
      }
    }
    $('.dropdownWrapper').removeClass('none');
  }
}

$('.dropdownSearch').focus(function() {
  var string = $(this).val().split('')[0];
  dropdownMatcher(string, topicList);
}).keyup(function () {
  var string = $(this).val();
  dropdownMatcher(string, topicList);
})

//click an item from the
$('.dropdownList').on('click', '.dropdownItem', function() {
  console.log('dopdowitem clicked', $(this).text())
  $('.dropdownSearch').val($(this).text())
  $('.dropdownList').empty();
  $('.dropdownWrapper').addClass('none');
});

//elements to clear upon window click
$(document).click(function(){
 $('.dropdownList').empty();
 $('.dropdownWrapper').addClass('none');
})
//stops event from window click
$('.dropdownWrapper, .dropdownSearch').click(function(e){
 e.stopPropagation();
})

//go to a searched org

function idMaker(name:string) {
  name = name.toLowerCase();
  let arrName = name.split('');
  for (let i = 0; i < arrName.length; i++) {
    if (arrName[i] === ' ') {
      arrName[i] = '-';
    }
  }
  return arrName.join('');
}

$('#org-search').click(function() {
  let itemID = '#top'
  let searchItem = $('.dropdownSearch').val();
  if (searchItem === '') {
    window.scrollBy({
      top: 0, // could be negative value
      left: 0,
      behavior: 'smooth'
    });
  } else {
    itemID = '#' + idMaker(searchItem);
    document.querySelector(itemID).scrollIntoView({
      behavior: 'smooth'
    });
  }
})
