$(".filter_box").on('change keyup', function () {
    // Declare variables
	//alert('ok');
    var filter, ul, li, a, i, myUL;
	var filter_list = "['"+ $(this).val().replace(/,/g,"','") + "']";
	//alert('string:'+filter_list);
	filter_list = filter_list.replace(/'/g, '"').replace(/\s*"/g, '"').replace(/"\s*/g, '"');
	//alert(filter_list);
	filter_list = JSON.parse(filter_list);
    filter = $(this).val().toUpperCase();
	//alert('filter: ' + filter_list.length + ": " + filter_list);
	myUL = $(this).attr("ul");
    ul = document.getElementById(myUL);
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
		li[i].style.display = "none";
        a = li[i].getElementsByTagName("span")[0];
		for (var j = 0; j<filter_list.length;j++){
			filter = filter_list[j].toUpperCase();
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            }
		}
    }
});

