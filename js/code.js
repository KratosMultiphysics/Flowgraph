
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


