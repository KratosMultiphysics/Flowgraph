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

function addViewerNode() {
    graph.add(LiteGraph.createNode("IO/JSONView"));
}

/* Dragons here */
async function fetchLlama() {
    let prompt = document.getElementById("kratos-llm").value;
    let api_url = 'http://' + 'localhost' + ':' + '8288' + '/kratos_lamma';

    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({prompt})
    }
    
    console.log(`[DEBUG]: Got promp request: "${prompt}"@${api_url}`);

    const response = await fetch(api_url, settings);
    const nodes_js = await response.json();

    return nodes_js
}

/** Api to process results from Runkratos.js experimental LLama2-problemtypes */
function llamaCall() {
    const response = fetchLlama().then(llama_data => {
        console.log(`[DEBUG]: Got promp result:\n${JSON.stringify({llama_data}, null, 4)}`);

        for(let llama_key in llama_data) {
            nodes = build_nodes_from_llama(llama_key, llama_data[llama_key]);
            nodes.forEach(n => graph.add(n));
        }
    });
}