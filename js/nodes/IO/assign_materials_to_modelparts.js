class AssignMaterialsToModelParts {

    constructor() {
        // Node settings
        this.glyph = {
            shape: '\uf6d1',
            font: '900 14px "Font Awesome 5 Free"',
            width: 16,
            height: 9
        };
        this.serialize_widgets = true;

        // List of submodelparts
        //this.properties = {
        //    "submodelpart_list": []
        //};

        // Dictionary for materials of submodelparts
        //this.mp_material = {};
        this.addOutput("Modelparts settings", 0);
        this.addOutput("Materials settings", 0);
        //this.ocount = 2;

        this.addInput("Model properties", "model_properties");
        this.addInput("Model properties1", "model_properties");
        this.addInput("Model properties2", "model_properties");
        //this.icount = 1;
    }

    onExecute() {
        //const out = {
        //    "mp_name": this.mpname.value,
        //    "mp_settings": {
        //        "input_type": "mdpa",
        //        "input_file": this.filename.split('.')[0]
        //    },
        //    "dim": this.dim
        //}
        //this.setOutputData(0, out);
        //for (let i = 1; i < this.outputs.length; ++i) {
        //    const out = {
        //        "mp_name": this.mpname.value,
        //        "smp_name": this.outputs[i].name
        //    }
        //    this.setOutputData(i, out);
        //}
    }

    onConnectInput() {

        // TODO: Logics to implement:
        //   when connecting to input 0,
        //       delete the other inputs
        //       generate one input for each submodelpart 
        //  when connecting to other inputs, dont change anything
        //  

        // Remove existing inputs but first
    if this.getInputDataType(0)
        for (let i = 0; i < this.inputs.length; ++i) {
            this.removeInput(1);
        }
        // Remove existing outputs but first two
        for (let i = 2; i < this.outputs.length; ++i) {
            this.removeOutput(i);
        }

        // Get data from MP slot (list)
        const data = this.getInputData(this.findInputSlot("Model properties"));
	    console.log(data);
        if (data != undefined) {
            for (const mp of data["submodelparts"]) {
                this.addInput("mat for " + mp, 0);
                this.addOutput(mp, 0);
            }
        }
    }
}

AssignMaterialsToModelParts.title = "Assign materials to modelparts";
AssignMaterialsToModelParts.desc = "Assign materials to modelparts";
LiteGraph.registerNodeType("IO/AssignMaterialsToModelParts", AssignMaterialsToModelParts);
