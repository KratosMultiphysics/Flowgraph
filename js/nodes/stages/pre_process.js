class StagePreProcess {
    constructor() {
        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        this._model = [];
        this._model_operations = [];
        
        // Identifier Glyph
        this.glyph = {shape: '\uf359', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Stage", "stage_flow");
        this.addInput("Modelers", "modelers_array");
        this.addInput("Operations", "operations_array");
        
        this.addOutput("Output", "stage_data_model");
    }

    onExecute() {
    }

    onSelection(e) {
    }

    /**
    * Updates the value of the node's model.
    */
    onUpdateModel() {
        this.updateModelList();

        // If there are nodes upstream, trigger the execution of onUpdateModel.
        for (let link_id in this.outputs[this.MODEL_OUTPUT].links) {
            var link = this.outputs[this.MODEL_OUTPUT].links[link_id];
            if (link != null) {
                let upstream_node = this.graph.getNodeById(this.graph.links[link].target_id);
                if (upstream_node.onUpdateModel) {
                    upstream_node.onUpdateModel();
                }
            }
        }
    }

    /**
     * Get the list of model modelparts in the node
     */
    getModelList() {
        return this._model;
    }

    /**
     * Update the node's model with the values downstream.
     */
    updateModelList() {
        if (this.inputs[this.MODEL_INPUT].link) {
            this._model = this.graph.getNodeById(this.graph.links[this.inputs[this.MODEL_INPUT].link].origin_id).getModelList();
        } else {
            this._model = [];
        }

        for (let op_id in this._model_operations) {
            switch(this._model_operations[op_id].code) {
                case "add":
                    this._model.push(this._model[op_id].data);
                    break;
                case "rem":
                    // To be implemented
                    break;
                default:
                    // Do nothing
                    break;
              } 
        }
        
        this._model = [...new Set(this._model)];
    }
}

StagePreProcess.title = "Pre Process";
StagePreProcess.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("Stages/PreProcess", StagePreProcess);

console.log("Modeler node created"); //helps to debug