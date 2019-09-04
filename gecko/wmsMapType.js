/**
 * wmsMapType.js
 *
 * Author: Beau Grantham
 * http://www.nologs.org/
 * https://github.com/beaugrantham/
 *
 * See here for license terms:
 * http://opensource.org/licenses/MIT
 */

function WmsMapType(name, url, params, options) {
	var TILE_SIZE = 256;
	var EARTH_RADIUS_IN_METERS = 6378137;
	var CIRCUMFERENCE = 2 * Math.PI * EARTH_RADIUS_IN_METERS;
	
        this.name = name;
	this.url = url;
	this.tileSize = new google.maps.Size(TILE_SIZE, TILE_SIZE); // required by API

	this.tiles = [ ]; // maintain managed tiles
	
	/*
	 * Params representing key/value pairs included in the GetMap query.
	 * 
	 * Set default values and then override as needed.
	 */
	this.params = {
			// General
			service: 'WMS',
			version: '1.1.1',
			request: 'GetMap',
			
			// Image props
			transparent: true,
			format: 'image/png',
			width: this.tileSize.width,
			height: this.tileSize.height,
			
			// Spatial Reference System
			srs: 'EPSG:3857',
			
			// Style
			styles: '',
			
			// Layers
			layers: '',
			env: '',
	};

	this.setParams = function(params){
		for (var key in params) {
			this.params[key] = params[key];
		}		
	}

	for (var key in params) {
		this.params[key] = params[key];
	}
	
	/*
	 * Extra options.
	 * 
	 * Set default values and then override as needed.
	 */
	this.options = {
			opacity: 0.5,
			cache: false
	};
	
	for (var key in options) {
		this.options[key] = options[key];
	}

	/*
	 * Prototype getTile method.
	 */
	this.getTile = function(coord, zoom, ownerDocument) {
		if (!this.params['layers'].length) {
			console.log("[WmsMapType] Required param 'layers' is empty");
			return ownerDocument.createElement('div'); // empty div
		}
		var url = this.url + "?";
		
		url += L_getParamString(this.params, url, true) + "&";
		
		var bounds = getBounds(coord.x, coord.y, zoom);
		url += 'bbox=' + bounds.swX + "," + bounds.swY + "," + bounds.neX + "," + bounds.neY;	

		if (this.options['cache'] == false) {
			var date = new Date();
			url += "&cache=" + date.getTime();
		}
		
		var div = ownerDocument.createElement('div');
		div.innerHTML = '<img src="' + url + '"/>';
		div.style.width = this.tileSize.width + 'px';
		div.style.height = this.tileSize.height + 'px';
		div.style.opacity = this.options['opacity'];

		this.tiles.push(div);
		
		return div;
	};
	
	 function getFeatureInfoUrl(e, clicklayer) {
		// console.log(e);
		// Construct a GetFeatureInfo request URL given a point
		var point = e.pixel;
			size = {x: map.getDiv().offsetWidth, y: map.getDiv().offsetHeight}//this._map.getSize(),  ---> hardcoded , have not found the formula for this
			//https://stackoverflow.com/questions/30881598/google-maps-api-v3-calculating-map-container-height-and-width  {x: map._container.offsetWidth, y: map._container.offsetHeight} --> leaflet map
			params = {
			  VIEWPARAMS: clicklayer.params.VIEWPARAMS,
			  request: 'GetFeatureInfo',
			  service: 'WMS',
			  srs: 'EPSG:4326',
			  styles: clicklayer.params.styles,
			  transparent: clicklayer.params.transparent,
			  version: clicklayer.params.version,      
			  format: clicklayer.params.format,
			  bbox: toBBoxString(map.getBounds()),
			  height: size.y,
			  width: size.x,
			  layers: clicklayer.params.layers,
			  query_layers: clicklayer.params.layers,
			  info_format: 'text/html',
			  env: clicklayer.params.env
			};
		
		if (!!clicklayer.params.cql_filter){
			params.cql_filter = clicklayer.params.cql_filter
		}
		params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
		params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);
		
		return url + L_getParamString(params, url, true);
	  };
	/*
	 * Add this MapType to a map at the given index, or on top of other layers
	 * if index is omitted.
	 */
	this.addToMap = function(map, index) {
		if (index !== undefined) {
			map.overlayMapTypes.insertAt(Math.min(index, map.overlayMapTypes.getLength()), this);
		}
		else {
			map.overlayMapTypes.push(this);
		}
	};
	
	/*
	 * Remove this MapType from a map.
	 */
	this.removeFromMap = function(map) {
		var overlayTypes = map.overlayMapTypes;
		var map_length = overlayTypes.getLength();
		for (var i = map_length; i >= 0; i--) {
			var element = overlayTypes.getAt(i);
			
			if (element !== undefined && element === this) {
				overlayTypes.removeAt(i);
			}
		}

		this.tiles = [ ];
	};

	/*
	 * Change opacity on demand.
	 */
	this.setOpacity = function(opacity) {
		this.options['opacity'] = opacity;

		for (var i in this.tiles) {
			this.tiles[i].style.opacity = opacity;
		}
	}
	
	/*
	 * ---------------
	 * Private methods
	 * ---------------
	 */

	/*
	 * Return the tile bounds for the given x, y, z values.
	 */
	function getBounds(x, y, z) {
		y = Math.pow(2, z) - y - 1; // Translate Y value
		
		var resolution = (CIRCUMFERENCE / TILE_SIZE) / Math.pow(2, z); // meters per pixel
		
		var swPoint = getMercatorCoord(x, y, resolution);
		var nePoint = getMercatorCoord(x + 1, y + 1, resolution);
		
		var bounds = {
				swX : swPoint.x,
				swY : swPoint.y,
				neX : nePoint.x,
				neY : nePoint.y
		};
		
		return bounds;
	};

	/*
	 * Translate the xy & resolution to spherical mercator (EPSG:3857, EPSG:900913).
	 */
	function getMercatorCoord(x, y, resolution) {
		var point = {
				x: x * TILE_SIZE * resolution - CIRCUMFERENCE / 2.0,
				y: y * TILE_SIZE * resolution - CIRCUMFERENCE / 2.0
		};
		
		return point;
	};

//---------------------infowindow
	function infoclick(e, clicklayer){
		//console.log(e);
		var marker= e;
		var xhttp = new XMLHttpRequest();
		var overlayTypes = map.overlayMapTypes;
		var onmap = false;
		for (var i = 0; i < overlayTypes.getLength(); i++) {
			var element = overlayTypes.getAt(i);
			if (element !== undefined && element === clicklayer) {
				onmap = true;
				break;
			}
		}
		
		if (onmap == true){
			// console.log(getFeatureInfoUrl(e, clicklayer));
			 $.ajax({
				  url: getFeatureInfoUrl(e, clicklayer), 
				  success: function (data, status, xhr) {
					var err = typeof data === 'string' ? null : data; //Nam's change
					var showdata = true;
					if (typeof(data) === 'string'){
						var $data = $(data);
						var data_text = $data.children()[0];
						//console.log(clicklayer);
						//console.log(data_text != undefined && data_text.textContent != "");
						if (data_text != undefined && data_text.textContent != ""){
							err = null;
							infowindow.setContent(data);
								infowindow.setPosition({lat: e.latLng.lat(), lng: e.latLng.lng()});
								infowindow.open(map);							
						} else {
							showdata = false;
							err = "No body data return";
						}
					}


				  },
				  error: function (xhr, status, error) {
					//showResults(error);   doing nothing for now
				  }
				});
		}
		
		
		
		
	}

	var a = this;
	map.addListener('click', function(e) {
	  infoclick(e, a);
	});
	

	this.onmap = function(map){
		var onmap = false;
		var overlayTypes = map.overlayMapTypes;
		for (var i = 0; i < overlayTypes.getLength(); i++) {
			var element = overlayTypes.getAt(i);
			if (element !== undefined && element === this) {
				onmap = true;
				break;
			}
		}
		return onmap;
	}
	
	this.infoclick = infoclick;
	
}


//-----------------------Leaflet function mocking
function L_getParamString(t,i,e){var n=[];for(var o in t)n.push(encodeURIComponent(e?o.toUpperCase():o)+"="+encodeURIComponent(t[o]));return(i&&-1!==i.indexOf("?")?"&":"?")+n.join("&")};

function toBBoxString(temp2){return [temp2.getSouthWest().lng(),temp2.getSouthWest().lat(), temp2.getNorthEast().lng(), temp2.getNorthEast().lat()].join(",")};