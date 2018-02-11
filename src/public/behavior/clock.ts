function addLeadingZeros(number:number) {
  if (number < 10) {
    return '0' + number.toString()
  }
  return number;
}

function theTime() {
	let clock = new Date();
	let h = addLeadingZeros(clock.getHours());
	let m = addLeadingZeros(clock.getMinutes());
	let s = addLeadingZeros(clock.getSeconds());
	return h + ':' + m;
}

window.setInterval(function(){
	let time = theTime()
  let awakeTime = $('.awakeTime').text()
  console.log(typeof awakeTime)
	$('#clock').text(time)
  if (time === awakeTime) {
    console.log('christmas miricale')
  }
}, 1000);
