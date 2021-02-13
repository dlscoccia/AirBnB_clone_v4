function docReady (fn) {
  // see if DOM is already available
  if (document.readyState === 'complete' ||
  document.readyState === 'interactive') {
  // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const amenityList = [];
docReady(function () {
  const myDiv = $('.amenities input');
  $(myDiv).click(function () {
    const name = $(this).attr('data-name');
    // const id = $(this).attr('data-id');
    if ($(this).is(':checked')) {
      amenityList.push(name);
    } else {
      const index = amenityList.indexOf(name);
      if (index !== -1) {
        amenityList.splice(index, 1);
      }
    }
    $('.amenities h4').text(amenityList.join(', '));
  });
});

$.ajax({
  type: 'GET',
  url: 'http://0.0.0.0:5001/api/v1/status/',
  dataType: 'json',
  success: function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  }
});
