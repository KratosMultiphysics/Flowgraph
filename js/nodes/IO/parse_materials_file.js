class ParseMaterialsFile {
    constructor() {
        // Identifier Glyph
        this.glyph = {
            shape: '\uf6d1',
            font: '900 14px "Font Awesome 5 Free"',
            width: 16,
            height: 9
        };

        this.input_manager = document.createElement('input');
        this.input_manager.type = 'file';
        this.input_manager.addEventListener('change', this.onSelection.bind(this));

        this.filename = this.addWidget("text", "Name", "", function(v) {}, {});
        this.addWidget("button", "Open...", "", function(value, widget, node) {
            node.input_manager.click();
        });

        this.properties = {
            "materials_list": []
        };

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute() {
        const settings = {
            "materials_filename": this.filename.value
        }
        this.setOutputData(0, settings);
        //for (let i = 1; i < this.outputs.length; ++i) {
        //    this.setOutputData(i, this.mp_name.value+this.outputs[i].name);
        //}
    }

    onSelection(e) {
        const [file] = event.target.files;
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = this.onReaderLoad(file);
        reader.readAsText(file);
    };

    onReaderLoad(file) {
        return ({
            target: {
                result
            }
        }) => {

            // Remove existing outputs
            this.properties["materials_list"] = [];
            while (this.outputs != undefined && this.outputs.length != 0) {
                this.removeOutput(0);
            }

            // Set the name of the materials filename
            this.filename.value = file.name;
	
            // Parse and get materials
            //const mdpa_subs_re = /.*((Begin SubModelPart) ([a-zA-Z0-9_]+))|(End SubModelPart$)/gm;
            //const sub_mdpa = result.matchAll(mdpa_subs_re);
            //for (const match of sub_mdpa) {
            //    if (match[0].includes("Begin")) {
            //        sub_mdpa_namepath = `${sub_mdpa_namepath}.${match[3]}`;
            //        this.properties["materials_list"].push(sub_mdpa_namepath);
            //    }

            //    if (match[0].includes("End")) {
            //        sub_mdpa_namepath = sub_mdpa_namepath.split(".");
            //        sub_mdpa_namepath.pop();
            //        sub_mdpa_namepath = sub_mdpa_namepath.join(".");
            //    }
            //}

            // Create outputs
            this.addOutput("MATERIALS", "materials_settings")
            //for (const submodelpart of this.properties["materials_list"]) {
            //    this.addOutput(submodelpart, "string");
            //}

            // TODO: left for later
            //this.updateProblemModelParts();
            //this.updateModelNodes();
        }
    }

    //updateProblemModelParts() {
    //    // Need to restore the list of submodelparts in the main model node.
    //    problem_modelparts[this.id] = []

    //    for (const submodelpart of this.properties["materials_list"]) {
    //        problem_modelparts[this.id].push(submodelpart);
    //    }
    //}

    //updateModelNodes() {
    //    // Update the combos of all the Models nodes in the workspace
    //    for (const modelNode of Object.keys(model_nodes)) {
    //        model_nodes[modelNode].updateCombos();
    //    }
    //}

    //onAdded() {
    //    this.updateProblemModelParts();
    //    this.updateModelNodes();
    //}

    //onRemoved() {
    //    // Unregister
    //    delete problem_modelparts[this.id];
    //    this.updateModelNodes();
    //}

}

ParseMaterialsFile.title = "Parse MATERIALS file";
ParseMaterialsFile.desc = "Parses a .json file with the descripcion of the materials.";
LiteGraph.registerNodeType("IO/Parse Materials", ParseMaterialsFile);
