var CLIENT_ID = '13186554416-b87e8rjtcv7rbg4lujvj57bbl9v56ji6.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/drive';

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
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
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
		read_file();
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

function read_file() {
    gapi.client.drive.files.get({
        'fileId': '0Bwd3NA9h5YhqNmhwRkxfcG1QR28',
        'alt': "media"
    }).then(function(response) {
        appendPre(response.body);
        //appendPre(response.result.toJson());//.name + ' (' + response.result.id + ')' +response.result.webContentLink);
        console.log(response)
    });

}