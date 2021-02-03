class ParsedModelPart {
    constructor() {
        this.input_manager = document.createElement('input');
        this.input_manager.type = 'file';
        this.input_manager.addEventListener('change', this.onSelection.bind(this));

        this.mp_select = this.addWidget("button", "Load Mdpa", "", function (value, widget, node) {
            node.input_manager.click();
        });

        this.properties = {
            "submodelpart_list" : []
        };

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute() {
        for (let i = 0; i < this.outputs.length; ++i) {
            this.setOutputData(i, this.outputs[i].name);
        }
    }

    onSelection(e) {
        const [file] = event.target.files;
        this.readSingleFile(file);
    }

    readSingleFile(file) {
        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = this.onReaderLoad(file);
        reader.readAsText(file);
    };

    onReaderLoad(file) {
        return ({ target: { result } }) => {
            const mdpa_subs_re = /.*((Begin SubModelPart) ([a-zA-Z0-9_]+))|(End SubModelPart$)/gm;
            const sub_mdpa = result.matchAll(mdpa_subs_re);

            // Remove existing outputs
            this.properties["submodelpart_list"] = [];

            // Obtain the name of the ModelPart to get complete routes
            let sub_mdpa_namepath = file.name.slice(0, -5);

            // Obtain the Submodelparts
            this.addOutput(sub_mdpa_namepath, "string");
            for (const match of sub_mdpa) {
                if (match[0].includes("Begin")) {
                    sub_mdpa_namepath = `${sub_mdpa_namepath}.${match[3]}`;
                    this.properties["submodelpart_list"].push(sub_mdpa_namepath);
                }
            }

            // Populate the outputs
            while (this.outputs != undefined && this.outputs.length != 0) {
                this.removeOutput(0);
            }

            for (const submodelpart of this.properties["submodelpart_list"]) {
                this.addOutput(submodelpart, "string", {"label":submodelpart});
            }

            this.updateProblemModelParts();
            this.updateModelNodes();
        }
    }

    updateProblemModelParts() {
        // Need to restore the list of submodelparts in the main model node.
        problem_modelparts[this.id] = []

        for (const submodelpart of this.properties["submodelpart_list"]) {
            problem_modelparts[this.id].push(submodelpart);
        }
    }

    updateModelNodes() {
        // Update the combos of all the Models nodes in the workspace
        for (const modelNode of Object.keys(model_nodes)) {
            model_nodes[modelNode].updateCombos();
        }
    }

    onAdded() {
        this.updateProblemModelParts();
        this.updateModelNodes();
    }

    onRemoved() {
        // Unregister
        delete problem_modelparts[this.id];
        this.updateModelNodes();
    }
}

ParsedModelPart.title = "ParsedModelPart";
ParsedModelPart.desc = "Parses a ModelPart";

LiteGraph.registerNodeType("model_part/ParsedModelPart", ParsedModelPart);

console.log("ParsedModelPart node created"); //helps to debug