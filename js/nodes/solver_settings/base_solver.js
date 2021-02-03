class BaseSolver {
    constructor() {}

    /**
     * Enables or disables widgets based on the information of upstream nodes (for example disable domain_size when composing solvers)
     * @param {*} o_property    property to be overriden
     * @param {*} from_output   output id of the node that hold the override info.
     */
    handleUpStreamOverride(o_property, from_output) {
        if(this.hasOwnProperty(o_property)) this[o_property].disabled = false;

        if(this.isOutputConnected(from_output)) {
            let upstream_nodes = this.getOutputNodes(from_output);
            for (let i = 0; i < upstream_nodes.length; i++) {
                if (upstream_nodes[i].hasOwnProperty('override_properties') && upstream_nodes[i].override_properties.includes(o_property)) {
                    if(this.hasOwnProperty(o_property)) this[o_property].disabled |= true;
                } else {
                    if(this.hasOwnProperty(o_property)) this[o_property].disabled |= false;
                }
            }   
        }
    }
}