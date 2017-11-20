

// This is the list of all the cafes in Toronto that I want to include in this tool
var locations = [
    {title : 'Cafe Plenty',
     location : {lat: 43.64948, lng: -79.378311}},
    {title : 'Cafe Victoria',
     location : {lat: 43.649694, lng:  -79.376775}},
    {title : 'Infuse Cafe',
     location : {lat: 43.658069, lng:  -79.382087}},
    {title : 'Timothy\'s',
     location : {lat: 43.656020, lng:  -79.382773}},
    {title : 'Balzac\'s',
     location : {lat: 43.657712, lng:  -79.379362}},
];

// Initiate the map global variable
var map;

// View Model function
function ViewModel() {
  var self = this;

  // Create the variables for locationList and the searchTerm
  this.locationList = ko.observableArray([]);
  this.searchTerm = ko.observable('');

  // Create the map using the coords for the center of Toronto
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 43.648181, lng: -79.378974},
      zoom: 14,
  });

  // Create the markers and add them all to the location list
  // This runs the "Marker" function, below
  locations.forEach(function(location) {
    self.locationList.push(new Marker(location));
  });

  // This modifies the filtered list based on whether or not the search term is found in the
  // cafe names.
  this.filteredList = ko.computed(function() {
    // Make the search case insensitive
    var search = self.searchTerm().toLowerCase();
    // If no search being performed, show all locations.
    if (!search) {
      self.locationList().forEach(function(eachLocation){
        eachLocation.visible(true);
      });
      return self.locationList();
    } else {
      // If there is a search being performed, use the Knockout arrayFilter function
      var updatedList = ko.utils.arrayFilter(self.locationList(), function(eachLocation) {
        var lowercaseName = eachLocation.title.toLowerCase();
        // If the search term is found in the cafe name, result will be true, otherwise false.
        var result = (lowercaseName.search(search) >= 0);
        eachLocation.visible(result);
        return result;
      });
      return updatedList;
    }
  });
}

// This function creates the marker for each location, as well as the content for the marker.
function Marker(location) {
  var self = this;

  // Initiate the variables
  this.address1 = '';
  this.address2 = '';
  this.checkins = 0;
  this.position = location.location;
  this.title = location.title;
  this.visible = ko.observable(true);
  var lat = location.location.lat;
  var lon = location.location.lng;

  var clientId = 'WJDD5S3RCIOTUKI4NLSKQYMW0ODMTC3X2IPMHDCIRJOHUQZQ';
  var clientSecret = 'V1B3EVZJLF1HQF5NH5KGQR42EHGO244S0DOOQTFGJUGJQEOT';
  var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ lat + ',' + lon + '&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.title;

  // Run the AJAX call using JQuery to get the Four Square results.
  $.getJSON(foursquareURL).done(function(data) {
    var results = data.response.venues[0];
    self.address1 = results.location.formattedAddress[0];
    self.address2 = results.location.formattedAddress[1];
    self.checkins = results.stats.checkinsCount;
  }).fail(function() {
    alert("FourSquare API call error. Try again.");
  });

  this.infoWindow = new google.maps.InfoWindow({content: self.windowContent});

  // Create the marker and add to the map
  this.marker = new google.maps.Marker({
    position: this.position,
    title: this.title,
    animation: google.maps.Animation.DROP,
    map: map
  });

  // This is where the search comes into play. If the visible state is false, hide the marker.
  this.showMarker = ko.computed(function() {
    if(this.visible() === true) {
      this.marker.setMap(map);
    } else {
      this.marker.setMap(null);
    }
    return true;
  }, this);

  // Add a listener to the marker so that a click event shows the info window.
  this.marker.addListener('click', function(){
    self.windowContent = '<div><strong>' + self.title + '</strong></div>' +
      '<div><i>Address:</i> ' + self.address1 + '</div>' +
      '<div>' + self.address2 + '</div>' +
      '<div><i>FourSquare Checkins: </i>' + self.checkins + '</div>';
    self.infoWindow.setContent(self.windowContent);
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      self.marker.setAnimation(null);
    }, 1450);
    self.infoWindow.open(map, this);
  });

  this.bounce = function(place) {
    google.maps.event.trigger(this.marker, 'click');
  };
}

// Function to be run on page load which links the model to the view.
var initApp = function() {
  ko.applyBindings(new ViewModel());
};





