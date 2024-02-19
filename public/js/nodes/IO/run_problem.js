async function uploadJson(url, json_data) {
    let pp_blob = new Blob([JSON.stringify(json_data)], {type: "application/json"})
    console.log(pp_blob);
    const response = await fetch(url, {method:"POST", body:pp_blob}).then(
        async (response) => {
            if (response.ok) return response;
            else throw Error(`Server returned ${response.status}: ${response.statusText}`)
        }
    );
}

async function fetchServerData(url, that) {
    const response = await fetch(url);
    const data = await response.text();
    that._debug.value = data;
}

async function fetchServerStream(url, that) {
    const response = await fetch(url).then(
        async (response) => {
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            for await (const chunk of readChunks(reader)) {
                let decoded = decoder.decode(chunk);
                console.log(decoded);
                $('#json-display').append(decoded+'\n');
            }
        }
    );
}

function readChunks(reader) {
    return {
        async* [Symbol.asyncIterator]() {
            let readResult = await reader.read();
            while (!readResult.done) {
                yield readResult.value;
                readResult = await reader.read();
            }
        },
    };
}

class RunProblem {
    constructor() {
        this.size = [60, 30];

        this.addInput("data", 0);

        this.virtual_run_ip = this.addWidget("string", "Ip", "localhost");
        this.virtual_run_pt = this.addWidget("string", "Port", "8288");

        this._debug = this.addWidget("text", "Debug", "");

        this.properties = { filename: "data.json" };
        this.value = null;
    }

    async onExecute() {
        var that = this;
        var project_parameters = this.getInputData(0);

        this._debug.value = "Loading...";

        let api_url = 'http://' + this.virtual_run_ip.value + ":" + this.virtual_run_pt.value;
        
        await uploadJson(
            api_url + "/upload_json",
            project_parameters
        );

        await fetchServerStream(
            api_url + "/run_simulation",
            that
        );
    }
}

RunProblem.title = "Run Problem";
RunProblem.desc = "Runs the problem";

LiteGraph.registerNodeType("IO/Run Problem", RunProblem);
