// noinspection JSUnresolvedReference

const showSearch = e => {
    ['departures', 'journeyTable', 'departuresTable'].forEach(id => document.getElementById(id).style.display = "none");
    document.getElementById('search').style.display = "block";
    setActiveTab(e);
};

document.getElementById('from').addEventListener('input', async (e) => {
    await showDropDown('from', e.target.value);
});

document.getElementById('to').addEventListener('input', async (e) => {
    await showDropDown('to', e.target.value);
});

document.getElementById('submitSearch').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const fromLocation = document.getElementById('from').value;
        const toLocation = document.getElementById('to').value;
        const time = setDate(document.getElementById('time').value);
        if (!fromLocation || !toLocation) {
            window.alert('Please enter both origin and destination.');
            return;
        }
        const directionsResponse = await getDirections(fromLocation, toLocation, time);
        console.log(directionsResponse);

        directionsRenderer.setDirections(directionsResponse);
        showTextDirections(directionsResponse);
    } catch (error) {
        window.alert(`Error fetching directions: ${error}`);
    }
});

let showTextDirections = (directions) => {
    let steps = directions.routes[0].legs[0].steps;
    let journeyContainer = document.getElementById('journeyTable');
    journeyContainer.innerHTML = "";
    journeyContainer.style.display = "block";

    steps.forEach(step => {
        let { instructions: departureInstruction, travel_mode } = step;
        let arrivalInstruction = "", arrivalTime = "", departureTime = "";

        if (travel_mode === 'TRANSIT') {
            let { arrival_time, departure_time, arrival_stop, line } = step.transit;
            arrivalTime = arrival_time.text;
            departureTime = departure_time.text;
            arrivalInstruction = arrival_stop.name;
            departureInstruction = `${line.name} ${departureInstruction}`;
        } else if (travel_mode === 'WALKING') {
            departureTime = step.duration.text;
        }

        let elem = document.createElement('div');
        elem.innerHTML = `
            <label>Afgang:</label>
            <p>${departureInstruction} <span>${departureTime}</span></p>
            ${travel_mode === 'TRANSIT' ? `<label>Ankomst:</label><p>${arrivalInstruction} <span>${arrivalTime}</span></p>` : ""}
            <div class="clearFix"></div>
        `;
        journeyContainer.appendChild(elem);
    });
}

const getDirections = async (origin, destination, time) => {
    return new Promise((resolve, reject) => {
        if (!directionsService) {
            reject('Directions service is not initialized.');
            return;
        }
        console.log(time);
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: {
                departureTime: time
            }
        }, (response, status) => {
            if (status === 'OK') {
                resolve(response);
            } else {
                reject(`Directions request failed due to ${status}`);
            }
        });
    });
}

let setDate = (time) => {
    let [hours, minutes] = time.split(':').map(Number);
    let date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
}