let base = "https://xmlopen.rejseplanen.dk/bin/rest.exe/";

document.getElementById('from').addEventListener('input', async (e) => {
    let value = e.target.value;

    let parent = document.getElementById('fromContainer');
    parent.innerHTML = "";

    if(value === "") return;

    let places = await getPlaces( await getData(value) );

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

    let places = await getPlaces( await getData(value) );

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



let getData = async (inp) => {
    let res = await fetch(`${base}location?input=${inp}/&format=json`, {
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

let getPlaces = async (data) => {
    return data.LocationList.CoordLocation;
}