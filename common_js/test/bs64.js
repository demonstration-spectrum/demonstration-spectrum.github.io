//Source: https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript/16245768#16245768

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function createlayer(icon_url, map, z_index, scaledSize, kmz_bs64){
	var contentType = 'application/vndgoogle-earthkmz';
	z_index = z_index || 50;
	scaledSize = scaledSize || null;
	var template_layer = new geoXML3.parser({
					map: map,
					zoom: false,
					singleInfoWindow: true,
					markerOptions: {
						icon: {url:icon_url, scaledSize: scaledSize},
						zIndex: z_index
					}
              });
	var blob = b64toBlob(kmz_bs64, contentType);
	var blobUrl = URL.createObjectURL(blob);
	template_layer.parse(blobUrl);
	return template_layer;
}