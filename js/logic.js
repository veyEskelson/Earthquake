
// Store our API endpoint inside Url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the  URL
d3.json(url,function(data){
  createfeatures(data.features);
});


//marker points

//Step 3: Calling Craete function.- It creates Popup, colors, and markers.
function createfeatures(earthquakedata) {

  function onEachFeature(feature, layer) {
      layer.bindPopup("<h4>Magnitude: " + feature.properties.mag + "<br>" +
    +"<hr><p>" +feature.properties.place+"<br>"+new Date(feature.properties.time) + "</p>");
  }
  
  var earthquakes =L.geoJSON(earthquakedata,{
      onEachFeature: onEachFeature,
      pointToLayer : function(feature,latlng){
      var R=255;
      var G=Math.floor(255-80*feature.properties.mag);
      var B=Math.floor(255-80*feature.properties.mag);
      var color='rgb(' + R +', ' + G + ',' + B +')';


  var markers = {
      radius: 4 * feature.properties.mag,
      fillColor: color,
      color: "black",
      weight:1,
      opacity:1,
      fillOpacity:0.8
  };
  return L.circleMarker(latlng,markers);
  }
});

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  
  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street map": streetmap,
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "Satellite": satellite,
    "Outdoors": outdoors
  };


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
  
    zoom: 3,
    center: [29.76, -95.36],
    layers: [streetmap,darkmap, lightmap,satellite,outdoors, earthquakes]
  });




  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map){
          var div = L.DomUtil.create("div","info legend"),
              grades = [0,1,2,3,4,5],
              labels = [];
  
          div.innerHTML += "Magnitude" + "<br>";
          
          for (var i = 0; i <grades.length; i++){
               div.innerHTML +=
               '<i style="background:' + (grades[i] + 1) + '"></i> ' +
               grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
       }
      
      return div;
      };
      
      legend.addTo(map);
  }