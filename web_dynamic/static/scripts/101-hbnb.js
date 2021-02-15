function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === 'complete' ||
      document.readyState === 'interactive') {
      // call on next available tick
      setTimeout(fn, 1);
  } else {
      document.addEventListener('DOMContentLoaded', fn);
  }
}

// List to stores all amenity checked to show on h4 tag
const amenityList = [];
// List to stores all amenity ids checked
const amenityListIds = [];
// List to stores all places ids checked
const placesIds = [];
// List to stores all state ids checked
const stateListIds = [];
// List to stores all city ids checked
const cityListIds = [];
// List to stores both states & cities checked to show on h4 tag
const statesAndCities = [];
// Dictionary to store users names using their ids
var usersNames = {};

// DOM is ready
docReady(function() {
  // CCS styles for inputs & h4 tags
  $('input').css('margin-right', '10px');
  $('h4').css({ 'widht': '95%', 'height': '14px', 'overflow': 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' });
  // Variables to create event on inputs click
  const myAmenityCheckbox = $('.amenities input');
  const myStateCheckbox = $('.locations ul li h2 input');
  const myCityCheckbox = $('.locations ul li ul li input');
  // Event for click on amenity inputs
  $(myAmenityCheckbox).click(function() {
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
  // Event for click on states inputs
  $(myStateCheckbox).click(function() {
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
          }
          if (indexStateCity !== -1) {
              statesAndCities.splice(indexStateCity, 1);
          }
      }
      $('.locations h4').text(statesAndCities.join(', '));
  });
  // Event for click on cities inputs
  $(myCityCheckbox).click(function() {
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
  // Event for click on the search button
  const myButton = $('button');
  $(myButton).click(function() {
      $('section.places article').remove();
      $.ajax({
          type: 'POST',
          url: 'http://0.0.0.0:5001/api/v1/places_search/',
          data: JSON.stringify({ states: stateListIds, cities: cityListIds, amenities: amenityListIds }),
          contentType: 'application/json',
          success: function(data) {
              // Loop through places
              for (let i = 0; i < data.length; i++) {
                  placesIds.push(data[i].id);
                  $('section.places').append(`<article id=${i}><div class="title_box"><h2>${data[i].name}</h2><div class="price_by_night">${data[i].price_by_night}</div></div><div class="information"><div class="max_guest">${data[i].max_guest}</div><div class="number_rooms">${data[i].number_rooms}</div><div class="number_bathrooms">${data[i].number_bathrooms}</div></div><div class="description">${data[i].description}</div></div></article>`);
                  // GET request to saves users names with ids as key
                  $.get('http://0.0.0.0:5001/api/v1/users/', function(data) {
                      for (let i = 0; i < data.length; i++) {
                          usersNames[data[i].id] = data[i].first_name + ' ' + data[i].last_name;
                      }
                  });
                  // GET request to check if there is a review for the actual place of parent loop
                  $.get('http://0.0.0.0:5001/api/v1/places/' + placesIds[i] + '/reviews/', function(data) {
                      if (data.length !== 0) {
                          let selector = 'section.places article#' + i;
                          let reviewString = '';
                          // Conditial to checks if there is Singular o Plural reviews
                          if (data.length === 1) {
                              reviewString = 'Review';
                          } else {
                              reviewString = 'Reviews';
                          }
                          $(selector).append(`<div class="reviews"><h2>${data.length} ${reviewString}</h2><ul></ul></div>`);
                          // Loop that adds all the reviews on the actual place
                          for (let y = 0; y < data.length; y++) {
                              let text = data[y].text;
                              let date = data[y].created_at.slice(0, 10);
                              let userReview = usersNames[data[y].user_id];
                              // CCS Styles for Reviews elements
                              $(selector + ' ul').append(`<li><h3>From ${userReview} the ${date}</h3><p>${text}</p></li>`);
                              $(selector + ' .reviews h2').css({ 'font-size': '16px', 'margin-top': '40px', 'border-bottom': 'solid #DDDDDD 1px', 'text-align': 'left' });
                              $(selector + ' .reviews ul li').css('list-style', 'none');
                              $(selector + ' .reviews ul li h3').css('font-size', '14px');
                              $(selector + ' .reviews ul li p').css('font-size', '12px');
                          }
                      };
                  });
              }
          }
      });
  });
});
// GET request to check status of the api
// Changes adds o removes class available on the header circle
$.ajax({
  type: 'GET',
  url: 'http://0.0.0.0:5001/api/v1/status/',
  dataType: 'json',
  success: function(data) {
      if (data.status === 'OK') {
          $('#api_status').addClass('available');
      } else {
          $('#api_status').removeClass('available');
      }
  }
});
// POST request to places_search route
// Retrieve and shows all places
$.ajax({
  type: 'POST',
  url: 'http://0.0.0.0:5001/api/v1/places_search/',
  data: JSON.stringify({}),
  contentType: 'application/json',
  success: function(data) {
      // Loop through places
      for (let i = 0; i < data.length; i++) {
          placesIds.push(data[i].id);
          $('section.places').append(`<article id=${i}><div class="title_box"><h2>${data[i].name}</h2><div class="price_by_night">${data[i].price_by_night}</div></div><div class="information"><div class="max_guest">${data[i].max_guest}</div><div class="number_rooms">${data[i].number_rooms}</div><div class="number_bathrooms">${data[i].number_bathrooms}</div></div><div class="description">${data[i].description}</div></div></article>`);
          // GET request to saves users names with ids as key
          $.get('http://0.0.0.0:5001/api/v1/users/', function(data) {
              for (let i = 0; i < data.length; i++) {
                  usersNames[data[i].id] = data[i].first_name + ' ' + data[i].last_name;
              }
          });
          // GET request to check if there is a review for the actual place of parent loop
          $.get('http://0.0.0.0:5001/api/v1/places/' + placesIds[i] + '/reviews/', function(data) {
              if (data.length !== 0) {
                  let selector = 'section.places article#' + i;
                  let reviewString = '';
                  // Conditial to checks if there is Singular o Plural reviews
                  if (data.length === 1) {
                      reviewString = 'Review';
                  } else {
                      reviewString = 'Reviews';
                  }
                  $(selector).append(`<div class="reviews"><h2>${data.length} ${reviewString}</h2><ul></ul></div>`);
                  // Loop that adds all the reviews on the actual place
                  for (let y = 0; y < data.length; y++) {
                      let text = data[y].text;
                      let date = data[y].created_at.slice(0, 10);
                      let userReview = usersNames[data[y].user_id];
                      // CCS Styles for Reviews elements
                      $(selector + ' ul').append(`<li><h3>From ${userReview} the ${date}</h3><p>${text}</p></li>`);
                      $(selector + ' .reviews h2').css({ 'font-size': '16px', 'margin-top': '40px', 'border-bottom': 'solid #DDDDDD 1px', 'text-align': 'left' });
                      $(selector + ' .reviews ul li').css('list-style', 'none');
                      $(selector + ' .reviews ul li h3').css('font-size', '14px');
                      $(selector + ' .reviews ul li p').css('font-size', '12px');
                  }
              };
          });
      }
  }
});