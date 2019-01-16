// GeoJSON Trail Data
var dataUrl = "data/trailheads.geojson",
  geoData;
// CSV Trail Data
var csvUrl = "data/OSMPTrailheads.csv",
  csvData;
// Stamen Terrain Tiles
var tileSrvUrl = "http://tile.stamen.com/terrain/{z}/{x}/{y}.png";
var tileSrvAttrib =
  "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.";
var map,
  map_center = [40.01, -105.27];

function loadCSVData() {
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results) {
      console.log(results.data);
      csvData = results.data;
      mergeData();
      loadTrailDataIntoMap();
    }
  });
}

function mergeData() {
  $.each(csvData, function(k, value) {
    var match = false;
    for (var i in geoData.features) {
      var d = geoData.features[i].properties;
      if (value.AccessID == d.id) {
        match = true;
        $.extend(d, value);
        break;
      }
    }
  });
}

function loadTrailDataIntoMap() {
  var trailLayer = new L.geoJson(geoData, {
    pointToLayer: addMarker,
    onEachFeature: addPopup
  }).addTo(map);
}

function addMarker(feature, latlng) {
  return new L.Marker(latlng, {
    icon: L.icon({
      iconUrl: "img/marker-red.png",
      iconSize: [16, 22]
    }),
    draggable: false
  });
}

function addPopup(feature, layer) {
  var pop = "<div><b>" + feature.properties.name + "</b><br>"
    + "Address: " + feature.properties.address + "<br>"
    + "Parking: " + feature.properties.parking + "<br>"
    + (typeof feature.properties.BikeTrail!=='undefined'?"Bike Trail: "+feature.properties.BikeTrail+"<br>":'')
    + (typeof feature.properties.FISHING!=='undefined'?"Fishing: "+feature.properties.FISHING+"<br>":'')
    + (typeof feature.properties.HorseTrail!=='undefined'?"Horse Trail: "+feature.properties.HorseTrail+"<br>":'')
    + (typeof feature.properties.PICNIC!=='undefined'?"Picnic: "+feature.properties.PICNIC+"<br>":'')
    + "Drinking Water: " + feature.properties["drink water"] + "<br>"
    + "Restrooms: " + feature.properties.restrooms + "<br>"
    + '</div>';
  layer.bindPopup(pop);
}

// doc ready event
$("document").ready(function() {
  // get GeoJSON data
  $.ajax({
    type: "GET",
    url: dataUrl,
    dataType: "json",
    success: function(data) {
      console.log(data);
      geoData = data;
      loadCSVData();
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
    attribution: tileSrvAttrib
  }).addTo(map);
});
