/*---------------menu stuff---------------------*/

// clickable items are variables
var category = $('.categoryTitle');
var article = $('.subCategoryTitle');
var titleImg = $('.titleImg');
var unsquishButton = $('.unsquishButton');


function removeSelector(aClass) {
	var arr = aClass.split('');
	arr.shift();
	arr.join('');
	return arr.join('');
}

function slideDownNext(selected, highlightedClass, highlight) {
	var next = selected.next();
	next.addClass(highlight).slideDown();
}

function squish() {
	titleImg.addClass('smallTitleImg');
	$('.photoSlider').addClass('smallPhotoSlider');
	$('.unsquishButton').addClass('lowOpacity');

}

function unsquish(){
	titleImg.removeClass('smallTitleImg');
	$('.photoSlider').removeClass('smallPhotoSlider');
	$('.unsquishButton').removeClass('lowOpacity');
}

function oneOpen(selected, highlightedClass, highlight) {
	if (selected.next().hasClass(highlight)) {
		$(highlightedClass).slideUp().removeClass(highlight);
		selected.next().removeClass(highlight);
		if (selected.hasClass('categoryTitle')) { // more hardcoded step. not impressed with this
			unsquish();
		}
	} else {
		$(highlightedClass).slideUp().removeClass(highlight);
		slideDownNext(selected, highlightedClass, highlight);

		squish();
	}
}

function revertAll() {
	if (titleImg.hasClass('smallTitleImg')) {
		$('.red').slideUp();
		unsquish();
	}
}

// I don't think this is working
function windowPosition(selected) {
  $('html, body').animate({
    scrollTop: selected.position().top
  });
}

category.click(function() {
	var selected = $(this);
	var highlightedClass = '.red';
	var highlight = removeSelector(highlightedClass);
	oneOpen(selected, highlightedClass, highlight);
});

article.click(function() {
	var selected = $(this);
	var highlightedClass = '.green';
	var highlight = removeSelector(highlightedClass);
  windowPosition(selected);
	oneOpen(selected, highlightedClass, highlight);
});

titleImg.click(function() {
	revertAll();
})

unsquishButton.click(function() {
	revertAll();
})


// format date a little better
$('.thedate').each(function() {
	let dateChanger = /[a-zA-Z]{2,4} [a-zA-Z]{2,4} [\d]{1,2} [\d]{2,4}/g
	var date = $(this).text();
	var newDateFormat = date.match(dateChanger)
	$(this).text(date.replace(date, ("created on: " + newDateFormat)))
})
