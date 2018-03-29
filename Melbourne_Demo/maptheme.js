$(".theme_thumb").on("click", function(){
	style_option = JSON.parse(this.getAttribute("data-style"));
	map.setOptions({styles:style_option});
	console.log('Option set');
});