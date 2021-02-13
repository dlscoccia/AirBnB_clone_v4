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

$.ajax({
  type: 'POST',
  url: 'http://0.0.0.0:5001/api/v1/places_search/',
  data: JSON.stringify({}),
  contentType: 'application/json',
  success: function (data) {
    for (let i = 0; i < data.length; i++) {
      $('section.places').append(`<article><div class="title_box"><h2>${data[i].name}</h2><div class="price_by_night">${data[i].price_by_night}</div></div><div class="information"><div class="max_guest">${data[i].max_guest}</div><div class="number_rooms">${data[i].number_rooms}</div><div class="number_bathrooms">${data[i].number_bathrooms}</div></div><div class="description">${data[i].description}</div></div></article>`);
    }
  }
});
