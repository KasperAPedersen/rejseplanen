let map;
let directionsService;
let directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: 55.5003231, lng: 11.6258972},
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
    let tripContainer = document.getElementById('trip');
    tripContainer.innerHTML = "";
    tripContainer.style.display = "block";

    for(let i = 0; i < steps.length; i++) {
        let instruction = steps[i].instructions;
        let time;

        switch(steps[i].travel_mode) {
            case 'TRANSIT':
                time = `${steps[i].transit.line.name} ${steps[i].transit.departure_time.text}`;
                break;
            case 'WALKING':
                time = `${steps[i].distance.text} (${steps[i].duration.text})`;
                break;
        }

        let elem = document.createElement('div');
        elem.innerHTML = `
            <p>${instruction}</p><p>${time}</p>
            <div class="clearFix"></div>
        `;
        tripContainer.appendChild(elem);
    }
}