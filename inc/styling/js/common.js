let base = "https://xmlopen.rejseplanen.dk/bin/rest.exe/";

const getLocationData = async (inp) => {
    const res = await fetch(`${base}location?input=${inp}&format=json`);
    if (!res.ok) {
        console.error("Failed to fetch location");
        return;
    }
    return res.json();
};

const getJourneyData = async (ref) => {
    const res = await fetch(ref);
    if (!res.ok) {
        console.error("Failed to fetch journey");
        return;
    }
    return await res.json();
}

let setActiveTab = (e) => {
    document.querySelectorAll('h2').forEach(element => element.className = "navBtn");
    e.className = "activeNavBtn navBtn";
};

let showDropDown = async (container, value, useStopLocation = false) => {
    let parent = document.getElementById(`${container}Container`);

    if (!value) return;
    let places = await (await getLocationData(value)).LocationList[useStopLocation ? 'StopLocation' : 'CoordLocation'] ?? [];

    if (!places.length) return;

    ['journeyTable', 'departuresTable'].forEach(id => document.getElementById(id).style.display = "none");
    parent.style.display = 'block';
    parent.innerHTML = "";

    places.forEach(place => {
        let elem = document.createElement('div');
        elem.innerHTML = place.name;
        elem.className = "dropdown";
        elem.onclick = () => {
            document.getElementById(container).value = place.name;
            parent.style.display = 'none';
            parent.innerHTML = "";
        };
        parent.appendChild(elem);
    });
}