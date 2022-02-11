class ModelInspector {
    constructor() {
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        this.addInput("Model", 0);

        this.addOutput("value", 0);

        this.widgets_up = true;

        this._output_slector_map = [];
        this._output_slector_map.push(this.addWidget("combo","ModelPart", "", (v) => v, { 
            values:[]
        }));

        this._model = [];

        this.output_type = "";
    }

    onConnectionsChange(type, slot, connected, link_info, input_info) {
        if (type == LiteGraph.INPUT) {
            this.onUpdateModel(link_info.id, connected);
        } else {
            // Remove unconnected nodes
            for (let i = 0; i < this.outputs.length; i++) {
                if (!this.isOutputConnected(i)) {
                    this.removeOutput(i);
                    this.removeWidget(i);

                    // Delete the internal reference that we have in the node.
                    this._output_slector_map.splice(i, 1);
                }
            }

            // If all nodes are connected, or there are no nodes, add one.
            if (this.outputs.length <= 0 || this.isOutputConnected(this.outputs.length - 1)) {
                this.addOutput("value", 0);
                this._output_slector_map.push(this.addWidget("combo","ModelPart", "DEBUG", null, { 
                    values:this._model
                }));
            }

            this.setSize(1, this.outputs.length);
            this.size = this.computeSize();
        }
    }

    /**
     * Updates the value of the node's model.
     */
    onUpdateModel(link_id, connected) {
        this.updateModelList(link_id, connected);
        this.updateModelOuputs();

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
     * Update the node's model with the values downstream.
     */
    updateModelList(link=this.inputs[this.MODEL_INPUT].link, connected) {
        if (link && connected) {
            this._model = [...this.graph.getNodeById(this.graph.links[this.inputs[this.MODEL_INPUT].link].origin_id).getModelList()];
        } else {
            this._model = [];
        }

        for (let op_id in this._model_operations) {
            switch(this._model_operations[op_id].code) {
                case "add":
                    this._model.push(this._model_operations[op_id].data);
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

    /**
     * Get the list of model modelparts in the node
     */
    getModelList() {
        return this._model;
    }

    /** 
     * Populates the node widgets with the name of the modelparts available
     * in the input's model, if exists. 
     */
    updateModelOuputs() {
        for (let widget in this._output_slector_map) {
            this._output_slector_map[widget].options.values = [];
            if(this._model) {
                this._output_slector_map[widget].options.values = this._model;
                this._output_slector_map[widget].value = this._model[0];
            }
        }
    }
}

ModelInspector.title = "Model Inspector";
ModelInspector.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("model_part/Model Inspector", ModelInspector);

console.log("ModelInspector node created"); //helps to debug