$("#render-custom-layer").click(function(){
	render_file();
});
var custom_layer_list =[];

function render_file(){
	var x = document.getElementById("custom_mapfile");
	var txt = "";
	if ('files' in x){
		if (x.files.length==0){
			txt = "Select one or more files.";
		} else {
			for (var i = 0; i< x.files.length; i++){
				var file = x.files[i];
				if ('name' in file){
					var patt = /\.kmz$/i;
				if (patt.test(file.name)){
					render_kmz(file);
				}
				}
				
				
			}
		}	
	}
}

function render_kmz(file){
	var reader = new FileReader();

	var template_layer = new geoXML3.parser({
					map: map,
					zoom: false,
					singleInfoWindow: true
              });
	reader.readAsDataURL(file);
	reader.onload = function(){
		template_layer.parse(reader.result);
	}
	var layer_order = custom_layer_list.length;
	custom_layer_list.push(template_layer);
}

function handle_custom_layer(num) {
	custom_layer_list[num].hideDocument();
}