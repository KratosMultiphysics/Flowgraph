/* Set the width of the sidebar to 250px (show it) */
function openNav() {
    let toggle_state = document.getElementById("side-viewer").getAttribute('toggled');

    if (toggle_state == "collapsed"){
        document.getElementById("side-viewer").setAttribute('toggled', "visible")
	    document.getElementById("side-viewer").style.width = "512px";

    } else {
        document.getElementById("side-viewer").setAttribute('toggled', "collapsed")
        document.getElementById("side-viewer").style.width = "0";
    }
}

// /* Set the width of the sidebar to 0 (hide it) */
// function closeNav() {
// 	document.getElementById("side-viewer").style.width = "0";
// } 

function addViewerNode() {
    graph.add(LiteGraph.createNode("IO/JSONView"));
}