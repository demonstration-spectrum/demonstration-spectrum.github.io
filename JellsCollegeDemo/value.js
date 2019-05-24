var url_string = window.location.href.replace(/%3f|F/g,"?");
var url = new URL(url_string);
var hard_filter_list = {};


function map_ordering(){
    layers = layer_pointer();
	for (var key in layers){
		item_layer = layers[key];
        if (typeof(item_layer) != "undefined"){
			if (!!item_layer.onmap){
				if (item_layer.onmap(map) == true)
					{
						item_layer.removeFromMap(map);
						item_layer.addToMap(map);
						
					}
			} else if (item_layer.map == map) {
				item_layer.setMap(map);
            }
        }
	}
		
}

var list_of_class = {
"clientStore":{'id':"spectrum:Jells_college",'ulid':'clientStore_list','max_count':1,'id_col':'fusion_id','name_col':'name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoserver','default':''},


"_2019_enrol":{'id':"spectrum:Jells_college_students",'ulid':'_2019_enrol_list','max_count':1,'id_col':'fusion_id','name_col':'student_name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoserver','default':''},
"_2016_enrol":{'id':"spectrum:Jells_college_students_2016",'ulid':'_2016_enrol_list','max_count':1,'id_col':'fusion_id','name_col':'student_name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoserver','default':''},
"_2011_enrol":{'id':"spectrum:Jells_college_students_2011",'ulid':'_2011_enrol_list','max_count':1,'id_col':'fusion_id','name_col':'student_name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoserver','default':''},
"seifa":{'id':"j5937_kingswim_0518:seifa",'ulid':'seifa_list','max_count':1,'id_col':'fusion_id','name_col':'sa1_id','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoserver','default':''},
"pri_catchment":{'id':"spectrum:Jells_college_primary_catchment_area",'ulid':'pri_catchment_list','max_count':1,'id_col':'fusion_id','name_col':'name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoserver','default':''},
"sec_catchment":{'id':"spectrum:Jells_college_secondary_catchment_area",'ulid':'sec_catchment_list','max_count':1,'id_col':'fusion_id','name_col':'name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoserver','default':''},
"comp":{'id':"spectrum:Jells_competitors",'ulid':'comp_list','id_col':'fusion_id','name_col':'school_name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoserver','default':''},
"pop_growth":{'id':"spectrum:Suburbs (Population Projection)",'ulid':'pop_growth_list','max_count':1,'id_col':'fusion_id','name_col':'locality_name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoserver','default':''},
"student_penetration":{'id':"spectrum:Jells_sa1_2016_aust",'ulid':'student_penetration_list','max_count':1,'id_col':'fusion_id','name_col':'sa1_maincode_2016','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoserver','default':''},
"transport":{'id':"spectrum:Jells_transport",'ulid':'transport_list','id_col':'fusion_id','name_col':'name','exception':[],'styleId': 2, 'templateId': 2,'layer_type':'geoserver','default':''},

};

function layer_pointer(){
   var layer_list = {

						"seifa":seifa_layer,
						"pri_catchment":pri_catchment_layer,
						"sec_catchment":sec_catchment_layer,

						"pop_growth":pop_growth_layer,
						"student_penetration":student_penetration_layer,
						"transport":transport_layer,

						"comp":comp_layer,
					    "clientStore":clientStore_layer,

						"_2019_enrol":_2019_enrol_layer,
						"_2016_enrol":_2016_enrol_layer,
						"_2011_enrol":_2011_enrol_layer,
					};
   return layer_list;
}

function list_pointer(){
   var a_list = {
					    "clientStore":clientStore_list,
						"_2019_enrol":_2019_enrol_list,
						"_2016_enrol":_2016_enrol_list,
						"_2011_enrol":_2011_enrol_list,
						"seifa":seifa_list,
						"pri_catchment":pri_catchment_list,
						"sec_catchment":sec_catchment_list,
						"comp":comp_list,
						"pop_growth":pop_growth_list,
						"student_penetration":student_penetration_list,
						"transport":transport_list,

					
					
				 };
   return a_list;
}

var clientStore_list = [];
var _2019_enrol_list = [];
var _2016_enrol_list = [];
var _2011_enrol_list = [];
var seifa_list = [];
var pri_catchment_list = [];
var sec_catchment_list = [];
var comp_list = [];
var pop_growth_list = [];
var student_penetration_list = [];
var transport_list = [];





var layer_list = new Array();
var test_layer;

function name_id_list_fusion(id_col,name_col,TableID, current_list_pointer) {
  var FT_TableID =TableID;
  var sortby = list_of_class[current_list_pointer]['sortby'];
  var check_on_column = list_of_class[current_list_pointer]['check_on_column'];


  var queryText = encodeURIComponent("SELECT '"+id_col+"', '" + name_col +"', 'centroidy','centroidx','area' "+(!!check_on_column ? ",'"+ check_on_column+"'":"")+" FROM "+FT_TableID+ (!!sortby ? " ORDER BY "+ sortby : ""));
  var query = 'https://www.googleapis.com/fusiontables/v2/query?key=AIzaSyDfM2G-dd5qJ5A09ffhzyH7YrHinEVE9po&sql='  + queryText;
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET',query,true);
  xhttp.send();
  var a_list = list_pointer()[current_list_pointer];
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      a_list = a_list.concat(JSON.parse(this.responseText)['rows']);
	  list_generate(a_list,list_of_class[current_list_pointer]['ulid'],current_list_pointer);
	  format_input_box(current_list_pointer);
    }
  };
}
function name_id_list_geoserver(id_col,name_col,TableID, current_list_pointer) {
  if (hard_filter_list){
	  if (current_list_pointer in hard_filter_list){
		  list_of_class[current_list_pointer].hard_filter = hard_filter_list[current_list_pointer];
		  var current_cql_filter = hard_filter_list[current_list_pointer].cql_filter;
	  }
	 }
  var FT_TableID =TableID;
  var sortby = list_of_class[current_list_pointer]['sortby'];
  var check_on_column = list_of_class[current_list_pointer]['check_on_column'];
  var col_name = "1";
  var term = "2";

  var template_query = "http://map.spectrumanalysis.com.au/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&count=500&typeNames={FT_TableID}&propertyName={column_list}&outputFormat=application%2Fjson";
  // question mark need to be encode before sending https://stackoverflow.com/questions/12766953/python-regex-with-question-mark-literal
  var queryText = encodeURIComponent("SELECT '"+id_col+"', '" + name_col +"', 'centroidy','centroidx','area' "+(!!check_on_column ? ",'"+ check_on_column+"'":"")+" FROM "+FT_TableID+ (!!sortby ? " ORDER BY "+ sortby : ""));
  var query = template_query.replace(/{FT_TableID}/g,FT_TableID).replace(/{column_list}/g, id_col+',' + name_col +','+'centroidy,centroidx,area');
  if(!!list_of_class[current_list_pointer]["max_count"]){query = query.replace("count=500","count=" + list_of_class[current_list_pointer]["max_count"])}

  if (current_cql_filter){
	query = query + "&CQL_FILTER={cql_filter}".replace(/{cql_filter}/g,encodeURIComponent(current_cql_filter));
  }
  //console.log('query constructed:' + query);
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET',query,true);
  xhttp.send();
  var a_list = list_pointer()[current_list_pointer];
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
	  var feature_list = JSON.parse(this.responseText)['features'];
	  var adjusted_features = [];
      for (var i = 0; i<feature_list.length; i++){
			var feature = [];
			feature.push(feature_list[i].properties[id_col]);
			feature.push(feature_list[i].properties[name_col]);
			feature.push(feature_list[i].properties['centroidy']);
			feature.push(feature_list[i].properties['centroidx']);
			feature.push(feature_list[i].properties['area']);
			adjusted_features.push(feature);

	  }

      a_list = a_list.concat(adjusted_features);
	  list_generate(a_list,list_of_class[current_list_pointer]['ulid'],current_list_pointer);
	  format_input_box(current_list_pointer); //attach the event listening function into the box
    }
  };

}

for (var key in list_of_class){
	if(typeof(list_of_class[key]['ulid']) != 'undefined'){
		if(list_of_class[key]['ulid'] != ''){
			if(list_of_class[key]['layer_type'] != 'geoserver'){
				name_id_list_fusion(list_of_class[key]['id_col'],list_of_class[key]['name_col'],list_of_class[key]['id'],key);
			} else if(list_of_class[key]['layer_type'] == 'geoserver'){
				console.log('geoserver');
				name_id_list_geoserver(list_of_class[key]['id_col'],list_of_class[key]['name_col'],list_of_class[key]['id'],key);

			}
		}
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