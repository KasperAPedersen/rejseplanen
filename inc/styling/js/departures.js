// noinspection JSUnresolvedReference

const showDepartures = e => {
    ['search', 'journeyTable', 'departuresTable'].forEach(id => document.getElementById(id).style.display = "none");
    document.getElementById('departures').style.display = "block";
    setActiveTab(e);
};

document.getElementById('station').addEventListener('input', async (e) => {
    await showDropDown('station', e.target.value, true);
});

document.getElementById('submitDepartures').addEventListener('submit', async (e) => {
    e.preventDefault();
    resetMap();


    const value = document.getElementById('station').value;
    let time = document.getElementById('stationTime').value;
    const container = document.getElementById('departuresTable');

    if(!value) {
        container.style.display = 'none';
        window.alert('Please enter a station');
        return;
    }

    container.innerHTML = "";

    const data = await getLocationData(value);
    if (!data.LocationList.StopLocation) {
        window.alert('No station found');
        return;
    }

    const id = data.LocationList.StopLocation[0].id;
    const departures = await getDepartures(id, time);

    if (!departures.DepartureBoard.Departure) {
        window.alert('No departures found');
        return;
    }

    // --

    let coordinates = await geo(value);
    await addMarker(coordinates);
    // --

    for(let i = 0; i < departures.DepartureBoard.Departure.length; i++) {
        let departure = departures.DepartureBoard.Departure[i];
        let {name: departureName, direction: departureDirection, time: departureTime, rtTime: departureDelayedTime, JourneyDetailRef: departureRef, rtTrack: departureTrack} = departure;
        let icon = getIcon(departure.type);
        const elem = document.createElement('div');
        elem.className = "DepartureTimeCard";
        elem.onclick = async () => {
            let departureContainer = elem.getElementsByClassName('departureContainer')[0];
            departureContainer.style.display = departureContainer.style.display === 'block' ? 'none' : 'block';
            departureContainer.innerHTML = "";

            let stops = (await getTrainStopsData(departureRef.ref)).JourneyDetail.Stop;
            for(let i = 0; i < stops.length; i++) {
                let { name: stopName, depTime: stopDepartureTime, arrTime: stopArrivalTime } = stops[i];

                let stopElement = document.createElement('p');
                stopElement.innerHTML = `<p>${stopName}<span>${stopDepartureTime ?? stopArrivalTime ?? ""}</span></p>`;
                departureContainer.appendChild(stopElement);
            }
        };
        elem.innerHTML = `
            <div><p>${icon} ${departureName}</p>
            <p>${departureDirection}</p></div>
            <p>${departureTime} ${(departureDelayedTime ? `<span>(${departureDelayedTime})</span>` : "")}<br>${departureTrack ? `Spor ${departureTrack}` : ""}</p>
            <div class="clearFix"></div>
            <div class="departureContainer"></div>
        `;
        container.appendChild(elem);
    }

    container.style.display = 'block';
});

const getDepartures = async (id, time) => {
    const res = await fetch(`${base}departureBoard?id=${id}&time=${time}&useTog=1&useBus=1&format=json`);
    if (!res.ok) {
        console.error("Failed to fetch location");
        return;
    }
    return res.json();
};
