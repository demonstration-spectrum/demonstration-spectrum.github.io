$(document).on('change', '#pop_change_number', function(e) {
    var current_value = this.options[e.target.selectedIndex].value;
	var list_of_span = document.querySelectorAll('td.googft-legend-range');
	for (var i = 0; i < list_of_span.length; i++){
		list_of_span[i].style.display = "none";
		
	}
	list_of_span = document.querySelectorAll('td.googft-legend-range.'+current_value);
	for (var i = 0; i < list_of_span.length; i++){
		list_of_span[i].style.display = "";
		
	}
});