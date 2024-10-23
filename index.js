let base = "https://xmlopen.rejseplanen.dk/bin/rest.exe/";

document.getElementById('from').addEventListener('input', async (e) => {
    let value = e.target.value;

    let parent = document.getElementById('fromContainer');
    parent.innerHTML = "";

    if(value === "") return;

    let places = await getCoordLocation( await getData(value) );

    if(places === undefined) return;

    for(let i = 0; i < places.length; i++) {
        let elem = document.createElement('div');
        elem.innerHTML = `${places[i].name}`;
        elem.className = "dropdown";
        elem.onclick = () => {
            document.getElementById('from').value = places[i].name;
            parent.innerHTML = "";
        };
        parent.appendChild(elem);
    }
});

document.getElementById('to').addEventListener('input', async (e) => {
    let value = e.target.value;

    let parent = document.getElementById('toContainer');
    parent.innerHTML = "";

    if(value === "") return;

    let places = await getCoordLocation( await getData(value) );

    if(places === undefined) return;

    for(let i = 0; i < places.length; i++) {
        let elem = document.createElement('div');
        elem.innerHTML = `${places[i].name}`;
        elem.className = "dropdown";
        elem.onclick = () => {
            document.getElementById('to').value = places[i].name;
            parent.innerHTML = "";
        };
        parent.appendChild(elem);
    }
});

document.getElementById('station').addEventListener('input', async (e) => {
    let value = e.target.value;

    let parent = document.getElementById('stationContainer');
    parent.innerHTML = "";

    if(value === "") return;

    let places = await getStopLocation( await getData(value) );

    if(places === undefined) return;

    for(let i = 0; i < places.length; i++) {
        let elem = document.createElement('div');
        elem.innerHTML = `${places[i].name}`;
        elem.className = "dropdown";
        elem.onclick = () => {
            document.getElementById('station').value = places[i].name;
            parent.innerHTML = "";
        };
        parent.appendChild(elem);
    }
});

document.getElementById('submitDepartures').addEventListener('submit', async (e) => {
    e.preventDefault();
    let value = document.getElementById('station').value;
    let container = document.getElementById('departuresTable');

    let data = await getData(value);
    let id = data.LocationList.StopLocation[0].id;

    let departures = await getDepartures(id);

    for(let i = 0; i < departures.DepartureBoard.Departure.length; i++) {

        let departure = departures.DepartureBoard.Departure[i];

        let elem = document.createElement('div');
        elem.innerHTML = `
            <div><p>${departure.name}</p>
            <p>${departure.direction}</p></div>
            <p>${departure.time}</p>
        `;
        container.appendChild(elem);
        container.style.display = 'block';
    }

});

let getDepartures = async (id) => {
    let res = await fetch(`${base}departureBoard?id=${id}&useTog=1&useBus=1&format=json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if(!res.ok) {
        console.error("Failed to fetch location");
        return;
    }

    return await res.json();
}

let getData = async (inp) => {
    let res = await fetch(`${base}location?input='${inp}'&format=json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if(!res.ok) {
        console.error("Failed to fetch location");
        return;
    }

    return await res.json();
}

let getCoordLocation = async (data) => {
    return data.LocationList.CoordLocation;
}

let getStopLocation = async (data) => {
    return data.LocationList.StopLocation;
}

let showSearch = (e) => {
    document.getElementById('search').style.display = "block";
    document.getElementById('departures').style.display = "none";
    document.getElementById('trip').style.display = "none";
    document.getElementById('departuresTable').style.display = "none";
    setActiveTab(e);
}

let showDepartures = (e) => {
    document.getElementById('search').style.display = "none";
    document.getElementById('departures').style.display = "block";
    document.getElementById('trip').style.display = "none";
    document.getElementById('departuresTable').style.display = "none";
    setActiveTab(e);
}

let setActiveTab = (e) => {
    let elements = document.getElementsByTagName('h2');
    for(let i = 0; i < elements.length; i++) {
        elements[i].className = "";
    }
    e.className = "active";
}