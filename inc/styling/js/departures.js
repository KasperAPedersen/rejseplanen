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

    const data = await getData(value);
    if (!data.LocationList.StopLocation) {
        window.alert('No station found');
        return;
    }

    const id = data.LocationList.StopLocation[0].id;
    const departures = await getDepartures(id);
    if (!departures.DepartureBoard.Departure) {
        window.alert('No departures found');
        return;
    }

    departures.DepartureBoard.Departure.forEach(departure => {
        const elem = document.createElement('div');
        elem.innerHTML = `
            <div><p>${departure.name}</p>
            <p>${departure.direction}</p></div>
            <p>${departure.time}</p>
        `;
        container.appendChild(elem);
    });

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