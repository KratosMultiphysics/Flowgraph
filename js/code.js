
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
elem.innerHTML = "Kratos FlowGraph <span class='glyph'>\uf35a</span>";

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

	var name = document.getElementById('download-name').value + '.json';

	element.setAttribute('download', name );
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
	setTimeout( function(){ URL.revokeObjectURL( url ); }, 1000*60 ); //wait one minute to revoke url	
});

document.querySelector('#expt-group').addEventListener("click", function() {
    var serialization_data = []

    for(var node in graphcanvas.selected_nodes) {
        console.log(node)
        serialization_data.push(graphcanvas.selected_nodes[node].serialize());
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
	const fileData = event.target.files;
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = {
            nodes: JSON.parse( event.target.result ),
            version: LiteGraph.VERSION
        };

        graph.configure(data, true);
    };
    reader.readAsText(fileData[0]);
});