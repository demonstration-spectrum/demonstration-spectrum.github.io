var $nav = $("#main-nav-tabs");
var $nav_ul = $nav.children("ul[class='nav nav-tabs']");
$nav_ul.children("li").removeClass("active");
var $edit_nav = $nav_ul.children("li[id='edit-tab-nav']");
$edit_nav.addClass("active");

var pane_id;
pane_id = $edit_nav.children("a").attr('href');
var $nav_pane = $nav.children(".tab-content");
$nav_pane.children("div").removeClass("active");
var $edit_pane = $nav_pane.children(pane_id);
$edit_pane.addClass("active");
var $edit_fields = $edit_pane.find("#edit_fields");
var $submit = $nav_pane.find("button[id='edit_submit']");


function edit_feature(verbose_name, tableId, list_pointer, base_id_col, id_col, id_val, field_list){
	$edit_fields.empty();
	for (i=0; i< field_list.length; i++){
		$edit_fields.append($format_row(field_list[i]));
	}
	var input_id_string = '<input type="hidden" class="id_col" value="{ID_VALUE}" name="{ID_COL}" data-tableid = "{TABLEID}" data-list_pointer = "{list_pointer}">'.replace(/{ID_COL}/g, base_id_col).replace(/{ID_VALUE}/g, id_val).replace(/{TABLEID}/g, tableId).replace(/{list_pointer}/g, list_pointer);

	$edit_fields.append($(input_id_string));
	console.log($(input_id_string).prop("outerHTML"));
	console.log(input_id_string);
}

function $format_row(field){
	field_template = '<div class="row"><div class="col-md-12"><h5>{FIELD_NAME}</h5></div></div><div class="row"><div class="col-md-12"><input type="text" value="{FIELD_VALUE}" name="{FIELD_NAME}" class="width12"></div></div>';
	//http://pojo.sodhanalibrary.com/string.html
	var i = 0;
	var $result_html = $(field_template.replace(/{FIELD_NAME}/g,field.name).replace(/{FIELD_VALUE}/g, field.value));
	console.log("template: " + field_template.replace(/{FIELD_NAME}/g,field.name).replace(/{FIELD_VALUE}/g, field.value));
	return $result_html
	
	
}


function alter_infohtml(e, tableId, base_id_col) {
		console.log(e);
		//https://developers.google.com/fusiontables/docs/samples/change_infowindow_content
        //e.infoWindowHtml = '\"<div onclick=\'edit_feature()' class=\'googft-info-window\'>\n<table border=\"\"1\"\" padding=\"\"0\"\">\"\n<tr><td>name<\/td><td> '+ e.row['name'] + '<\/td><\/tr>\n<tr><td>description<\/td><td> '+ e.row['description'] + '<\/td><\/tr>\n<tr><td>Territory<\/td><td> '+ e.row['Territory'] + '<\/td><\/tr>\n<tr><td>State<\/td><td> '+ e.row['State'] + '<\/td><\/tr>\n<tr><td>Email<\/td><td> '+ e.row['Email'] + '<\/td><\/tr>\n<tr><td>Population_c2016<\/td><td> '+ e.row['Population_c2016'] + '<\/td><\/tr>\n<tr><td>Dwellings_c2016<\/td><td> '+ e.row['Dwellings_c2016'] + '<\/td><\/tr>\n<tr><td>Separate_House_2014<\/td><td> '+ e.row['Separate_House_2014'] + '<\/td><\/tr>\n<tr><td>Separate_House_2015<\/td><td> '+ e.row['Separate_House_2015'] + '<\/td><\/tr>\n<tr><td>Separate_House_2016<\/td><td> '+ e.row['Separate_House_2016'] + '\n\"<\/table>\n<\/div>\"';
		if (!tableId){
			tableId = territory_layer.getQuery().from;
		}
		var raw_html = e.infoWindowHtml;
		var $new_infohtml = $(raw_html);
		var list_pointer = "";
		var verbose_name = "Territory";
		layers = layer_pointer();
		for (var i in layers){
			if (layers[i] == territory_layer){
				list_pointer = i;
			}
		}
		console.log('list_pointer' + list_pointer);
		var id_col = list_of_class[list_pointer]['id_col'];
		console.log('id_col' + id_col);
		var id_val = "";
		for (rowname in e.row){
			if (rowname == id_col){
				id_val = e.row[rowname].value;
			}
		}
		var editable_fields = ['Territory', 'Email'];
		var passing_var = [verbose_name, tableId , list_pointer, base_id_col, id_col, id_val];
		var passing_string = "";
		var field_list = [];
		var field = "";
		for (var i=0; i<editable_fields.length; i++){
			var field_name = editable_fields[i];
			var field_value = e.row[editable_fields[i]].value;
			field_list.push({name: field_name, value: field_value}) ;
		}
		console.log(field_list);
		passing_var.push(field_list);
		for (var i=0; i<passing_var.length; i++){
			passing_string = passing_string + JSON.stringify(passing_var[i]) + ", ";
			
		}
		
		//$new_infohtml.attr("onclick","edit_feature(passing_string)".replace("passing_string",passing_string));
		edit_feature(verbose_name, tableId , list_pointer, base_id_col, id_col, id_val, field_list);
		e.infoWindowHtml = $new_infohtml.prop("outerHTML");
		console.log(e);
		
		
		
	}
	
$submit.on("click", function(){
	$(this).button('loading');});
$submit.on("click", function(){
	//$(this).button('loading');
	var $edit_fields = $(this).parent().parent().parent().parent().find("#edit_fields");
	//console.log(" $edit_fields" +  $edit_fields);
	var $id_field = $edit_fields.find('input[class="id_col"]');
	var base_id_col = $id_field.prop("name");
	var id_val = $id_field.prop("value");
	var tableId = $id_field.attr("data-tableid"); //have to use attr here, not prop
	var list_pointer = $id_field.attr("data-list_pointer");
	//console.log($(this));
	var url =  "https://spectrum-map.herokuapp.com/fusion/stroudhomes.spectrum.data/";
	
	
	
	var set_array = [];
	
	var query = "UPDATE " + tableId + " SET {SET_FIELDS} Where {ID_COL} = '{ID_VALUE}' ".replace(/{ID_COL}/g, base_id_col).replace(/{ID_VALUE}/g, id_val);
	var $input_fields = $edit_fields.find("input").not($id_field);
	console.log($edit_fields);
	$input_fields.each(function(){
		//console.log('set array: ' + $(this).prop("name"));
		set_array.push("{COL_NAME} = '{COL_VALUE}'".replace(/{COL_NAME}/g,$(this).prop("name")).replace(/{COL_VALUE}/g,$(this).prop("value")));
	});
	set_array = set_array.join(", ");
	query = query.replace(/{SET_FIELDS}/g, set_array);

	console.log('query: ' + query);
	$submit.button('reset');
	query = encodeURIComponent(query);		
	dataType = "application/json";
	$.get({
	  type: "GET",
	  url: url + query,
	  success: function (data) {
					console.log(data);
					var layer = layer_pointer()[list_pointer];
					var layer_query = layer.query
					layer.setOptions({query: layer_query});
					$submit.button('reset');
				},
	});
	
});	
