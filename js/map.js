//Multiple tile layers

    //Create and initialise the title map
    window.onload = function () {
    var map = L.map('map', {
            zoomControl:true, maxZoom:18, minZoom:11
        }).setView([1.355312,103.827068], 11);
    
    //Create OSM tile layer        
    var basemap_0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		});	
		basemap_0.addTo(map);
		
    //Create OSM black&white tile layer
    var basemap_1 = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', { 
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		});
    
    //Create Google Satellite layer 	
		googleLayerSatellite = new L.Google('SATELLITE');
    
    //Load the tile layers
    var baseMaps = {
		'OSM Standard': basemap_0,
		'OSM Black & White': basemap_1,
    'Google Satellite': googleLayerSatellite};
		L.control.layers(baseMaps).addTo(map);

    //load GeoJSon from an external file
    $.getJSON("data/GPclinics.geojson",function(data){
    
      var GPIcon = L.icon({
        iconUrl: 'images/GPclinic.png',
        iconSize: [10,10]
        });
    
      //add GeoJSON layer to the map once the file is loaded
      L.geoJson(data,{
      pointToLayer: function(feature, latlng) {
          var marker = L.marker(latlng,{icon: GPIcon});
          marker.bindPopup(feature.properties.EST_NAME);
          return marker;
      }
      }).addTo(map);
    });
    
 }; 