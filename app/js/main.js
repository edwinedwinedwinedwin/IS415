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

    var popup = new L.Popup({ autoPan: false });


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
var geosearch = new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google(),
    position: 'topcenter',
    showMarker: true,
    retainZoomLevel: false,
}).addTo(map);

//END OF SEARCH FUNCTION

//create buffer (used when the marker is dragged)

//add marker that is draggable
var marker = L.marker(new L.LatLng(1.3237, 103.8194), {
    draggable: true
});

//geojson call for points
var data = L.geoJson(json_Cafes0, {
    pointToLayer: function (feature, latlgn) {
        var popupContect = "<b>Name: </b>" + feature.properties.Name;
        return L.circleMarker(latlgn).bindPopup(popupContect);
    },
})

//add marker popup
marker.bindPopup('This marker is draggable!');
marker.addTo(map);

//remove old buffers (used when marker is dragged)
function removeBuff() {
    map.removeLayer(buff);
};




//create buffer (used when the marker is dragged)
function updateBuffer() {

    //Make the marker a feature
    var pointMarker = marker.toGeoJSON();
    //buffer the marker geoJSON feature
    buffered = turf.buffer(pointMarker, 500, 'meters');
    //add buffer to the map. Note: no "var" before "buff" makes it a global variable and usable within the removeBuff() function
    buff = L.mapbox.featureLayer(buffered);
    
    buff.addTo(map);
    
    var pt = data.toGeoJSON();
    var countPt = turf.count(buffered, pt, 'pt_count');
    
    var resultFeatures = pt.features.concat(countPt.features);
    var result = {
        "type": "FeatureCollection",
        "features": resultFeatures
    };

    L.geoJson(countPt, {
        onEachFeature: onEachFeature1
    }).addTo(map);
    

    //marker.bindPopup('Number of cafes within 500 meters: ' + feature.properties.pt_count);
    
    console.log(countPt);
    map.removeLayer(result);
};

function onEachFeature1(feature, layer) {
    // does this feature have a property named pt_count?
    if (feature.properties && feature.properties.pt_count) {
        layer.bindPopup(feature.properties.pt_count);
    }
    layer.on({
      mousemove: mousemove1,
      click: zoomToFeature1
    });
}

function mousemove1(e) {
    var layer = e.target;

    popup.setLatLng(e.latlng);
    popup.setContent('<div class="marker-title"> Cafes: ' + layer.feature.properties.pt_count);
    marker.bindPopup('Number of cafes within 500 meters: ' + layer.feature.properties.pt_count);
    
    

    if (!popup._map) popup.openOn(map);
    window.clearTimeout(closeTooltip);

    // highlight feature
    layer.setStyle({
    weight: 3,
    opacity: 0.8,
    fillOpacity: 0.5
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}


function mouseout1(e) {
    buffer.resetStyle(e.target);
    closeTooltip = window.setTimeout(function() {
        map.closePopup();
    }, 100);
}

function zoomToFeature1(e) {
  map.fitBounds(e.target.getBounds());
}




marker.on('drag', function () {
    removeBuff(), updateBuffer()
});


updateBuffer();

//END BUFFER//



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


/* cafes */

for(var i = 0; i < json_Cafes0.features.length; i++) {
              json_Cafes0.features[i].properties['marker-color'] = '#DC143C';
              json_Cafes0.features[i].properties['marker-symbol'] = 'cafe';
              json_Cafes0.features[i].properties['marker-size'] = 'small';
};

var json_Cafes0Layer = L.mapbox.featureLayer(json_Cafes0).addTo(map);

json_Cafes0Layer.eachLayer(function (layer) {

layer.bindPopup(
    'Name: <strong>' + layer.feature.properties.Name + '</strong><br/>' + 
    'Address: <strong>' + layer.feature.properties.Address + '</strong>', 
    { closeButton: false });
}).addTo(map);
    json_Cafes0Layer.on('mouseover', function (e) {
    e.layer.openPopup();
});


function reset() {
    var cafeFeatures = json_Cafes0Layer.getGeoJSON();
    for (var i = 0; i < cafeFeatures.features.length; i++) {
        cafeFeatures.features[i].properties['marker-size'] = 'small';
    };
    json_Cafes0Layer.setGeoJSON(cafeFeatures);
};



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
addLayer(json_Cafes0Layer, '<strong> Cafes </strong>', 2);

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


//CHOROPLETH

var hoverLayer = L.geoJson(json_TotalPopulationBySubzone0,  {
  style: getStyle,
  onEachFeature: onEachFeature
}).addTo(map);

function getStyle(feature) {
  return {
      weight: 2,
      opacity: 0.1,
      color: 'black',
      fillOpacity: 0.9,
      fillColor: getColor(feature.properties.Population)
  };
}
    
function getColor(d) {
  return d > 137150 ? '#08306b' :
      d > 16944 ? '#08306b' :
      d > 4994   ? '#2878b8' :
      d > 1385   ? '#72b2d7' :
      d = 0   ? '#c7dcef' :
      '#f7fbff';
}

function onEachFeature(feature, layer) {
  layer.on({
      mousemove: mousemove,
      mouseout: mouseout,
      click: zoomToFeature
  });
}
    
var closeTooltip;

function mousemove(e) {
    var layer = e.target;

    popup.setLatLng(e.latlng);
    popup.setContent('<div class="marker-title"> Subzone: ' + layer.feature.properties.DGPSZ_NAME + '</div>' +
               'Population size: ' + layer.feature.properties.Population);

    if (!popup._map) popup.openOn(map);
    window.clearTimeout(closeTooltip);

    // highlight feature
    layer.setStyle({
    weight: 3,
    opacity: 0.8,
    fillOpacity: 0.5
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function mouseout(e) {
    hoverLayer.resetStyle(e.target);
    closeTooltip = window.setTimeout(function() {
        map.closePopup();
    }, 100);
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

    
//map.legendControl.addLegend(getLegendHTML());

function getLegendHTML() {
    var grades = [0, 1385, 4994, 16944, 137150],
    labels = [];

    for (var i = 0; i < grades.length; i++) {
        
      labels.push(
        '<span class="swatch" style="background:' + getColor(i) + '">+' + '</span>');
    }

    return '<span>People per square mile</span>' + labels.join('');
}

addLayer(hoverLayer, '<strong> Population Size </strong>', 3);


//CHOROPLETH
/*

var hoverLayer = L.geoJson(Feb2016RentalPrice,  {
  style: getStyle,
  onEachFeature: onEachFeature
}).addTo(map);

function getStyle(feature) {
  return {
      weight: 2,
      opacity: 0.1,
      color: 'black',
      fillOpacity: 0.9,
      fillColor: getColor(feature.properties.median)
  };
}
    
function getColor(d) {
  return d > 137150 ? '#08306b' :
      d > 16944 ? '#08306b' :
      d > 4994   ? '#2878b8' :
      d > 1385   ? '#72b2d7' :
      d = 0   ? '#c7dcef' :
      '#f7fbff';
}

function onEachFeature(feature, layer) {
  layer.on({
      mousemove: mousemove,
      mouseout: mouseout,
      click: zoomToFeature
  });
}
    
var closeTooltip;

function mousemove(e) {
    var layer = e.target;

    popup.setLatLng(e.latlng);
    popup.setContent('<div class="marker-title"> Subzone: ' + layer.feature.properties.DGPSZ_NAME + '</div>' +
               'Population size: ' + layer.feature.properties.Population);

    if (!popup._map) popup.openOn(map);
    window.clearTimeout(closeTooltip);

    // highlight feature
    layer.setStyle({
    weight: 3,
    opacity: 0.8,
    fillOpacity: 0.5
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function mouseout(e) {
    hoverLayer.resetStyle(e.target);
    closeTooltip = window.setTimeout(function() {
        map.closePopup();
    }, 100);
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

    
//map.legendControl.addLegend(getLegendHTML());

function getLegendHTML() {
    var grades = [0, 1385, 4994, 16944, 137150],
    labels = [];

    for (var i = 0; i < grades.length; i++) {
        
      labels.push(
        '<span class="swatch" style="background:' + getColor(i) + '">+' + '</span>');
    }

    return '<span>People per square mile</span>' + labels.join('');
}

addLayer(hoverLayer, '<strong> Population Size </strong>', 3);


*/

