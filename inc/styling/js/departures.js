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
    const value = document.getElementById('station').value;
    const container = document.getElementById('departuresTable');
    container.innerHTML = "";

    const data = await getLocationData(value);
    if (!data.LocationList.StopLocation) {
        window.alert('No station found');
        return;
    }

    const id = data.LocationList.StopLocation[0].id;
    const departures = await getDepartures(id);
    console.log(departures);


    if (!departures.DepartureBoard.Departure) {
        window.alert('No departures found');
        return;
    }

    for(let i = 0; i < departures.DepartureBoard.Departure.length; i++) {
        let departure = departures.DepartureBoard.Departure[i];
        let {name: departureName, direction: departureDirection, time: departureTime, rtTime: departureDelayedTime, JourneyDetailRef: departureRef} = departure;

        const elem = document.createElement('div');
        elem.className = "DepartureTimeCard";
        elem.onclick = async () => {
            let departureContainer = elem.getElementsByClassName('departureContainer')[0];
            departureContainer.style.display = departureContainer.style.display === 'block' ? 'none' : 'block';

            let stops = (await getTrainStopsData(departureRef.ref)).JourneyDetail.Stop;
            for(let i = 0; i < stops.length; i++) {
                let { name: stopName, depTime: stopDepartureTime, arrTime: stopArrivalTime } = stops[i];
                console.log(stops[i]);
                let stopElement = document.createElement('p');
                stopElement.innerHTML = `<p>${stopName}<span>${stopDepartureTime ?? stopArrivalTime ?? ""}</span></p>`;
                departureContainer.appendChild(stopElement);
            }
        };
        elem.innerHTML = `
            <div><p>${departureName}</p>
            <p>${departureDirection}</p></div>
            <p>${departureTime} ${(departureDelayedTime ? `<span>(${departureDelayedTime})</span>` : "")}</p>
            <div class="clearFix"></div>
            <div class="departureContainer"></div>
        `;
        container.appendChild(elem);
    }

    container.style.display = 'block';
});

const getDepartures = async (id) => {
    const res = await fetch(`${base}departureBoard?id=${id}&useTog=1&useBus=1&format=json`);
    if (!res.ok) {
        console.error("Failed to fetch location");
        return;
    }
    return res.json();
};
