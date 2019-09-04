google.load('visualization', '1', {'packages':['corechart', 'table', 'geomap']});

function changeQuery(term,TableID,col_name) {
  var FT_TableID =TableID;
  var queryText = encodeURIComponent("SELECT 'centroidy','centroidx','area' FROM "+FT_TableID+" WHERE '"+col_name+"' in ('" +term+"')");
  //alert(queryText);
  var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryText);
  //alert('http://www.google.com/fusiontables/gvizdata?tq='  + queryText);

  //set the callback function
  query.send(zoomTo);

}

function zoomTo(response) {
if (!response) {
  alert('no response');
  return;
}
if (response.isError()) {
  alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
  return;
}
  FTresponse = response;
  //for more information on the response object, see the documentation
  //http://code.google.com/apis/visualization/documentation/reference.html#QueryResponse
  numRows = response.getDataTable().getNumberOfRows();
  numCols = response.getDataTable().getNumberOfColumns();
  for(i = 0; i < numRows; i++) {
      var point = new google.maps.LatLng(
          parseFloat(response.getDataTable().getValue(i, 0)),
          parseFloat(response.getDataTable().getValue(i, 1)));
      var area = parseFloat(response.getDataTable().getValue(i, 2));
	  var zoom = 12 - Math.round(area/2000);
	  if (area > 24000){
	  	 zoom = 6;
	  }else if (area > 20000){
	  	 zoom = 7;
	  }else if (area > 10000){
	  	 zoom = 8;
	  }else if (area > 5000){
	  	 zoom = 9;
	  }else if (area > 2000){
	  	 zoom = 10;
	  }else if (area > 300){
	  	 zoom = 11;
	  } else if (area > 100){
	  	 zoom = 12;
	  }	else if (area > 15){
	  	 zoom = 13;
	  }	else if (area > 5){
	  	 zoom = 14;
	  }	else if (area > 0){
	  	 zoom = 15;
	  } else if (area == 0){
	  	 zoom = 20;
	  }  

	  //alert('area: '+ area);	
	  //alert('zoom: '+ zoom);	   
      map.setCenter(point);
	  map.setZoom(zoom);
	  
  }
  // zoom to the bounds
  
  //map.fitBounds(bounds);

}

function zoomTo_latlong(lat,long,area){
      var point = new google.maps.LatLng(lat,long);
	  var zoom = 12 - Math.round(area/2000);
	  if (area > 24000){
	  	 zoom = 6;
	  }else if (area > 20000){
	  	 zoom = 7;
	  }else if (area > 10000){
	  	 zoom = 8;
	  }else if (area > 5000){
	  	 zoom = 9;
	  }else if (area > 2000){
	  	 zoom = 10;
	  }else if (area > 300){
	  	 zoom = 11;
	  } else if (area > 100){
	  	 zoom = 12;
	  }	else if (area > 15){
	  	 zoom = 13;
	  }	else if (area > 5){
	  	 zoom = 14;
	  }	else if (area > 0){
	  	 zoom = 15;
	  } else if (area == 0){
	  	 zoom = 20;
	  }  

	  //alert('area: '+ area);	
	  //alert('zoom: '+ zoom);	   
      map.setCenter(point);
	  map.setZoom(zoom);
}

