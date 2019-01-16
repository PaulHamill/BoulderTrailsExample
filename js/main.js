// GeoJSON Trail Data URL
var dataUrl = "data/trailheads.geojson";
// Stamen Terrain Tiles
var tileSrvUrl = "http://tile.stamen.com/terrain/{z}/{x}/{y}.png";
var tileSrvAttribution =
  "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.";
var map,
  map_center = [40.0, -105.0];

$("document").ready(function() {
  // get GeoJSON data
  $.ajax({
    type: "GET",
    url: dataUrl,
    dataType: "json",
    success: function(data) {
      console.log(data);
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
  }).setView(map_center, 9);
  var baselayer = new L.TileLayer(tileSrvUrl, {
    maxZoom: 18,
    subdomains: ["otile1", "otile2", "otile3", "otile4"],
    attribution: tileSrvAttribution
  }).addTo(map);
});
