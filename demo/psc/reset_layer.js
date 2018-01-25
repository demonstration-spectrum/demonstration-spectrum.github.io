function reset_layer(){
	layers = layer_pointer();
	
	for (var key in layers){
		console.log(key);
		var check_on_column = list_of_class[key]['check_on_column'];
		var check_on_value = list_of_class[key]['check_on_value'];			
		var list_default = list_of_class[key]['default'];
		var input_check = false;
		if(list_default == 'checked'){
			input_check = true;
		}
		if(typeof(list_of_class[key]['ulid']) != 'undefined'){
			var input_list = document.querySelectorAll("input[querytype='"+key+"']");
			for (var i = 0; i < input_list.length; i++){
				var input = input_list[i];
				
				if (!!check_on_column && !!check_on_value){
					input_check = check_on_value.toString() == $(input).attr("check_on_value").toString();				
				}
				

				if(input_check == true){
					$(input).prop("checked",true);
				}else{
					$(input).prop("checked",false);
				}
			}
			setQuery(key);
			checkall_start();			
		} else {
			if (input_check == true){
				layers[key].setMap(map);
			} else {
				layers[key].setMap(null);
			}
		}

		//show_pc_outline();	
	}
	
	
}

$("input[id='checkall']").change(function() {
   	var ulid = $(this).attr('ul');
	//alert($(this).text().toLowerCase());
	if ($(this).prop("checked")==true) {
		$("ul[id='"+ulid+"']").find("input[type=checkbox]").prop('checked',true);
	}else{

		$("ul[id='"+ulid+"']").find("input[type=checkbox]").prop('checked',false);	
	}
	var querytype_list = [ulid.replace("_list",""),ulid.replace("_list","_1"),ulid.replace("_list","_2"),ulid.replace("_list","_3"),ulid.replace("_list","_4"),ulid.replace("_list","_5"),ulid.replace("_list","_6"),ulid.replace("_list","_7"),ulid.replace("_list","_8"),ulid.replace("_list","_9"),ulid.replace("_list","_10"),ulid.replace("_list","_11"),ulid.replace("_list","_12"),ulid.replace("_list","_13"),ulid.replace("_list","_14"),ulid.replace("_list","_15")];

	for (var i=0; i<querytype_list.length; i++){
		var querytype = querytype_list[i];
		if (typeof(list_of_class[querytype]) != "undefined"){
			setQuery(querytype);
		}
	}
	//alert(querytype_list + "<br>");
	
});



function setQuery_xml(querytype){
	//querytype = "comp";
	var layer = layer_pointer()[querytype];
	for (var i=0; i < layer.docs[0].placemarks.length; i++) {
		var query_val = layer.docs[0].placemarks[i].name;
		//alert(i+": "+ query_val);
		var input = document.querySelector("input[query_val='"+query_val+"']");
		if (!input){
			alert("found an null");
			alert(query_val);
		}else{
			if (input.checked == true){
				//alert('true');
				layer.docs[0].placemarks[i].marker.setMap(map);
			} else{
				//alert('false');
				layer.docs[0].placemarks[i].marker.setMap(null);
			}
		}
        
	}
	map_ordering();
}

function hide_afterparse(){
	//var geoXmlDoc = doc[0];
	//alert(geoXmlDoc.placemarks.length);
	for (var i=0; i < competitor_layer.docs[0].placemarks.length; i++) {
		competitor_layer.docs[0].placemarks[i].marker.setMap(map);
	}
    alert('parse'); 
	//competitor_layer.hideDocument();
}

//$("#checkall").click(
//setInterval(hide_afterparse,3000);

function checkall_start(){
	checkall_list = document.querySelectorAll("input[id='checkall']");
	//alert(checkall_list.length);
	for (var i = 0; i< checkall_list.length; i++){
			var checkall= checkall_list[i];
			//alert(checkall);
			var ulid = checkall.getAttribute('ul');
			var querytype_list = [ulid.replace("_list",""),ulid.replace("_list","_1"),ulid.replace("_list","_2")];
			for (var j=0; j<querytype_list.length; j++){
				var querytype = querytype_list[j];
				if (typeof(list_of_class[querytype]) != "undefined"){
					if(list_of_class[querytype]['default'] == 'checked'){
						if($(checkall).parent().prop("class").indexOf("toggle") >= 0){
							$(checkall).parent().prop("class","toggle btn btn-default");
						}
						checkall.checked = true;
						console.log(checkall.getAttribute('ul') + checkall.checked);
					}else{
						if($(checkall).parent().prop("class").indexOf("toggle") >= 0){
							$(checkall).parent().prop("class","toggle btn btn-default off");
						}						

						checkall.checked = false;
					}
				}
			}
	}
}

checkall_start();
function hide_pc_outline(){
	blank_pc_layer1.setMap(null);

}

function show_pc_outline(){
	blank_pc_layer1.setMap(map);

}	

$(".zoom_button").click(function(){
	if ($(this).text().indexOf("In")>=0){
		map.setZoom(map.getZoom()+1);
	}else if (map.getZoom() > 0) {
		map.setZoom(map.getZoom()-1);
	}
	
});

$(".groupselect").on("click", function(){
	var groupid = this.getAttribute("groupid");
	$(".groupselect").css({"border":""});
	$(this).css({"border":"solid"});
	$(".groupvalue").removeAttr("style").hide();
	$("#"+groupid).removeAttr("style").show();
	
	
});