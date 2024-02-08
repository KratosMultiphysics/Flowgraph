class DeleteModeler {
    constructor() {
        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        // List of inputs and outputs ("name", "type")
        this.addOutput("", 0);

        this.widgets_up = true;

        this._output_slector_map = [];

        this.output_type = "";
    }

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
        if (type == LiteGraph.INPUT) { 
            this.updateWidgetList();
        }
    }

    /**
     * Updates the value of the node's model.
     * This function can get extended my ModelNode.
     */
    onUpdateModel(link_id, connected) {
        this.updateWidgetList();
        this.updateModelOuputs();
    }

    onUpdateDropdown() {
        this.updateModelOuputs();
        this.triggerUpstreamUpdate();
    }

    /** Internal */
    /** 
     * Populates the node widgets with the name of the modelparts available
     * in the input's model, if exists. 
     */
    updateModelOuputs() {
        this._model_operations = [];
        for (let index in this._output_slector_map) {
            let widget = this._output_slector_map[index];
            if (widget.value == "Delete") {
                this._model_operations.push({code:"rem", data:widget.name});
            }
        }
    }

    /**
     * Updates the list outputs on the node
     */
    updateWidgetList() {
        let model_list = this.getModelList();

        // Remove unconnected nodes
        if (this.widgets) {
            while ( this.widgets.length ) {
                this.removeWidget(0);
            }
        }

        // Delete the internal reference that we have in the node.
        this._output_slector_map = [];

        for (let index in model_list) {
            this._output_slector_map.push(this.addWidget("combo", model_list[index], "Keep", (v) => {console.log("hola?"); this.onUpdateDropdown();}, { 
                values:["Keep", "Delete"]
            }));
        }

        this.size = this.computeSize();
    }
}

DeleteModeler.title = "Delete Modeler";
DeleteModeler.desc = "Delete modelparts/submodelparts from the current Model";

LiteGraph.registerNodeType("Stages/Modeleres/Delete Modeler", ModelManager.registerNodeType(DeleteModeler));

console.log("DeleteModeler node created"); //helps to debug
