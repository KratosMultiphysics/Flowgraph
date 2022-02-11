class ModelNode {
    /**
     * 
     * @param {*} type 
     * @param {*} slot 
     * @param {*} connected 
     * @param {*} link_info 
     * @param {*} input_info 
     */
    onConnectionsChange(type, slot, connected, link_info, input_info) {
        if (type == LiteGraph.INPUT) {
            if(link_info) {
                this.onUpdateModel(link_info.id, connected);
            } else {
                console.log("Warning: Calling oConnectionsChange with no link info")
            }
        }
    }

    /**
     * 
     * @param {*} link_id 
     * @param {*} connected 
     */
    onUpdateModel(link_id, connected) {
        this.updateModelList(link_id, connected);

        // If there are nodes upstream, trigger the execution of onUpdateModel.
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
     * Get the list of model modelparts in the node
     */
    getModelList() {
        return this._model;
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

            // onCconnectionChange
            if(!node_type.prototype.onConnectionsChange) {
                node_type.prototype.onConnectionsChange = ModelNode.prototype.onConnectionsChange;
            } else {
                node_type.prototype._onConnectionsChange = node_type.prototype.onConnectionsChange;
                node_type.prototype._onConnectionsChangeModel = ModelNode.prototype.onConnectionsChange;
                node_type.prototype.onConnectionsChange = function() {
                    this._onConnectionsChangeModel.apply(this, arguments);
                    this._onConnectionsChange.apply(this, arguments);
                }
            }

            // onUpdateModel
            if(!node_type.prototype.onUpdateModel) {
                node_type.prototype.onUpdateModel = ModelNode.prototype.onUpdateModel;
            } else {
                node_type.prototype._onUpdateModel = node_type.prototype.onUpdateModel;
                node_type.prototype._onUpdateModelModel = ModelNode.prototype.onUpdateModel;
                node_type.prototype.onUpdateModel = function() {
                    this._onUpdateModelModel.apply(this, arguments);
                    this._onUpdateModel.apply(this, arguments);
                }
            }

            // getModelList
            if(!node_type.prototype.getModelList) {
                node_type.prototype.getModelList = ModelNode.prototype.getModelList;
            } else {
                console.log("Warning: ModelNode still does not suport extending getModelList");
            }

            // updateModelList
            if(!node_type.prototype.updateModelList) {
                node_type.prototype.updateModelList = ModelNode.prototype.updateModelList;
            } else {
                console.log("Warning: ModelNode still does not suport extending updateModelList");
            }
        }

        return node_type;
    }
}