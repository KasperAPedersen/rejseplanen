let map, directionsService, directionsRenderer;
let markers = [];
let position = {lat: 55.5003231, lng: 11.6258972};


async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById('googleMap'), {
        center: position,
        zoom: 7
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}