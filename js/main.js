
//This creates the map with Singapore layer//
var map = L.map('map', {
			zoomControl:true, maxZoom:18, minZoom:10
		}).fitBounds([[1.1212205463686813,103.52073669433594],[1.548883579847398,103.98765563964844]]);
		

		var additional_attrib = 'created w. <a href="https://github.com/geolicious/qgis2leaf" target ="_blank">qgis2leaf</a> by <a href="http://www.geolicious.de" target ="_blank">Geolicious</a> & contributors<br>';

		var hash = new L.Hash(map);
		var feature_group = new L.featureGroup([]);
		var raster_group = new L.LayerGroup([]);
		var layerOrder=new Array();
		var basemap_0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
			attribution: additional_attrib + '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
		});	
		basemap_0.addTo(map);
		var basemap_1 = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', { 
			attribution: additional_attrib + '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
		});	
		
//This creates the map with Singapore layer//



/* IGNORE THESE Layers for reference only


//This creates the SUBZONES with pop risk//
function pop_DGPSubZone(feature, layer) {					
	var popupContent = '<table><tr><th scope="row">ID</th><td>' + Autolinker.link(String(feature.properties['ID'])) + '</td></tr><tr><th scope="row">SZSCD</th><td>' + Autolinker.link(String(feature.properties['SZSCD'])) + '</td></tr><tr><th scope="row">SZZCD</th><td>' + Autolinker.link(String(feature.properties['SZZCD'])) + '</td></tr><tr><th scope="row">DGPZ_CODE</th><td>' + Autolinker.link(String(feature.properties['DGPZ_CODE'])) + '</td></tr><tr><th scope="row">DGPSZ_CODE</th><td>' + Autolinker.link(String(feature.properties['DGPSZ_CODE'])) + '</td></tr><tr><th scope="row">REGION</th><td>' + Autolinker.link(String(feature.properties['REGION'])) + '</td></tr><tr><th scope="row">DGPZ_NAME</th><td>' + Autolinker.link(String(feature.properties['DGPZ_NAME'])) + '</td></tr><tr><th scope="row">DGPSZ_NAME</th><td>' + Autolinker.link(String(feature.properties['DGPSZ_NAME'])) + '</td></tr><tr><th scope="row">Census1</th><td>' + Autolinker.link(String(feature.properties['Census1'])) + '</td></tr><tr><th scope="row">High_risk</th><td>' + Autolinker.link(String(feature.properties['High_risk'])) + '</td></tr></table>';
	layer.bindPopup(popupContent);
}

function doStyleDGPSubZone(feature) {
	if (feature.properties.High_risk >= 0.0 && feature.properties.High_risk <= 9096.4) {
		return {
			color: '#000000',
			weight: '1.3',
			fillColor: '#f7fbff',
			opacity: '1.0',
			fillOpacity: '1.0',
		}
	}
	if (feature.properties.High_risk >= 9096.4 && feature.properties.High_risk <= 18192.8) {
		return {
			color: '#000000',
			weight: '1.3',
			fillColor: '#c7dcef',
			opacity: '1.0',


			fillOpacity: '1.0',
		}
	}
	if (feature.properties.High_risk >= 18192.8 && feature.properties.High_risk <= 27289.2) {
		return {
			color: '#000000',
			weight: '1.3',
			fillColor: '#72b2d7',
			opacity: '1.0',
			fillOpacity: '1.0',
		}
	}
	if (feature.properties.High_risk >= 27289.2 && feature.properties.High_risk <= 36385.6) {
		return {
			color: '#000000',
			weight: '1.3',
			fillColor: '#2878b8',
			opacity: '1.0',
			fillOpacity: '1.0',
		}
	}
	if (feature.properties.High_risk >= 36385.6 && feature.properties.High_risk <= 45482.0) {
		return {
			color: '#000000',
			weight: '1.3',
			fillColor: '#08306b',
			opacity: '1.0',
			fillOpacity: '1.0',
		}
	}
}
var exp_DGPSubZoneJSON = new L.geoJson(exp_DGPSubZone,{
	onEachFeature: pop_DGPSubZone,
	style: doStyleDGPSubZone
});
//add comment sign to hide this layer on the map in the initial view.
feature_group.addLayer(exp_DGPSubZoneJSON);


//END pop Risk//

//This creates the train stations//		
		function pop_TrainStations(feature, layer) {					
			var popupContent = '<table><tr><th scope="row">Station name:</th><td>' + Autolinker.link(String(feature.properties['STN_NAM'])) + '</td></tr></table>';
			layer.bindPopup(popupContent);
		}

	


		//THIS CREATES THE ZOOM BACK FUNCTION TO SG MAP

		var zoomBack = L.control({position: 'topleft'});
		zoomBack.onAdd = function(map){
			this._div = L.DomUtil.create('div');
			this._div.innerHTML = '<img src="pictures/zoom.png" alt="zoomback" id="zoomback" title="zoomback"/>';
			return this._div;
		};
		zoomBack.addTo(map);


		$('#zoomback').on('click', function (event) {
    		map.setView([1.355312, 103.840068], 11);
		});

		//END OF ZOOM BACK FUNCTION

		//LINE
		function pop_mrtline(feature, layer) {					
			var popupContent = '<table><tr><th scope="row">osm_id</th><td>' + Autolinker.link(String(feature.properties['osm_id'])) + '</td></tr><tr><th scope="row">name</th><td>' + Autolinker.link(String(feature.properties['name'])) + '</td></tr><tr><th scope="row">type</th><td>' + Autolinker.link(String(feature.properties['type'])) + '</td></tr></table>';
			layer.bindPopup(popupContent);
		}

		function doStylemrtline(feature) {
				return {
					weight: 3.7,
					color: '#000100',
					fillColor:'#4aa41d',
					dashArray: '',
					opacity: 0.7,
					fillOpacity: 1.0
				};
		}


		var exp_mrtlineJSON = new L.geoJson(exp_mrtline,{
			onEachFeature: pop_mrtline,
			style: doStylemrtline
		});
		layerOrder[layerOrder.length] = exp_mrtlineJSON;
		for (index = 0; index < layerOrder.length; index++) {
			feature_group.removeLayer(layerOrder[index]);feature_group.addLayer(layerOrder[index]);
		}
		//add comment sign to hide this layer on the map in the initial view.
		feature_group.addLayer(exp_mrtlineJSON);
	
		//proportionate symbol map RISK


	var propotinateMapSubZone =
	    L.geoJson(exp_expdengue, {
	        pointToLayer: function (feature, latLng) {
	            return L.circleMarker(latLng, {
	                radius: feature.properties['CASE_SIZE']/8,
	                weight: 1,
	                opacity: 1.0,
	                fillOpacity: 0.8,
	                fillColor: propotinateMapSelectedColor,
	                color: "black"// Border color
	            });
	        },
	        style: propotionateStyle
	    });


	function propotionateStyle(feature) {
	    return {
	        fillOpacity: 0.6,
	        fillColor: propotinateMapSelectedColor
	    }
	}






		// THIS CREATES THE TRAIN STATIONS MAPPED FROM QGIS2LEAF
		var exp_TrainStationsJSON = new L.geoJson(exp_TrainStations,{
			onEachFeature: pop_TrainStations,
			pointToLayer: function (feature, latlng) {  
				return L.circleMarker(latlng, {
					radius: 4.0,
					fillColor: '#e31a1c',
					color: '#000000',
					weight: 1,
					opacity: 0.9,
					fillOpacity: 0.9
				})
			}
		});
		
		feature_group.addLayer(exp_TrainStationsJSON);
		//END OF TRAIN STATIONS

		feature_group.addTo(map);
		var title = new L.Control();
		title.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
			this.update();
			return this._div;
		};
		title.update = function () {
			this._div.innerHTML = '<h2>Analysis of viral trends</h2>'
		};
		title.addTo(map);
		var baseMaps = {
		'Standard': basemap_0,
		'Grayscale': basemap_1};

		new L.Control.GeoSearch({
		    provider: new L.GeoSearch.Provider.Google(),
		    position: 'topcenter',
		    showMarker: true,
		    retainZoomLevel: false,
		}).addTo(map);

		feature_group.addTo(map);
		var title = new L.Control();
		title.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
			this.update();
			return this._div;
		};

		/*THIS CREATES THE UPLOADING FUNCTION

		L.Control.FileLayerLoad.LABEL = '<i class="fa fa-archive"></i>';
		var fileControl = L.Control.fileLayerLoad({
		    // See http://leafletjs.com/reference.html#geojson-options
		    layerOptions: {style: {color: 'red'}},
		    // Add to map after loading (default: true) ?
		    addToMap: true,
		    // File size limit in kb (default: 1024) ?
		    fileSizeLimit: 1024,
		    // Restrict accepted file formats (default: .geojson, .kml, and .gpx) ?
		    formats: [
		        '.geojson',
		        '.kml',
		        '.gpx'
		    ]
		}).addTo(map);
		fileControl.loader.on('data:loaded', function (e) {
		    layerControl.addOverlay(e.layer, e.filename);
		});

		END OF UPLOADING FUNCTION
		*/


		L.control.layers(baseMaps,
			{	
				"MRT Link": exp_mrtlineJSON,
				"MRT Stations": exp_TrainStationsJSON,
				"Higher Risk Population": exp_DGPSubZoneJSON,
				"Dengue Clutter": propotinateMapSubZone
				


			},{collapsed:false}).addTo(map);
		L.control.scale({options: {position: 'bottomleft',maxWidth: 100,metric: true,imperial: false,updateWhenIdle: false}}).addTo(map);

		

















