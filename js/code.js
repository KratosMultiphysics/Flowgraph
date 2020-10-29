
LiteGraph.node_images_path = "../nodes_data/";

var editor = new LiteGraph.Editor("main");
window.graphcanvas = editor.graphcanvas;
window.graph = editor.graph;
window.addEventListener("resize", function() { editor.graphcanvas.resize(); } );
//window.addEventListener("keydown", editor.graphcanvas.processKey.bind(editor.graphcanvas) );
window.onbeforeunload = function(){
	var data = JSON.stringify( graph.serialize() );
	localStorage.setItem("litegraphg demo backup", data );
}

//create scene loader
var elem = document.createElement("span");

elem.className = "selector"
elem.innerHTML = "<label class='custom-file-select'><input id='file-selector' class='inputfile' type='file' name='file'/>Load</label><button id='download' class='btn'>Save</button> Filename:<input style='margin-left:10px' type='text' id='download-name' value='MyModel.json'/>";

$('.loadmeter').remove();

editor.tools.appendChild(elem);

const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
	const fileList = event.target.files;
	graph.load(fileList[0])
	
	name = document.getElementById('download-name').value = event.target.files[0].name
});

elem.querySelector("#download").addEventListener("click",function(){
	var data = JSON.stringify( graph.serialize() );
	var file = new Blob( [ data ] );
	var url = URL.createObjectURL( file );
	var element = document.createElement("a");
	element.setAttribute('href', url);

	name = document.getElementById('download-name').value + '.json';

	element.setAttribute('download', name );
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
	setTimeout( function(){ URL.revokeObjectURL( url ); }, 1000*60 ); //wait one minute to revoke url	
});

// Override the Litegrapgh menu generation
LGraphCanvas.onMenuAdd = function(node, options, e, prev_menu, callback) {
	var canvas = LGraphCanvas.active_canvas;
	var ref_window = canvas.getCanvasWindow();
	var graph = canvas.graph;
	if(!graph)
		return;

	var values = LiteGraph.getNodeTypesCategories( canvas.filter || graph.filter );

	var entries_levels = {};

	for (var i=0; i < values.length; i++) {
		if (values[i]) {
			var name = values[i];
			var name_route;
			var acc_route = "";

			if(name.indexOf("::") != -1)
				name = name.split("::")[1];

			if(name.indexOf("/") != -1)
				name_route = values[i].split("/");
			else
				name_route = name

			if(Array.isArray(name_route)) {
				acc_route += name_route[0];
				if(entries_levels[name_route[0]] == undefined)
					entries_levels[name_route[0]] = {value: acc_route, content: name_route[0], has_submenu: true, sub: {} }

				entry_point = entries_levels[name_route[0]].sub;

				for(var j = 1; j < name_route.length; j++) {
					acc_route += "/"+name_route[j];
					if(entry_point[name_route[j]] == undefined)
						entry_point[name_route[j]] = {value: acc_route, content: name_route[j], has_submenu: true, sub: {} }
					entry_point = entry_point[name_route[j]].sub;
				}
			} else {
				if(entries_levels[name_route] == undefined)
					entries_levels[name_route] = {value: values[i], content: name, has_submenu: true, sub: {} };
			}
		}
	}
	
	var entries = []; // Object.values(entries_levels);

	Object.entries(entries_levels).forEach(([key, value]) => {
		entries.push(value);
	});

	// Show Initial submenu. Probably can be merged.
	var menu = new LiteGraph.ContextMenu( entries, { event: e, callback: universal_clicked, parentMenu: prev_menu }, ref_window );

	// Select callback depending on the entry attributes. Still not sure what "submenu" key does, but seems to have a special meaning
	// that probably is worth investigating.
	function universal_clicked(v, option, e) {
		if(v.sub == undefined || v.sub.size == 0) {
			// This is an endnode
			console.log("End node")
			inner_create(v, option, e);
		} else {
			// This is not
			console.log("Intermediate node")
			inner_clicked(v, option, e);
		}
	}

	// Handle tree clicks
	function inner_clicked(v, option, e) {
		var category = v.value;
		console.log("Category:", category);
		var node_types = LiteGraph.getNodeTypesInCategory( category, canvas.filter || graph.filter );
		var values = [];
		// Build the entries belonging to submenus
		Object.entries(v.sub).forEach(([key, value]) => {
			values.push(value);
		});
		// Build the entries belonging end nodes
		for (var i=0; i < node_types.length; i++) {
			if (!node_types[i].skip_list) {
				values.push({
					content: node_types[i].title,
					value: node_types[i].type,
					has_submenu: false
				});
			}
		}

		console.log("Creating menus: ", values);
		var new_menu = new LiteGraph.ContextMenu( values, { event: e, callback: universal_clicked, parentMenu: menu }, ref_window );
		menu = new_menu;
		return false;
	}

	// Handle leave clicks
	function inner_create(v, e) {
		var first_event = prev_menu.getFirstEvent();
		canvas.graph.beforeChange();
		var node = LiteGraph.createNode(v.value);
		if (node) {
			node.pos = canvas.convertEventToCanvasOffset(first_event);
			canvas.graph.add(node);
		}
		if(callback)
			callback(node);
		canvas.graph.afterChange();
	}

	return false;
};


