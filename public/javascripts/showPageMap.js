const Coachground = JSON.parse(coachground)
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: Coachground.geometry.coordinates, //[77.4126, 23.2599], // starting position [lng, lat]
  zoom: 11, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-left')
// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: 'red'})
.setLngLat(Coachground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ closeOnClick: false })
    .setHTML(`<h5>${Coachground.title}</h5><p>${Coachground.location}</p>`)
)
.addTo(map);