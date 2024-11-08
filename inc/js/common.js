// noinspection JSUnresolvedReference
let darkMode = false; // Flag to track dark mode state
let base = "https://xmlopen.rejseplanen.dk/bin/rest.exe/"; // Base URL for API requests

// Function to fetch location data based on user input
const getLocationData = async (userInput) => {
    const res = await fetch(`${base}location?input=${userInput}&format=json`);
    if (!res.ok) {
        console.error("Failed to fetch location");
        return;
    }
    return res.json();
};

// Function to fetch direction data between two locations
let getDirectionData = async (from, to) => {
    const res = await fetch(`${base}trip?originId=${from}&destId=${to}&format=json`);
    if (!res.ok) {
        console.error("Failed to fetch directions");
        return;
    }
    return res.json();
}

// Function to fetch train stops data based on a reference URL
const getTrainStopsData = async (ref) => {
    const res = await fetch(ref);
    if (!res.ok) {
        console.error("Failed to fetch journey");
        return;
    }
    return await res.json();
}

// Function to set the active tab and update its class
let setActiveTab = (e) => {
    document.querySelectorAll('h2').forEach(element => element.className = "navBtn");
    e.className = `activeNavBtn navBtn ${darkMode ? 'darkMode' : ''}`;
};

// Function to show dropdown suggestions based on user input
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

// Function to set the time on a date object
let setTime = (date, time) => {
    let [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
}

// Function to set the date on a date object
let setDate = (date, day) => {
    let [year, month, dayOfMonth] = day.split('-').map(Number);
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(dayOfMonth);
    return date;
}

// Function to get the appropriate icon based on the mode of transport
let getIcon = (mode) => {
    switch(mode.toUpperCase()) {
        case 'WALKING':
            return '<i class="fas fa-walking"></i>';
        case 'BUS':
        case 'EXB':
            return '<i class="fas fa-bus"></i>';
        case 'TOG':
        case 'REG':
        case 'IC':
        case 'S':
        case 'LYN':
            return '<i class="fas fa-train"></i>';
        default:
            return '';
    }
}

// Function to toggle dark mode on and off
let toggleDarkMode = () => {
    darkMode = !darkMode;
    let body = document.body;
    body.classList.toggle('darkMode');
    document.querySelectorAll('.navBtn.activeNavBtn').forEach(el => {
        el.classList.toggle('darkMode');
    });
};