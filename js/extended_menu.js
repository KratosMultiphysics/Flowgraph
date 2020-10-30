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

			// Namespace prune. I don't fully understand this use case but was in the base.
			if(name.indexOf("::") != -1)
				name = name.split("::")[1];

			// Submenu parse
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
	
	var entries = [];

	Object.entries(entries_levels).forEach(([key, value]) => {
		entries.push(value);
	});

	// Show Initial submenu. Probably can be merged. Menu_level is used to correctly assign the parentMenu at each level.
	var menu = new LiteGraph.ContextMenu( entries, { event: e, callback: handle_menu_click, parentMenu: prev_menu }, ref_window );
	var menu_level = {'': menu};

	// Select callback depending on the entry attributes. "Submode" key seems to handle submenus natively, but I am unable to make it work.
	function handle_menu_click(v, option, e) {
		if(v.sub == undefined || v.sub.size == 0) {
			handle_leave(v, option, e);
		} else {
			handle_submenu(v, option, e);
		}
	}

	function handle_submenu(v, option, e) {
		var category = v.value;
		console.log("Category:", category);
		var node_types = LiteGraph.getNodeTypesInCategory( category, canvas.filter || graph.filter );
		var values = [];

		var category_path = category.split("/");

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

		var prev = "";
		if (category_path.length > 1 ) {
			category_path.splice(-1,1)
			prev = category_path.join("/");
		}

		new_menu = new LiteGraph.ContextMenu( values, { event: e, callback: universal_clicked, parentMenu: menu_level[prev] }, ref_window );
		menu_level[category] = new_menu;
		return false;
	}

	function handle_leave(v, e) {
		var first_event = prev_menu.getFirstEvent();
		canvas.graph.beforeChange();
        var node = LiteGraph.createNode(v.value);
        
		if (node) {
			node.pos = canvas.convertEventToCanvasOffset(first_event);
			canvas.graph.add(node);
        }
        
		if(callback) {
            callback(node);
        }
            
		canvas.graph.afterChange();
	}

	return false;
};