// noinspection JSUnresolvedReference

// Function to show the search tab and hide other elements
const showSearch = e => {
    ['departures', 'journeyTable', 'departuresTable'].forEach(id => document.getElementById(id).style.display = "none");
    document.getElementById('search').style.display = "block";
    setActiveTab(e);
};

// Event listener for input in the 'searchFrom' field to show dropdown suggestions
document.getElementById('searchFrom').addEventListener('input', async (e) => {
    await showDropDown('searchFrom', e.target.value);
});

// Event listener for input in the 'searchTo' field to show dropdown suggestions
document.getElementById('searchTo').addEventListener('input', async (e) => {
    await showDropDown('searchTo', e.target.value);
});

// Event listener for form submission to fetch and display journey directions
document.getElementById('searchSubmit').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        resetMap();
        const fromLocation = document.getElementById('searchFrom').value;
        const toLocation = document.getElementById('searchTo').value;
        const dateInput = document.getElementById('searchDate').value;
        const timeInput = document.getElementById('searchTime').value;

        let date = new Date();
        if(timeInput) date = setTime(date, timeInput);
        if(dateInput) date = setDate(date, dateInput);

        if (!fromLocation || !toLocation) {
            window.alert('Please enter both origin and destination.');
            return;
        }
        const directionsResponse = await getDirections(fromLocation, toLocation, date);

        directionsRenderer.setDirections(directionsResponse);
        showTextDirections(directionsResponse);
    } catch (error) {
        window.alert(`Error fetching directions: ${error}`);
    }
});

// Function to display text directions in the journey table
let showTextDirections = (directions) => {
    let steps = directions.routes[0].legs[0].steps;
    let journeyContainer = document.getElementById('journeyTable');
    journeyContainer.innerHTML = "";
    journeyContainer.style.display = "block";

    steps.forEach(step => {
        let { instructions: departureInstruction, travel_mode } = step;
        let arrivalInstruction = "", arrivalTime = "", departureTime = "";
        let icon = getIcon(travel_mode);

        if (travel_mode === 'TRANSIT') {
            let { arrival_time, departure_time, arrival_stop, line } = step.transit;
            arrivalTime = arrival_time.text;
            departureTime = departure_time.text;
            arrivalInstruction = arrival_stop.name;
            departureInstruction = `${line.name} ${departureInstruction}`;
            icon = getIcon(line.vehicle.name);
        } else if (travel_mode === 'WALKING') {
            departureTime = step.duration.text;
        }

        let elem = document.createElement('div');
        elem.innerHTML = `
            <label>Afgang:</label>
            <p>${icon} ${departureInstruction} <span>${departureTime}</span></p>
            ${travel_mode === 'TRANSIT' ? `<label>Ankomst:</label><p>${arrivalInstruction} <span>${arrivalTime}</span></p>` : ""}
            <div class="clearFix"></div>
        `;
        journeyContainer.appendChild(elem);
    });
}

// Function to get directions from the Google Maps API
const getDirections = async (origin, destination, date) => {
    return new Promise((resolve, reject) => {
        if (!directionsService) {
            reject('Directions service is not initialized.');
            return;
        }

        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: {
                departureTime: date
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