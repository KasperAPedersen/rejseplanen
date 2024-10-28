let map, directionsService, directionsRenderer;
let markers = [];
let position = {lat: 55.5003231, lng: 11.6258972};


async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById('googleMap'), {
        center: position,
        zoom: 7,
        mapId: "b0a4345779163eca"
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

let addMarker = async (location) => {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    let newMarker = new AdvancedMarkerElement({
        map: map,
        position: location,
        title: "Uluru",
    });

    markers.push(newMarker);
    map.setCenter(location);
    map.setZoom(13);
}

let resetMap = () => {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

let geo = async (address) => {
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === "OK") {
                const latitude = results[0].geometry.location.lat();
                const longitude = results[0].geometry.location.lng();
                resolve({ lat: latitude, lng: longitude });
            } else {
                console.error("Geocoding failed:", status);
                reject(status);
            }
        });
    });
}