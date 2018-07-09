function map_ordering(){
    layers = layer_pointer();
    //alert('set map');
	for (var key in layers){
		item_layer = layers[key];
        if (typeof(item_layer) != "undefined"){
          	if (item_layer.map == map) {
             	  	item_layer.setMap(map);
            }
        }
	}
		
}

var list_of_class = {
"territory":{'id':"18Nifm-lKVVdaZa2J0HXiS-Xu1ncppA783e7lVJdm",'ulid':'territory_list','id_col':'name','name_col':'name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'fusion','default':'checked'},	

"competitor":{'id':"10FG4AKMLnw5IjeHGLQ28KqBheqKTE3YmKrKyX_P4",'ulid':'competitor_list','id_col':'Place_id','name_col':'Name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoxml','default':'checked'},
"store_location":{'id':"1jfLCJsmngh7vU_Ce-y-5WxhgwnP9oDFpFF_O2lCY",'ulid':'store_location_list','id_col':'Fusion_ID','name_col':'Name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoxml','default':'checked'},
"seifa":{'id':"1s2afa0oM24j5by8d_PwKCpSfoiISGt0Nv8T2zHzw",'ulid':'seifa_list','id_col':'name','name_col':'LOCALITY_PID','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'fusion','default':''},
"pop_density":{'id':"1Z2SiFS3yXsqSedH_mRZ1KBjAPc4O0w0vuO_DAvyN",'ulid':'pop_density_list','id_col':'name','name_col':'LOCALITY_PID','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'fusion','default':''},
"bapproval_1116":{'id':"1GoMon72ddJ2gTf1pthKZY1rW9aayPYk-w9YsMas9",'ulid':'bapproval_1116_list','id_col':'name','name_col':'LOCALITY_PID','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'fusion','default':''},
"bapproval_no_1116":{'id':"1SA6DRFqM8XLdiC7T_nj8PvtVNky1hOs4l8Kn1kEg",'ulid':'bapproval_no_1116_list','id_col':'col0\x3e\x3e0','name_col':'LOCALITY_PID','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'fusion','default':''},
"popprojchange_1626":{'id':"10bj3g26e5v1EWh9bgzCw0cMZ9l3ow62xZoRFTO18",'ulid':'popprojchange_1626_list','id_col':'col0\x3e\x3e0','name_col':'LOCALITY_PID','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'fusion','default':''},
"popprojchange_no_1626":{'id':"18EK2a_4DNtEW5Jb6RSnQZbvoJcbhyUkINYce1QCj",'ulid':'popprojchange_no_1626_list','id_col':'col0\x3e\x3e0','name_col':'LOCALITY_PID','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'fusion','default':''},

};

function layer_pointer(){
   var layer_list = {
	   
					"pop_density":pop_density_layer,
					"bapproval_no_1116":bapproval_no_1116_layer,
					"popprojchange_1626":popprojchange_1626_layer,
					"popprojchange_no_1626":popprojchange_no_1626_layer,

					"bapproval_1116":bapproval_1116_layer,
					

					
					"territory":territory_layer,
					"seifa":seifa_layer,					
					"competitor":competitor_layer,
					"store_location":store_location_layer,

					};
   return layer_list;
}

function list_pointer(){
   var a_list = {
					"seifa":seifa_list,
					"territory":territory_list,
					"pop_density":pop_density_list,
					"bapproval_1116":bapproval_1116_list,		 						 				 
					"bapproval_no_1116":bapproval_no_1116_list,		 						 				 
					"popprojchange_1626":popprojchange_1626_list,		 						 				 
					"popprojchange_no_1626":popprojchange_no_1626_list,		 						 				 
					"pop_density":pop_density_list,	  				 
					"competitor":competitor_list,		 						 				 
					"store_location":store_location_list,					 
				 };
   return a_list;
}


var territory_list = [];
var seifa_list = [];
var pop_density_list = [];
var bapproval_no_1116_list = [];
var popprojchange_1626_list = [];
var popprojchange_no_1626_list = [];
var bapproval_1116_list = [];
var competitor_list = [];
var store_location_list = [];

var layer_list = new Array();
var test_layer;

function name_id_list(id_col,name_col,TableID, current_list_pointer) {
  var FT_TableID =TableID;
  var sortby = list_of_class[current_list_pointer]['sortby'];
  var check_on_column = list_of_class[current_list_pointer]['check_on_column'];	
  var col_name = "1";
  var term = "2";
  var queryText = encodeURIComponent("SELECT '"+id_col+"', '" + name_col +"', 'centroidy','centroidx','area' "+(!!check_on_column ? ",'"+ check_on_column+"'":"")+" FROM "+FT_TableID+ (!!sortby ? " ORDER BY "+ sortby : ""));
  var query = 'https://www.googleapis.com/fusiontables/v2/query?key=AIzaSyCrv-YY5bKt9azbsU-TO5Y-9uzsQOdPNgY&sql='  + queryText;
  //alert('query constructed:' + query);
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET',query,true);
  xhttp.send();
  //alert('xhttp ok');
  var a_list = list_pointer()[current_list_pointer];
  xhttp.onreadystatechange = function() {
	//if (this.readyState == 4 && this.status == 400){
	//   if(typeof(JSON.parse(this.responseText)["error"]["errors"]) != "undefined"){
	//	   alert("Error with list " + current_list_pointer + "\n" + JSON.parse(this.responseText)["error"]["errors"][0]["message"]);
	//   }
	//}
    if (this.readyState == 4 && this.status == 200) {
		//alert(current_list_pointer + "       :" + this.responseText);
      a_list = a_list.concat(JSON.parse(this.responseText)['rows']);
	  //alert("layer_list: " + layer_list.length);
	  //alert('a_list_json: ' + current_list_pointer + "       :" + a_list.length);
	  list_generate(a_list,list_of_class[current_list_pointer]['ulid'],current_list_pointer);
	  format_input_box(current_list_pointer); //attach the event listening function into the box
    }  
  };

}

for (var key in list_of_class){
	if(typeof(list_of_class[key]['ulid']) != 'undefined'){
		name_id_list(list_of_class[key]['id_col'],list_of_class[key]['name_col'],list_of_class[key]['id'],key);
	}
}


function attach_layer(f_TableID, f_where,f_options,f_index){
	layer_list[f_index]= new google.maps.FusionTablesLayer({query: {select: '\'col2\'',from: f_TableID, where: f_where}, options: f_options  });
	//alert('layer_list set');
}

function list_generate(list,ulid,liid,layer_index){
	var list_default = list_of_class[liid]['default'];
	var check_on_column = list_of_class[liid]['check_on_column'];
	var check_on_value = list_of_class[liid]['check_on_value'];	

	if (typeof(layer_index) === 'undefined') {
		layer_index = 'undefined';
	}
	ul = document.getElementById(ulid);
    for (var i =0; i<list.length; i++){
		if (!!check_on_column && !!check_on_value){
			item_default = (check_on_value.toString() == list[i][5].toString() ? "checked" : "");
		
		}else{
			item_default = list_default;
			}		
		//console.log(liid + "   " + list[i][1] + "    " + list[i][5].toString() + "          " + check_on_value.toString());
		var el = document.createElement("li");
		el.innerHTML = "<div class='checkbox'><input type='checkbox' layer_index='"+layer_index+"' "+(!!check_on_value?"check_on_value="+list[i][5]:"")  +" querytype='"+liid+"' "+ "query_val = '"+list[i][0]+"' "  +"value='"+list[i][1]+"' "+ item_default+"><span querytype= '"+liid+"' "+"query_val = '"+list[i][0]+"'"  + "centroidy = '"+list[i][2]+"' "+ "centroidx = '"+list[i][3]+"' "+ "area = '"+list[i][4]+"' "  +"class='button query'>"+list[i][1]+"</span></div>";
		//var ul = document.createElement("ul");
		ul.appendChild(el);
	}

}


//list_generate(territory_list,"territory_list","territory");
//list_generate(competitor_list,"competitor_list","competitor");
//setInterval(map_ordering, 3000);
