var CLIENT_ID = '13186554416-qm67gaf267dkiva1q2lett9pl7fmmi58.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/drive';

function handleClientLoad() {

    gapi.load('client:auth2', initClient);
	alert('get file run');
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function() {
		
        // Listen for sign-in state changes.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        //gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
		initMap();
		//create_layer_kmz("https://maps.google.com/mapfiles/ms/icons/red-dot.png", map, 100, null, fileId="0Bwd3NA9h5YhqczRqSjAxTVlNem8");
		//read_file('0Bwd3NA9h5YhqczRqSjAxTVlNem8');
    });
}
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {		
    } else {
		gapi.auth2.getAuthInstance().signIn();
    }
}
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function listFiles() {
    gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
    }).then(function(response) {
        appendPre('Files:');
        var files = response.result.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                appendPre(file.name + ' (' + file.id + ')');
            }
        } else {
            appendPre('No files found.');
        }
    });
}

function read_file_2(fileId) {
	
    gapi.client.drive.files.get({
        'fileId': fileId,
        'alt': "media"
    }).then(function(response) {
        console.log(response);
		alert(response.body);
		var uInt8Array = Uint8Array.from(response.body);
		var i = uInt8Array.length;
		var binaryString = new Array(i);
		while (i--)
		{
			binaryString[i] = String.fromCharCode(uInt8Array[i]);
		}
		var data = binaryString.join('');
		var base64 = window.btoa(data);
		console.log('uInt8Array     : ' + uInt8Array);
		return response.body;
    });

}
function create_layer_kmz(icon_url, map, z_index, scaledSize, fileId) {
	//code from RoccoB: https://stackoverflow.com/questions/37860901/how-to-use-google-drive-api-to-download-files-with-javascript
	var accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;// or this: gapi.auth.getToken().access_token;

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.googleapis.com/drive/v3/files/"+fileId+'?alt=media', true);
	xhr.setRequestHeader('Authorization','Bearer '+accessToken);
	xhr.responseType = 'arraybuffer'
	xhr.onload = function(){
		//base64ArrayBuffer from https://gist.github.com/jonleighton/958841
		var newlayer = createlayer(icon_url, map, z_index, scaledSize, kmz_bs64=base64ArrayBuffer(xhr.response));
		
	}
	xhr.send();
	return create_layer_kmz;
}
function get_link(fileId){
	gapi.client.drive.files.get({
        'fileId': fileId,
        'fields': "webContentLink"
    }).then(function(response) {
        console.log(response);
		return response.body;
    });
}
