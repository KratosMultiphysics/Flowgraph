class ParsedMaterialsFile {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf6d1', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.input_manager = document.createElement('input');
        this.input_manager.type = 'file';
        this.input_manager.addEventListener('change', this.onSelection.bind(this));

        this.mp_name = this.addWidget("text","Name", "", function(v){}, {} );
        this.mp_select = this.addWidget("button", "Load Json", "", function (value, widget, node) {
            node.input_manager.click();
        });

        this.properties = {
            "materials_list" : []
        };

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute() {
        for (let i = 0; i < this.outputs.length; ++i) {
            this.setOutputData(i, this.mp_name.value+this.outputs[i].name);
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
            this.properties["materials_list"] = [];

            // Obtain the name of the ModelPart to get complete routes
            let sub_mdpa_namepath = ""
            this.mp_name.value = file.name.slice(0, -5);

            // Obtain the Submodelparts
            this.addOutput(sub_mdpa_namepath, "string");
            for (const match of sub_mdpa) {
                if (match[0].includes("Begin")) {
                    sub_mdpa_namepath = `${sub_mdpa_namepath}.${match[3]}`;
                    this.properties["materials_list"].push(sub_mdpa_namepath);
                }

                if (match[0].includes("End")) {
                    sub_mdpa_namepath = sub_mdpa_namepath.split(".");
                    sub_mdpa_namepath.pop();
                    sub_mdpa_namepath = sub_mdpa_namepath.join(".");
                }
            }

            // Populate the outputs
            while (this.outputs != undefined && this.outputs.length != 0) {
                this.removeOutput(0);
            }

            for (const submodelpart of this.properties["materials_list"]) {
                this.addOutput(submodelpart, "string");
            }

            this.updateProblemModelParts();
            this.updateModelNodes();
        }
    }

    updateProblemModelParts() {
        // Need to restore the list of submodelparts in the main model node.
        problem_modelparts[this.id] = []

        for (const submodelpart of this.properties["materials_list"]) {
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

    // onReaderLoad(file) {
    //     return ({ target: { result } }) => {
    //         const mdpa_subs_re = /.*((Begin SubModelPart) ([a-zA-Z0-9_]+))|(End SubModelPart$)/gm;
    //         const sub_mdpa = result.matchAll(mdpa_subs_re);

    //         // Remove existing outputs
    //         while (this.outputs != undefined && this.outputs.length != 0) {
    //             this.removeOutput(0);
    //         }

    //         // Obtain the name of the ModelPart to get complete routes
    //         let sub_mdpa_namepath = file.name.slice(0, -5);

    //         // Obtain the Submodelparts
    //         this.addOutput(sub_mdpa_namepath, "string");
    //         for (const match of sub_mdpa) {
    //             if (match[0].includes("Begin")) {
    //                 sub_mdpa_namepath = `${sub_mdpa_namepath}.${match[3]}`;
    //                 this.addOutput(sub_mdpa_namepath, "string");
    //             } else {
    //                 sub_mdpa_namepath = sub_mdpa_namepath.split(".").slice(0, -1).join(".");
    //             }
    //         }

    //         this.size = this.computeSize();
    //     }
    // }
}

ParsedModelPart.title = "Parse a materials files";
ParsedModelPart.desc = "Parses a file with descripcion of the materials (json format)";

LiteGraph.registerNodeType("IO/Parse Materials", ParsedModelPart);

console.log("ParsedMaterials node created"); //helps to debug
