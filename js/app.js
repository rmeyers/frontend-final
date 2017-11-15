
// Make a list of all of the cafes and locations I'd like to include

var locations = [
    {'name' : 'Cafe Plenty',
     'location' : {lat: 43.648948, lng: -79.378311}},
    {'name' : 'Cafe Victoria',
     'location' : {lat: 43.649694, lng:  -79.376775}},
];

var marker, infowindow, map;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.648181, lng: -79.378974},
        zoom: 14,
    });

    for (i=0; i<locations.length; i++){
        marker = new google.maps.Marker({
            position: locations[i].location,
            map: map,
            title: locations[i].name
        });
        infowindow = new google.maps.InfoWindow({
            content: "This is where the content would go!"
        });
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });

    }
}
