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
const amenityListIds = [];
const placesIds = [];
const stateListIds = [];
const cityListIds = [];
const statesAndCities = [];
docReady(function () {
  $('input').css('margin-right', '10px');
  $('h4').css({'widht':'95%','height':'14px','overflow':'hidden','text-overflow':'ellipsis','white-space':'nowrap'});
  $('div.reviews').css('background-color', 'blue');
  const myAmenityCheckbox = $('.amenities input');
  const myStateCheckbox = $('.locations ul li h2 input');
  const myCityCheckbox = $('.locations ul li ul li input');
  $(myAmenityCheckbox).click(function () {
    const name = $(this).attr('data-name');
    const id = $(this).attr('data-id');
    if ($(this).is(':checked')) {
      amenityList.push(name);
      amenityListIds.push(id);
    } else {
      const index = amenityList.indexOf(name);
      if (index !== -1) {
        amenityList.splice(index, 1);
        amenityListIds.splice(index, 1);
      }
    }
    $('.amenities h4').text(amenityList.join(', '));
  });

  $(myStateCheckbox).click(function () {
    const nameState = $(this).attr('data-name');
    const idState = $(this).attr('data-id');
    if ($(this).is(':checked')) {
      stateListIds.push(idState);
      statesAndCities.push(nameState);
    } else {
      const index = stateListIds.indexOf(idState);
      const indexStateCity = statesAndCities.indexOf(nameState);
      if (index !== -1) {
        stateListIds.splice(index, 1);
      } if (indexStateCity !== -1) {
        statesAndCities.splice(indexStateCity, 1);
      }
    }
    $('.locations h4').text(statesAndCities.join(', '));
  });
  $(myCityCheckbox).click(function () {
    const nameCity = $(this).attr('data-name');
    const idCity = $(this).attr('data-id');
    if ($(this).is(':checked')) {
      cityListIds.push(idCity);
      statesAndCities.push(nameCity);
    } else {
      const index = cityListIds.indexOf(idCity);
      const indexStateCity = statesAndCities.indexOf(nameCity);
      if (index !== -1) {
        cityListIds.splice(index, 1);
      }
      if (indexStateCity !== -1) {
        statesAndCities.splice(indexStateCity, 1);
      }
    }
    $('.locations h4').text(statesAndCities.join(', '));
  });
  const myButton = $('button');
  $(myButton).click(function () {
    $('section.places article').remove();
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify({ states: stateListIds, cities: cityListIds, amenities: amenityListIds }),
      contentType: 'application/json',
      success: function (data) {
        for (let i = 0; i < data.length; i++) {
          placesIds.push(data[i].id);
          $('section.places').append(`<article><div class="title_box"><h2>${data[i].name}</h2><div class="price_by_night">${data[i].price_by_night}</div></div><div class="information"><div class="max_guest">${data[i].max_guest}</div><div class="number_rooms">${data[i].number_rooms}</div><div class="number_bathrooms">${data[i].number_bathrooms}</div></div><div class="description">${data[i].description}</div><div class="reviews"><h2>Reviews</h2><ul><li><h3></h3><p></p></li></ul></div></div></article>`);
        }
      }
    });
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
      placesIds.push(data[i].id);
      $('section.places').append(`<article id=${i}><div class="title_box"><h2>${data[i].name}</h2><div class="price_by_night">${data[i].price_by_night}</div></div><div class="information"><div class="max_guest">${data[i].max_guest}</div><div class="number_rooms">${data[i].number_rooms}</div><div class="number_bathrooms">${data[i].number_bathrooms}</div></div><div class="description">${data[i].description}</div></div></article>`);

var usersNames = {};
$.get('http://0.0.0.0:5001/api/v1/users/', function (data) {
for(let i = 0; i < data.length; i++) {
usersNames[data[i].id] = data[i].first_name + ' ' +data[i].last_name;
}
//console.log(usersNames);
});

$.get('http://0.0.0.0:5001/api/v1/places/' + placesIds[i] + '/reviews/', function (data) {
if (data.length !== 0) {
let selector = 'section.places article#' + i;
let reviewString = '';
if (data.length === 1){
reviewString = 'Review'; 
} else {
reviewString = 'Reviews'; }
$(selector).append(`<div class="reviews"><h2>${data.length} ${reviewString}</h2><ul></ul></div>`);
for (let y = 0; y < data.length; y++) {
let text = data[y].text; 
let date = data[y].created_at.slice(0, 10);
let userReview = usersNames[data[y].user_id];
$(selector + ' ul').append(`<li><h3>From ${userReview} the ${date}</h3><p>${text}</p></li>`);
$(selector + ' .reviews h2').css({'font-size':'16px', 'margin-top':'40px','border-bottom':'solid #DDDDDD 1px','text-align':'left'});
$(selector + ' .reviews ul li').css('list-style','none');
$(selector + ' .reviews ul li h3').css('font-size','14px');
$(selector + ' .reviews ul li p').css('font-size','12px');
 }};
});
}
}
});
