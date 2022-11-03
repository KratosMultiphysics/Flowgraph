class ParseMaterialsFile {
    constructor() {
        // Identifier Glyph
        this.glyph = {
            shape: '\uf6d1',
            font: '900 14px "Font Awesome 5 Free"',
            width: 16,
            height: 9
        };
        this.size = this.computeSize();
        this.serialize_widgets = true;

        this.input_manager = document.createElement('input');
        this.input_manager.type = 'file';
        this.input_manager.addEventListener('change', this.onSelection.bind(this));

        this.filename = this.addWidget("text", "Name", "", function(v) {}, {});
        this.addWidget("button", "Open...", "", function(value, widget, node) {
            node.input_manager.click();
        });

        //this.properties = {
        //    "materials_list": []
        //};

	    // Output counter
	    this.ocount = 0;
    }

    onExecute() {
        const settings = {
            "materials_filename": this.filename.value
        }
        //this.setOutputData(0, settings);
        this.setOutputData(0, this.properties);
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
            for (let i = 0; i < this.ocount; ++i) {
                this.removeOutput(i);
            }

            // Set the name of the materials filename
            this.filename.value = file.name;
            this.properties = [];
	    this.addOutput("MATERIALS", "materials_settings");
	    this.ocount++;
	    

            // Get materials and create outputs
            for (const prop of JSON.parse(result)["properties"]) {
                this.properties.push(prop);

                let name =
                    prop["model_part_name"].split(".")[0] +
                    " - " +
                    prop["model_part_name"].split(".")[1] +
                    " - id: " +
                    prop["properties_id"];
                this.addOutput(name, 0);
	    this.ocount++;
            }
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
