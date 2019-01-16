var dataUrl =
  "https://www-static.bouldercolorado.gov/docs/opendata/OpenTrails/OSMP_trailheads.geojson";

$("document").ready(function() {
  $.ajax({
    type: "GET",
    url: dataUrl,
    dataType: "jsonp",
    success: function(data) {
      console.log(data);
    },
    error: function(jqXHR, status, err) {
      console.log("Error getting data");
      console.log(status);
      console.log(err);
    }
  });
});
