class InputMap {
    constructor() {
        this.addInput("In0", "");
        this.addOutput("map", "");
        this.addOutput("size", "number");
        this.size = this.computeSize();
        this.serialize_widgets = true;
        this.setOutputSize(1, 0);
    }

    setOutputSize(slot, amount) {
        this.setOutputData(slot, amount);
    }

    incOutputSize(slot, amount) {
        this.setOutputData(slot, this.getOutputData(slot) + amount);
    }

    onExecute() {
        this._value = {};

        for (let i = 0; i < this.inputs.length - 1; ++i) {
            Object.entries(this.getInputData(i)).forEach(([k,v],_) => {this._value[k] = v});
        }
        
        this.setOutputData(0, this._value);
        this.setOutputData(1, this.inputs.length - 1);
    }

    onConnectionsChange() {
        // Set the size in case is missing (copying the node from the graph?)
        this.setOutputSize(1, this.inputs.length);

        // Remove unconnected nodes
        for (let i = 0; i < this.inputs.length; i++) {
            if (!this.isInputConnected(i) && this.getOutputData(1) > 0) {
                this.incOutputSize(1, -1);
                this.removeInput(i);
            }
            if (i < this.inputs.length) {
                this.inputs[i].name = "In" + (i);
            }
        }

        // If all nodes are connected, or there are no nodes, add one.
        if (this.inputs.length <= 0 || this.isInputConnected(this.inputs.length - 1)) {
            this.addInput("In" + (this.getOutputData(1)), "", "");
            this.incOutputSize(1, 1);
        }

        this.setOutputSize(1, this.inputs.length);
        this.size = this.computeSize();
    }
}

InputMap.title = "Map";
InputMap.desc = "Merges several parameter into a map";

LiteGraph.registerNodeType("Lists/Map", InputMap);

console.log("InputMap node created"); //helps to debug
