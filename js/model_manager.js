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
                // console.log("Warning: Calling oConnectionsChange with no link info")
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
                // console.log("Warning: Calling oConnectionsChange with no link info")
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
    _getDownstreamModelList(link=undefined, connected=true){
        // If there is no link passed, try to ask the node
        if (link == undefined) {
            if (this.inputs != undefined && this.MODEL_INPUT != undefined) {
                this.inputs[this.MODEL_INPUT].link;
            }
        }
        if (link && connected) {
            this._in_model = [...this.graph.getNodeById(this.graph.links[this.inputs[this.MODEL_INPUT].link].origin_id).getModelList()];
        } else {
            this._in_model = [];
        }

        this._out_model = [...this._in_model];
    }

    /**
     * Update the node's model with the values downstream.
     */
    _setUpstreamModelList() {
        this._out_model = [...this._in_model];
        for (let op_id in this._model_operations) {
            switch(this._model_operations[op_id].code) {
                case "add":
                    this._out_model.push(this._model_operations[op_id].data);
                    break;
                case "rem":
                    let index = this._out_model.indexOf(this._model_operations[op_id].data);
                    if (index !== -1) {
                        this._out_model.splice(index, 1);
                    }
                    break;
                default:
                    break;
              } 
        }

        this._out_model = [...new Set(this._out_model)];
    }

    /**
     * Get the list of model modelparts in the node
     */
    getModelList() {
        return this._out_model;
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
            node_type.prototype._in_model = [];
            node_type.prototype._out_model = [];
            node_type.prototype._model_operations = [];

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