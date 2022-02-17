class ModelNode {
    /**
     * 
     * @param {*} type 
     * @param {*} slot 
     * @param {*} connected 
     * @param {*} link_info 
     * @param {*} input_info 
     */
    _beforeConnectionsChange(type, slot, connected, link_info, input_info) {
        if (type == LiteGraph.INPUT) {
            if(link_info) {
                this._beforeUpdateModel(link_info.id, connected);
            } else {
                console.log("Warning: Calling oConnectionsChange with no link info")
            }
        }
    }

    /**
     * 
     * @param {*} type 
     * @param {*} slot 
     * @param {*} connected 
     * @param {*} link_info 
     * @param {*} input_info 
     */
    _afterConnectionsChange(type, slot, connected, link_info, input_info) {
        if (type == LiteGraph.INPUT) {
            if(link_info) {
                if (this._onUpdateModel) {
                    this._onUpdateModel(link_info.id, connected);
                }
                this._afterUpdateModel(link_info.id, connected);
            } else {
                console.log("Warning: Calling oConnectionsChange with no link info")
            }
        }
    }

    /**
     * Get the model list from the nodes downstream.
     * @param {*} link_id 
     * @param {*} connected 
     */
    _beforeUpdateModel() {
        this._getDownstreamModelList();
    }

    /**
     * Propagate the changes to nodes upstream.
     * @param {*} link_id 
     * @param {*} connected 
     */
    _afterUpdateModel() {
        this._setUpstreamModelList();
        for (let link_id in this.outputs[this.MODEL_OUTPUT].links) {
            var link = this.outputs[this.MODEL_OUTPUT].links[link_id];
            if (link != null) {
                let upstream_node = this.graph.getNodeById(this.graph.links[link].target_id);
                if (upstream_node.onUpdateModel) {
                    upstream_node.onUpdateModel(link, true);
                }
            }
        }
    }

    /**
     * 
     * @param {*} link 
     * @param {*} connected 
     */
    _getDownstreamModelList() {
        this._in_model_operations = [];

        for(let input_id in this.inputs) {
            if (this.graph.links[this.inputs[input_id].link]) {
                if (this.graph.getNodeById(this.graph.links[this.inputs[input_id].link].origin_id).getModelOutputOperationsList) {
                    this._in_model_operations = this._in_model_operations.concat(this.graph.getNodeById(this.graph.links[this.inputs[input_id].link].origin_id).getModelOutputOperationsList());
                }
            }
        }

        this._model = [];
        
        // Build the corrent list of models avialiable in the node
        for (let op_id in this._in_model_operations) {
            switch(this._in_model_operations[op_id].code) {
                case "add":
                    this._model.push(this._in_model_operations[op_id].data);
                    break;
                case "rem":
                    let index = this._model.indexOf(this._in_model_operations[op_id].data);
                    if (index !== -1) {
                        this._model.splice(index, 1);
                    }
                    break;
                default:
                    break;
            } 
        }

        this._model = [...new Set(this._model)];
    }

    /**
     * Update the node's model with the values downstream.
     */
    _setUpstreamModelList() {
        this._out_model_operations = this.getModelInitialOutputOperationsList();

        // Add the operations calculated by the node.
        for (let op_id in this._model_operations) {
            this._out_model_operations.push(this._model_operations[op_id])
        }

        this._out_model_operations = [...new Set(this._out_model_operations)];
    }

    /**
     * Get the list of model modelparts in the node
     */
    getModelList() {
        return this._model;
    }

    /**
     * Get the list of model operations at the exit of the node
     */
    getModelInitialOutputOperationsList() {
        let initial_operations = [];

        // Unless overwritten, the model is the same as the input model
        // after executing the operations downstream.
        for (let md_id in this._model) {
            initial_operations.push({"code":"add", "data":this._model[md_id]});
        }

        return initial_operations;
    }

    /**
     * Get the list of model operations at the exit of the node
     */
    getModelOutputOperationsList() {
        return this._out_model_operations;
    }

    triggerUpstreamUpdate() {
        this._afterUpdateModel();
    }
}

class ModelManager {
    constructor() {}

    /**
     * Extends the given class to return a class that implements the callbacks
     * of the model manager.
     * @param {LGraphNodeProto} node_type Prototype of the node class
     */
    static registerNodeType(node_type) {

        // Extend class
        if (node_type.prototype) {

            ///////////////
            // Internal  //
            ///////////////

            // add types
            node_type.prototype._model = [];

            node_type.prototype._model_operations = [];
            node_type.prototype._in_model_operations = [];
            node_type.prototype._out_model_operations = [];

            // _onCconnectionChange
            node_type.prototype._onConnectionsChange = node_type.prototype.onConnectionsChange;
            node_type.prototype._beforeConnectionsChange = ModelNode.prototype._beforeConnectionsChange;
            node_type.prototype._afterConnectionsChangeModel = ModelNode.prototype._afterConnectionsChange;
            node_type.prototype.onConnectionsChange = function() {
                // First process the connection change, then apply the node code.
                this._beforeConnectionsChange.apply(this, arguments);
                if(node_type.prototype._onConnectionsChange) {
                    this._onConnectionsChange.apply(this, arguments);
                }
                this._afterConnectionsChangeModel.apply(this, arguments);
            }

            // _onUpdateModel
            node_type.prototype._onUpdateModel = node_type.prototype.onUpdateModel;
            node_type.prototype._beforeUpdateModel = ModelNode.prototype._beforeUpdateModel;
            node_type.prototype._afterUpdateModel = ModelNode.prototype._afterUpdateModel;
            node_type.prototype.onUpdateModel = function() {
                // First apply the node code, then propagate the update.
                this._beforeUpdateModel.apply(this, arguments);
                if (node_type.prototype._onUpdateModel) {
                    this._onUpdateModel.apply(this, arguments);
                }
                this._afterUpdateModel.apply(this, arguments);
            }

            // _getDownstreamModelList
            if(!node_type.prototype._getDownstreamModelList) {
                node_type.prototype._getDownstreamModelList = ModelNode.prototype._getDownstreamModelList;
            } else {
                console.log("Warning: ModelNode still does not suport extending _getDownstreamModelList");
            }

            // _setUpstreamModelList
            if(!node_type.prototype._setUpstreamModelList) {
                node_type.prototype._setUpstreamModelList = ModelNode.prototype._setUpstreamModelList;
            } else {
                console.log("Warning: ModelNode still does not suport extending _setUpstreamModelList");
            }

            ///////////////
            // Interface //
            ///////////////

            // getModelList
            if(!node_type.prototype.getModelList) {
                node_type.prototype.getModelList = ModelNode.prototype.getModelList;
            } else {
                console.log("Warning: ModelNode still does not suport extending getModelList");
            }

            // getModelOutputOperationsList
            if(!node_type.prototype.getModelOutputOperationsList) {
                node_type.prototype.getModelOutputOperationsList = ModelNode.prototype.getModelOutputOperationsList;
            } else {
                console.log("Warning: ModelNode still does not suport extending getModelOutputOperationsList");
            }

            // getModelInitialOutputOperationsList
            if(!node_type.prototype.getModelInitialOutputOperationsList) {
                node_type.prototype.getModelInitialOutputOperationsList = ModelNode.prototype.getModelInitialOutputOperationsList;
            }

            // triggerUpstreamUpdate
            if(!node_type.prototype.triggerUpstreamUpdate) {
                node_type.prototype.triggerUpstreamUpdate = ModelNode.prototype.triggerUpstreamUpdate;
            } else {
                console.log("Warning: ModelNode still does not suport extending triggerUpstreamUpdate");
            }
        }

        return node_type;
    }
}