// When locator icon in datatable is clicked, go to that spot on the map
$(document).on("click", ".go-map", function(e) {
  e.preventDefault();
  $el = $(this);
  var lat = $el.data("lat");
  var long = $el.data("long");
  var zip = $el.data("zip");
  $($("#nav a")[0]).tab("show");
  Shiny.onInputChange("goto", {
    lat: lat,
    lng: long,
    zip: zip,
    nonce: Math.random()
  });
});



//map
L.mapbox.accessToken ='pk.eyJ1IjoiZWR3aW5lZHdpbmVkd2luZWR3aW5lZHdpbiIsImEiOiJjaW1uZGJ6MXYwMGc0dTVtNDJ6MmptYXo4In0.9eb8DNwVBuUIb6Xnc2i2MQ';
    var map = L.mapbox.map('map', 'mapbox.streets').setView([1.3237, 103.8194], 11);
    

//THIS CREATES THE ZOOM BACK FUNCTION TO SG MAP

var zoomBack = L.control({position: 'topleft'});
    zoomBack.onAdd = function(map){
        this._div = L.DomUtil.create('div');
        this._div.innerHTML = '<img src="pictures/zoom.png" alt="zoomback" id="zoomback" title="zoomback"/>';
        return this._div;
    };

zoomBack.addTo(map);


$('#zoomback').on('click', function (event) {
    map.setView([1.3237, 103.8194], 11);
});

//END OF ZOOM BACK FUNCTION

		
//Search Function
new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google(),
    position: 'topcenter',
    showMarker: true,
    retainZoomLevel: false,
}).addTo(map);

//END OF SEARCH FUNCTION



/* GEOLOCATION */

var geolocate = document.getElementById('geolocate');
var myLayer = L.mapbox.featureLayer().addTo(map);
if (!navigator.geolocation) {
    geolocate.innerHTML = 'Geolocation is not available';
} else {
    geolocate.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        map.locate();
    };
}

// Once we've got a position, zoom and center the map
// on it, and add a single marker.
map.on('locationfound', function(e) {
    map.fitBounds(e.bounds);

    myLayer.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            'title': 'This is where you are at! <br/> Click to find out the nearest cafe!',
            'marker-color': '#ff8888',
            'marker-symbol': 'star',
            'marker-size': 'large'
        }
    });

    // And hide the geolocation button
    geolocate.parentNode.removeChild(geolocate);
});

// If the user chooses not to allow their location
// to be shared, display an error message.
map.on('locationerror', function() {
    geolocate.innerHTML = 'Cannot Locate';
});

/*GEOLOCATION*/



/* TURF -> Finding nearest cafe*/

myLayer.on('click', function (e) {
    // Reset any and all marker sizes to small
    reset();
    // Get the GeoJSON 
    var cafeFeatures = json_Cafes0Layer.getGeoJSON();
    
    var nearestCafe = turf.nearest(e.layer.feature, cafeFeatures);

nearestCafe.properties['marker-size'] = 'large';
    // Add the new GeoJSON 
    json_Cafes0Layer.setGeoJSON(cafeFeatures);
    
    
    
    // for nearest cafe
    json_Cafes0Layer.eachLayer(function (layer) {
      layer.bindPopup(
        'Name: <strong>' + layer.feature.properties.Name + '</strong><br/>' + 
        'Address: <strong>' + layer.feature.properties.Address + '</strong>',{ closeButton: false });
      if (layer.feature.properties['marker-size'] === 'large') {
        layer.openPopup();
      };
    });
  });

  // When the map is clicked on anywhere, reset all
  // markers to small
  map.on('click', function (e) {
    reset();
  });


/* TURF */


/* Layers */
var layers = document.getElementById('menu-ui');

addLayer(myLayer, '<strong> My Location </strong>', 1);


function addLayer(layer, name, zIndex) {
    layer
        .setZIndex(zIndex)
        .addTo(map);

    // Create a simple layer switcher that
    // toggles layers on and off.
    var link = document.createElement('a');
        link.href = '#';
        link.className = 'active';
        link.innerHTML = name;

    link.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            this.className = '';
        } else {
            map.addLayer(layer);
            this.className = 'active';
        }
    };

    layers.appendChild(link);
}

		
/* TURF -> 500m Buffer*/

var pt = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [103.897878, 1.415119]
  }
};

var ptLayer = L.mapbox.featureLayer().setGeoJSON(pt);
var bufferLayer = L.mapbox.featureLayer().addTo(map);


bufferLayer.eachLayer(function(layer) {
    //pts
    layer.options.draggable = true;
    layer.on('drag', function(e) {
        calculateBuffer();
    });
    //lines and polys
    if(layer.editing){
        layer.editing.enable();
        layer.on('edit', function(e) {
            calculateBuffer();
        });
    }
});

ptLayer.addTo(map);
calculateBuffer();

function calculateBuffer() {
    var pt = turf.featurecollection(ptLayer.getLayers().map(function(f){
            return f.toGeoJSON()
        }));
    var buffer = turf.buffer(pt, 500, 'meters');
    buffer.properties = {
        "fill": "#6BC65F",
        "stroke": "#25561F",
        "stroke-width": 2
    };
    bufferLayer.setGeoJSON(buffer);
}


addLayer(bufferLayer, '<strong> 500m Buffer </strong>', 3);











