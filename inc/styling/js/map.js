let map, directionsService, directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: 55.5003231, lng: 11.6258972},
        zoom: 7
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}