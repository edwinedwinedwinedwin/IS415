// JavaScript Document
//Loading the title map
    window.onload = function () {
 	  var map = L.map('map', {
            zoomControl:true, maxZoom:18, minZoom:11
        }).setView([1.355312,103.827068], 11);
    var additional_attrib = 'created w. <a href="https://github.com/geolicious/qgis2leaf" target ="_blank">qgis2leaf</a> by <a href="http://www.geolicious.de" target ="_blank">Geolicious</a> & contributors<br>';
    //var feature_group = new L.featureGroup([]);
    //var raster_group = new L.LayerGroup([]);
        
    var basemap_0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		});	
		basemap_0.addTo(map);
		var basemap_1 = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', { 
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		});	
		googleLayerSatellite = new L.Google('SATELLITE');
    
    var baseMaps = {
		'OSM Standard': basemap_0,
		'OSM Black & White': basemap_1,
    'Google Satellite': googleLayerSatellite};
		L.control.layers(baseMaps).addTo(map);
    
    //load vector layer
    $.getJSON('data/Childcare.js', function(data) {
        addpolyclinicMap(data);
    });
    
    $.getJSON("data/Childcare.js", function(data){
      var childcareIcon = L.icon({
        iconURL: 'img/childcare.png',
        iconSize: [20,20] 
        });
       
      //Add GeoJSON layer to the map once the file is loaded
      L.geoJson(data,{
      pointToLayer: function(feature,latlng){
          return L.maker(latlng,{icon:childcareIcon});
          }
        }).addTo(map);
      });
    
		L.control.scale({options: {position: 'bottomleft',maxWidth: 100,metric: true,imperial: false,updateWhenIdle: false}}).addTo(map);

    };

    
    
    