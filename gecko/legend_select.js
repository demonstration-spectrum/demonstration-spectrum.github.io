$(document).on('change', '.legend_select', function(e) {
    var current_value = this.options[e.target.selectedIndex].value;
	var tableid = $(this).attr('id');
	var list_of_span = document.querySelector('table#'+tableid).querySelectorAll('td.googft-legend-range');
	for (var i = 0; i < list_of_span.length; i++){
		list_of_span[i].style.display = "none";
		
	}
	list_of_span = document.querySelector('table#'+tableid).querySelectorAll('td.googft-legend-range.'+current_value);
	for (var i = 0; i < list_of_span.length; i++){
		list_of_span[i].style.display = "";
		
	}
});