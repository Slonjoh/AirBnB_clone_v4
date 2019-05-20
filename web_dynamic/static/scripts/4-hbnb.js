$(document).ready(() => {
  let amenityDict = {};
  $('input:checkbox').change(() => {
    if ($(this).is(':checked')) {
      $('li > input:checkbox:checked').map(function () {
        amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
      }).get();
      $('div.amenities > h4').text(Object.values(amenityDict));
    } else {
      amenityDict = {};
      $('li > input:checkbox:checked').map(function () {
        amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
      }).get();
      $('div.amenities > h4').text(Object.values(amenityDict));
    }
  });

  let request = new XMLHttpRequest();
  const url = 'http://0.0.0.0:5001/api/v1/status/';

  request.responseType = 'json';
  request.open('GET', url, true);
  request.onreadystatechange = function () {
    if (request.response['status'] === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  };
  request.send();

  let userNames = [];

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/users/',
    success: (users) => {
      $.each(users, function (i, user) {
        userNames[user['id']] = user['first_name'] + ' ' + user['last_name'];
      });
    }
  });

  function amenityCheck (place) {
    alert(place.amenities[0].id);
    alert(Object.keys(amenityDict)[0]);
    for (amenity in place.amenities) {
      for (selectAmenity in Object.keys(amenityDict)) {
        if (amenity.id === selectAmenity) {
          return (true);
        }
      }
    }
  }
  function placeFilter (amenityIds) {
    let found = 0;
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      data: {'amenities': amenityIds},
      contentType: 'application/json',
      dataType: 'json',
      success: function (places) {
        $('SECTION.places').empty();
        $('SECTION.places').append('<h1>Places</h1>');
        console.log(places[0]);
        $.each(places, function (i, place) {
          $('SECTION.places').append('<article></article>');
          $('SECTION.places > article:last')
            .append('<div class="title"></div>')
            .append('<div class="information"></div>')
            .append('<div class="user"></div>')
            .append('<div class="description"></div>');
          $('DIV.title:last')
            .append('<h2>' + place.name + '</h2>')
            .append('<div class="price_by_night">$' + place.price_by_night + '</div>');
          $('DIV.information:last')
            .append('<div class="max_guest"></div>')
            .append('<div class="number_rooms"></div>')
            .append('<div class="number_bathrooms"></div>');
          $('DIV.user:last')
            .append('<strong>Owner:</strong> ' + userNames[place.user_id]);
          $('DIV.max_guest:last')
            .append('<i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + place.max_guest + ' Guests');
          $('DIV.number_rooms:last')
            .append('<i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + place.number_rooms + ' Bedrooms');
          $('DIV.number_bathrooms:last')
            .append('<i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' + place.number_bathrooms + ' Bathroom');
          $('SECTION.places > article:last > div.description').append('<div class="description">' + place.description + '</div>');
        });
      }
    });
  };

  $('button').click(() => {
    placeFilter(Object.keys(amenityDict));
  });
});
