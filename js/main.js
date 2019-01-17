// GeoJSON Trail Data URL
var dataUrl = "data/trailheads.geojson";
// CSV Trail Data URL
var csvUrl = "data/OSMPTrailheads.csv";
// Stamen Terrain Tiles
var tileSrvUrl = "http://tile.stamen.com/terrain/{z}/{x}/{y}.png",
    tileSrvAttrib =
  "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.";
var map_center = [40.01, -105.27], // Boulder lat/long coords
    initialZoom = 17, // initial map zoom level
    trailLayer,
    geoData,
    map;

function loadCSVData() {
  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: (results)=>{
      // console.log(results.data);
      if (results.errors) {
        console.log("Error getting CSV data");
        console.log(results.errors);
      }
      mergeData(results.data);
      loadTrailDataIntoMap(geoData);
    }
  });
}

function mergeData(csvData) {
  for (var j in csvData) {
    var value = csvData[j],
        match = false;
    for (var i in geoData.features) {
      var d = geoData.features[i].properties;
      if (value.AccessID == d.id) {
        match = true;
        geoData.features[i].properties = $.extend(d, value);
        break;
      }
    }
  };
  // console.log(geoData);
}

function loadTrailDataIntoMap(gdata) {
  if (trailLayer) trailLayer.clearLayers();
  trailLayer = new L.geoJson(gdata, {
    pointToLayer: addMarker,
    onEachFeature: addPopup
  }).addTo(map);
}

function filterTrails() {
  var attribs = [];
  $('input[type=checkbox]').each(function(){
    if ($(this).is(':checked')) {
      attribs.push($(this).val());
    }
  });
  var gdata;
  if (attribs.length == 0) {
    gdata = geoData;
  } else {
    gdata = {
      "features": [],
      "type": "FeatureCollection"
    };
    for (var i in geoData.features) {
      var f = geoData.features[i],
          match = false;
      for (var attrib in f.properties) {
        var value = f.properties[attrib];
        if (!value) continue;
        if (attribs.includes(attrib) && value.toLowerCase()=='yes') {
          match = true;
          break;
        }
      }
      if (match) gdata.features.push(f);
    }
  }
  loadTrailDataIntoMap(gdata);
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
    + (typeof feature.properties.PICNIC!=='undefined'?"Picnic: "+feature.properties.PICNIC+"<br>":'')
    + "Drinking Water: " + feature.properties["drink water"] + "<br>"
    + "Restrooms: " + feature.properties.restrooms + "<br>"
    + '</div>';
  layer.bindPopup(pop);
}

// doc ready event
$("document").ready(()=>{

  // get GeoJSON data
  $.ajax({
    type: "GET",
    url: dataUrl,
    dataType: "json",
    success: (data)=>{
      // console.log(data);
      geoData = data;
      loadCSVData();
    },
    error: (jqXHR, status, err)=>{
      console.log("Error getting GeoJSON data");
      console.log(status);
      console.log(err);
    }
  });

  // create Leaflet map
  map = new L.map("map", {
    minZoom: 5,
    maxZoom: initialZoom
  }).setView(map_center, 12);
  var baseLayer = new L.TileLayer(tileSrvUrl, {
    maxZoom: initialZoom ,
    subdomains: ["otile1", "otile2", "otile3", "otile4"],
    attribution: tileSrvAttrib
  }).addTo(map);

  // filter checkbox click handler
  $('input[type=checkbox]').on('change', ()=>{
    filterTrails();
  });

});
