var dataUrl =
  "https://www-static.bouldercolorado.gov/docs/opendata/OpenTrails/OSMP_trailheads.geojson";

$("document").ready(function() {
  $.ajax({
    type: "GET",
    url: dataUrl,
    dataType: "json",
    success: function(data) {
      console.log(data);
    }
  });
});
