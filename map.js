let map;
let directionsService;
let directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: 40.7128, lng: -74.0060},
        zoom: 7
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

document.getElementById('search').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const response = await getDirections(
            document.getElementById('from').value,
            document.getElementById('to').value
        );

        directionsRenderer.setDirections(response);
        showTextDirections(response);
    } catch (error) {
        window.alert(error);
    }
});

let getDirections = async (origin, destination) => {
    return new Promise((resolve, reject) => {
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode["TRANSIT"]
        }, (response, status) => {
            if (status === 'OK') {
                resolve(response);
            } else {
                reject('Directions request failed due to ' + status);
            }
        });
    });
}

let showTextDirections = (directions) => {
    let steps = directions.routes[0].legs[0].steps;

    for(let i = 0; i < steps.length; i++) {
        console.log(steps[i]);
        let instruction = steps[i].instructions;
        let type = steps[i].travel_mode;
        if(type === "TRANSIT") {
            instruction = `[${steps[i].transit.departure_time.text}] ${steps[i].transit.line.name} ${instruction}`;
        }
        console.log(instruction);
    }
}