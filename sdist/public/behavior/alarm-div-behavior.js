// let delete = $('.delete-alarm');

$('.delete-alarm').click(()=>{
  let id = $(this).attr('id');
  $(this).toggleClass('red');
  console.log(id);
})
