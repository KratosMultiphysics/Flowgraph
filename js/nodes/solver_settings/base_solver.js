class BaseSolver {
    constructor() {}

    /**
     * Enables or disables widgets based on the information of upstream nodes (for example disable domain_size when composing solvers)
     * @param {*} key           property to be overriden
     * @param {*} from_output   output id of the node that hold the override info.
     */
    handleUpStreamOverride(key, from_output) {
        if(this.hasOwnProperty(key)) this[key].disabled = false;

        if(this.isOutputConnected(from_output)) {
            let upstream_nodes = this.getOutputNodes(from_output);
            for (let i = 0; i < upstream_nodes.length; i++) {
                if (upstream_nodes[i].hasOwnProperty('override_properties') && upstream_nodes[i].override_properties.includes(key)) {
                    if(this.hasOwnProperty(key)) this[key].disabled |= true;
                } else {
                    if(this.hasOwnProperty(key)) this[key].disabled |= false;
                }
            }   
        }
    }

    assignIfNeeded(properties, key, value) {
        if(this.hasOwnProperty(key) && this[key].disabled) {
            delete properties[key];
        } else {
            properties[key] = value;
        }
    }
}