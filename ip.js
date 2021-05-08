// Leaflet map
let mymap = L.map('mapid');
mymap.setView([0, 0], 1.5);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors';
const tile_url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tile_url, { attribution });
tiles.addTo(mymap);


// initializing the form and dom elements
const form = document.querySelector("#search");
const ip_dom = document.querySelector("#ip");
const location_dom = document.querySelector("#location");
const timezone_dom = document.querySelector("#timezone");
const isp_dom = document.querySelector("#isp");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    ip_tracker();
});

// getting the API data
const ip_tracker = async () => {
    try {
        const searchTerm = form.elements.query.value;
        if (searchTerm === "") {
            noquery();
        } else {

            //Multiple fields with same key in query params url
            const api_key = "at_w28ajtMsINIxtLrEd2tH05pt6oG2q";
            let params = new URLSearchParams();
            params.append("apiKey", api_key);
            params.append("ipAddress", searchTerm);
            params.append("domain", searchTerm);
            let request = {
                params: params
            };

            const res = await axios.get(`https://geo.ipify.org/api/v1`, request);
            info(res.data);
            form.elements.query.value = "";
        }
    } catch {
        alert("Something went wrong, please check back later");
        form.elements.query.value = "";
    }
};

// functions
const noquery = () => {
    alert("please type a valid IP or domain");
    form.elements.query.value = "";
}

const info = (data) => {
    // adding the dom info
    const ip = data.ip;
    const location = data.location.region;
    const timezone = data.location.timezone;
    const isp = data.isp;
    
    ip_dom.innerText = ip;
    location_dom.innerText = location;
    timezone_dom.innerText = "UTC " + timezone;
    isp_dom.innerText = isp;

    // adding the pin marker and custom pin icon
    const longitude = data.location.lng;
    const latitude = data.location.lat;
    my_icon = L.icon({
        iconUrl: 'images/icon-location.svg',
        iconAnchor: [24, 58],
    });
    L.marker([latitude, longitude], { icon: my_icon }).addTo(mymap);

    // setting the zoom level on the pin marker
    mymap.setView([latitude, longitude], 7);
};