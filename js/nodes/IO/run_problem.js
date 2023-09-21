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
        
        var that = this;

        // This should be triggered onExecute
        // this.addWidget("button", "Download", "", function (v) {
        //     if (!that.value)
        //         return;
        //     that.uploadProblem();
        // });
    }

    uploadProblem() {
        if (this.value == null)
            return;

        var str = null;

        if (this.value.constructor === String) {
            str = this.value;
        } else {
            str = JSON.stringify(this.value);
        }

        let project_parameters = new Blob([str]);

        // var that = this;
        // var zip = new JSZip();
        //     zip.file("ProjectParameters.json", new Blob([str]));

        //     Object.entries(problem_files["materials"]).forEach(([key, value]) => {
        //         zip.file(value["name"]+".json", new Blob([JSON.stringify(value["data"])]));
        //     });

        //     zip.generateAsync({type:"blob"})
        //     .then(function(content) {
        //         that.saveAs(content, "case.zip");
        // });
    }

    onExecute() {
        var that = this;
        this._debug.value = "Loading...";
        fetchServerStream(
            'http://' + this.virtual_run_ip.value + ":" + this.virtual_run_pt.value + "/kratos",
            that
        );
    }
}

RunProblem.title = "Run Problem";
RunProblem.desc = "Runs the problem";

LiteGraph.registerNodeType("IO/Run Problem", RunProblem);
