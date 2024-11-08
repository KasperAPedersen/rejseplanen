// Initialize variables for the map, directions service, and directions renderer
let map, directionsService, directionsRenderer;
let markers = []; // Array to store map markers
let position = {lat: 55.5003231, lng: 11.6258972}; // Default map center position

// Function to initialize the map
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    // Create a new map centered at the default position
    map = new Map(document.getElementById('googleMap'), {
        center: position,
        zoom: 7,
        mapId: "b0a4345779163eca"
    });

    // Initialize the directions service and renderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

// Function to add a marker to the map at a specified location
let addMarker = async (location) => {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    let newMarker = new AdvancedMarkerElement({
        map: map,
        position: location,
        title: "Map marker",
    });

    // Add the new marker to the markers array and update the map center and zoom
    markers.push(newMarker);
    map.setCenter(location);
    map.setZoom(13);
}

// Function to reset the map by removing all markers and resetting the map center and zoom
let resetMap = () => {
    markers.forEach(marker => marker.setMap(null)); // Remove each marker from the map
    markers = []; // Clear the markers array
    map.setCenter(position); // Reset the map center
    map.setZoom(7); // Reset the map zoom
    directionsRenderer.setMap(null); // Remove the directions renderer from the map
    directionsRenderer = new google.maps.DirectionsRenderer(); // Reinitialize the directions renderer
    directionsRenderer.setMap(map); // Set the directions renderer to the map
}

// Function to get the coordinates of an address using the Google Maps Geocoder
let getCoordinates = async (address) => {
    const geocoder = new google.maps.Geocoder();

    // Return a promise that resolves with the coordinates of the address
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