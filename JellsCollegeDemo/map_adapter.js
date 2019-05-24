function spectrumWmsLayer(url, params, options, name, forMap = map){ 
	var mapLayer;
	switch (forMap.mapType) {
		case "Leaflet":
			if (!options || !!options.infowindow || options.infowindow == undefined){
				mapLayer = L.tileLayer.betterWms(url, params);
			} else {
				mapLayer = L.tileLayer.wms(url, params);
			}
			break;
		case "Google":
			mapLayer = new WmsMapType(name, url, params, options);
			mapLayer.remove = googleWmsRemove;
			mapLayer.addTo = googleWmsAddTo;
			break;
		default:
			mapLayer = null;
	}
    return mapLayer;
}

googleWmsAddTo = function(map){
    this.addToMap(map);
    this._map = map;
}
googleWmsRemove = function(){
	if (!!this._map) {
		this.removeFromMap(this._map);
	}
    delete this._map;
}

function spectrumMap(mapType, containerId, mapView){
	var map;
	switch (mapType) {
		case "Leaflet":
			map = L.map(containerId).setView(mapView.latlng, mapView.zoom);
			map.setMaxZoom(18); //free map servers usually don't support zoom over 18;
			init_inputsearch();
			infowindow = L.popup();
			map.setView = leafletSetView;
			var baseLayer = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
				maxZoom: 20,
				attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(map);			
			break;
		case "Google":
			map = new google.maps.Map(document.getElementById(containerId), {zoom: mapView.zoom, center: mapView.latlng, scaleControl: true, gestureHandling: 'greedy',
									});
								
			infowindow = new google.maps.InfoWindow({content: ""});									
			map.setView = googleSetView;
			map.removeLayer = googleRemoveLayer;
			map.panTo = googlePanTo;
			break;
		default:
			mapLayer = null;
	}
	
	map.mapType = mapType;
	return map;
}
leafletSetView = function(mapView){
	this.panTo(mapView.latlng);
	this.setZoom(mapView.zoom);
}
googleSetView = function(mapView){
	this.setZoom(mapView.zoom);
	this.setCenter(mapView.latlng);
}
googlePanTo = function(latlng){
	this.setView({latlng: latlng, zoom: this.getZoom()});
}
googleRemoveLayer = function(layer){
	//Remove WMS Layers
	//Remove Fusion Layer: list of Fusion Layer: map.__gm.D.b.f
	if (this == layer._map){
	    layer.remove();
	}
}
