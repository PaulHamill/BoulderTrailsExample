// GeoJSON Trail Data URL
var dataUrl = "data/trailheads.geojson",
  geoData;
// Stamen Terrain Tiles
var tileSrvUrl = "http://tile.stamen.com/terrain/{z}/{x}/{y}.png";
var tileSrvAttribution =
  "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.";
var map,
  map_center = [40.01, -105.27];

function addMarker(feature, latlng) {
  return new L.Marker(latlng, {
    icon: L.icon({
      iconUrl: "img/marker-blue.png",
      iconSize: [8, 8]
    }),
    draggable: false
  });
}

function loadTrailDataIntoMap() {
  var trailLayer = new L.geoJson(geoData, {
    pointToLayer: addMarker // ,
    // onEachFeature: addCamPopup
  }).addTo(map);
}

$("document").ready(function() {
  // get GeoJSON data
  $.ajax({
    type: "GET",
    url: dataUrl,
    dataType: "json",
    success: function(data) {
      console.log(data);
      geoData = data;
      loadTrailDataIntoMap();
    },
    error: function(jqXHR, status, err) {
      console.log("Error getting data");
      console.log(status);
      console.log(err);
    }
  });
  // create Leaflet map
  map = new L.map("map", {
    minZoom: 5,
    maxZoom: 18
  }).setView(map_center, 12);
  var baseLayer = new L.TileLayer(tileSrvUrl, {
    maxZoom: 18,
    subdomains: ["otile1", "otile2", "otile3", "otile4"],
    attribution: tileSrvAttribution
  }).addTo(map);
});
