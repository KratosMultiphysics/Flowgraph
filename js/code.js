
LiteGraph.node_images_path = "../nodes_data/";

var editor = new LiteGraph.Editor("main");
window.graphcanvas = editor.graphcanvas;
window.graph = editor.graph;
window.graphcanvas.title_text_font = '400 16px "Roboto"';
window.addEventListener("resize", function() { editor.graphcanvas.resize(); } );
//window.addEventListener("keydown", editor.graphcanvas.processKey.bind(editor.graphcanvas) );
window.onbeforeunload = function(){
	var data = JSON.stringify( graph.serialize() );
	localStorage.setItem("litegraphg demo backup", data );
}

//create scene loader
var elem = document.createElement("span");

elem.className = "selector"
elem.innerHTML = "<span style='vertical-align: middle;'> Kratos FlowGraph <span class='glyph'>\uf35a</span></span> ";

elem.innerHTML += "<span id='play-graph' class='float-btn btn-blue'>Generate</span>";
elem.innerHTML += "<label id='save-graph' class='float-btn'>Save</label>";
elem.innerHTML += "<label class='float-btn'>Load<input type='file' id='load-graph' style='display:none'></label>";
elem.innerHTML += "<label id='expt-group' class='float-btn'>Export</label>";
elem.innerHTML += "<label class='float-btn'>Import<input type='file' id='impt-group' style='display:none'></label>";
elem.innerHTML += "<label class='float-btn' onclick='openNav()'>Toggle</label>";

$('.loadmeter').remove();

editor.tools.appendChild(elem);

document.querySelector("#play-graph").addEventListener("click", function() {
    if (graph.status == LGraph.STATUS_STOPPED) {
        this.innerHTML = "Stop";
        graph.start();
    } else {
        this.innerHTML = "Generate";
        graph.stop();
    }
});

document.querySelector("#load-graph").addEventListener('change', (event) => {
	const fileList = event.target.files;
	graph.load(fileList[0])
	
	name = document.getElementById('download-name').value = event.target.files[0].name
});

document.querySelector("#save-graph").addEventListener("click",function(){
	var data = JSON.stringify( graph.serialize() );
	var file = new Blob( [ data ] );
	var url = URL.createObjectURL( file );
	var element = document.createElement("a");
	element.setAttribute('href', url);

	var name = 'graph.json';

	element.setAttribute('download', name );
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
	setTimeout( function(){ URL.revokeObjectURL( url ); }, 1000*60 ); //wait one minute to revoke url	
});

document.querySelector('#expt-group').addEventListener("click", function() {
    var serialization_data = {"nodes":[], "links":[]};
    var nodes_id = [];

    for(var node in graphcanvas.selected_nodes) {
        serialization_data["nodes"].push(graphcanvas.selected_nodes[node].serialize());
        nodes_id.push(graphcanvas.selected_nodes[node].id);
    };

    for(var link in graph.links) {
        if (nodes_id.includes(graph.links[link].origin_id) && nodes_id.includes(graph.links[link].target_id)) {
            serialization_data["links"].push(graph.links[link].serialize());
        }
    };

    var data = JSON.stringify(serialization_data);
    var element = document.createElement("a");
    
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
	element.setAttribute('download', "selection.json" );
	element.style.display = 'none';

	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
});

document.querySelector('#impt-group').addEventListener('change', (event) => {
    const LINK_OBJECT_ID = 0;
    const LINK_ORIGIN_ID = 1;
    const LINK_TARGET_ID = 3;

	const fileData = event.target.files;
    const reader = new FileReader();
    reader.onload = function(event) {
        import_group = JSON.parse(event.target.result);

        // Modify node and links id's as we cannot assume the same entities or other entities
        // with the same id are used in the grapgh
        var last_node_id = graph.last_node_id;
        var last_link_id = graph.last_link_id;
        var new_node_ids_map = {};
        var new_link_ids_map = {};

        // Nodes
        for(var node in import_group["nodes"]) {
            const old_id = import_group["nodes"][node]["id"]
            const new_id = ++last_node_id;
            new_node_ids_map[old_id] = new_id;
            import_group["nodes"][node]["id"] = new_id;
        }

        for(var link in import_group["links"]) {
            if (import_group["links"][link][LINK_ORIGIN_ID] in new_node_ids_map) {
                import_group["links"][link][LINK_ORIGIN_ID] = new_node_ids_map[import_group["links"][link][LINK_ORIGIN_ID]];
            }
            if (import_group["links"][link][LINK_TARGET_ID] in new_node_ids_map) {
                import_group["links"][link][LINK_TARGET_ID] = new_node_ids_map[import_group["links"][link][LINK_TARGET_ID]];
            }
        }

        graph.last_node_id = last_node_id;
        
        // Links

        for(var link in import_group["links"]) {
            const old_id = import_group["links"][link][LINK_OBJECT_ID]
            const new_id = ++last_link_id;
            new_link_ids_map[old_id] = new_id;
            import_group["links"][link][LINK_OBJECT_ID] = new_id;
        }

        for(var node in import_group["nodes"]) {
            for(var input in import_group["nodes"][node]["inputs"]) {
                if( import_group["nodes"][node]["inputs"][input]["link"] in new_link_ids_map) {
                    import_group["nodes"][node]["inputs"][input]["link"] = new_link_ids_map[import_group["nodes"][node]["inputs"][input]["link"]];
                }
            }

            for(var output in import_group["nodes"][node]["outputs"]) {
                for(var link in import_group["nodes"][node]["outputs"][output]["links"]) {
                    if( import_group["nodes"][node]["outputs"][output]["links"][link] in new_link_ids_map) {
                        import_group["nodes"][node]["outputs"][output]["links"][link] = new_link_ids_map[import_group["nodes"][node]["outputs"][output]["links"][link]];
                    }
                }
            }
        }

        graph.last_link_id = last_link_id;

        const data = {
            nodes: import_group["nodes"],
            links: import_group["links"],
            version: LiteGraph.VERSION
        };

        graph.configure_selection(data, true);
    };
    reader.readAsText(fileData[0]);
});