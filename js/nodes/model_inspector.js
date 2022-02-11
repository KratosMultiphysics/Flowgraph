class ModelInspector {
    constructor() {
        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        this._model = [];
        this._model_operations = [];

        // List of inputs and outputs ("name", "type")
        this.addInput("Model", 0);

        this.addOutput("value", 0);

        this.widgets_up = true;

        this._output_slector_map = [];
        this._output_slector_map.push(this.addWidget("combo","ModelPart", "", (v) => v, { 
            values:[]
        }));

        this.output_type = "";
    }

    /** Model */
    /**
     * Executed on connection change.
     * This function can get extended my ModelNode.
     * @param {*} type 
     * @param {*} slot 
     * @param {*} connected 
     * @param {*} link_info 
     * @param {*} input_info 
     */
    onConnectionsChange(type, slot, connected, link_info, input_info) {
        this.updateNodeOutputSlots(type)
    }

    /**
     * Updates the value of the node's model.
     * This function can get extended my ModelNode.
     */
    onUpdateModel(link_id, connected) {
        this.updateModelOuputs();
    }

    /** Internal */
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

    /**
     * Updates the list outputs on the node
     * @param {connection type} type 
     */
    updateNodeOutputSlots(type) {
        if (type == LiteGraph.OUTPUT) {
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
}

ModelInspector.title = "Model Inspector";
ModelInspector.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("model_part/Model Inspector", ModelManager.registerNodeType(ModelInspector));

console.log("ModelInspector node created"); //helps to debug