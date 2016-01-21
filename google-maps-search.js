var places;
function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.414023, lng: 8.651009},
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.HYBRID,
    labels: true
  });

  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  var elevator = new google.maps.ElevationService;
  var infowindow = new google.maps.InfoWindow({map: map});



function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);
  markers.push(marker);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
    console.log("here");
  }
  console.log("here");

}


function setAddress(lat, lng){
  url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+
    ","+lng+"&key= AIzaSyBToV0dAyqRzQDwwfkMoTnolvUb_ebE2RE"
  var response = $.get( url, function( data ) {
    placeName = data["results"][0]["formatted_address"];
    $("#address").empty().append(placeName);
  });
}


function displayLocationElevation(location, elevator, infowindow) {
  // Initiate the location request
  elevator.getElevationForLocations({
    'locations': [location]
  }, function(results, status) {
    infowindow.setPosition(location);
    if (status === google.maps.ElevationStatus.OK) {
      // Retrieve the first result
      if (results[0]) {
        // Open the infowindow indicating the elevation at the clicked position.
        $("#elevation").empty().append(results[0].elevation + ' meters.');
      } else {
        infowindow.setContent('No results found');
      }
    } else {
      $("#elevation").empty().append('Elevation service failed due to: ' + status);
    }
  });
}


  map.addListener('click', function (e){
    console.log("clicked");
    clearMarkers();
    placeMarkerAndPanTo(e.latLng, map);
    lat = e.latLng.toJSON()["lat"]
    lng = e.latLng.toJSON()["lng"]
    $("#lat").empty().append(lat);
    $("#lng").empty().append(lng);
    setAddress(lat, lng);
    displayLocationElevation(e.latLng, elevator, infowindow);
  });



  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  // [END region_getplaces]
}
