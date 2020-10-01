class InputMap {
    constructor() {
        this.addInput("In0", "key-value", "");
        this.addOutput("map", "map");
        this.addOutput("size", "number");
        this.size = this.computeSize();
        this.serialize_widgets = true;
        this.setSize(1, 0);
    }

    setSize(slot, amount) {
        this.setOutputData(slot, amount);
    }

    incSize(slot, amount) {
        this.setOutputData(slot, this.getOutputData(slot) + amount);
    }

    onExecute() {
        this._value = new Map();
        
        this._value.length = this.inputs.length - 1;
        for (let i = 0; i < this.inputs.length - 1; ++i) {
            this._value[this.getInputData(i)['key']] = this.getInputData(i)['value'];
        }
        
        this.setOutputData(0, this._value);
    }

    onConnectionsChange() {
        // Set the size in case is missing (copying the node from the graph?)
        this.setSize(1, this.inputs.length);

        // Remove unconnected nodes
        for (let i = 0; i < this.inputs.length; i++) {
            if (!this.isInputConnected(i) && this.getOutputData(1) > 0) {
                this.incSize(1, -1);
                this.removeInput(i);
            }
            if (i < this.inputs.length) {
                this.inputs[i].name = "In" + (i);
            }
        }

        // If all nodes are connected, or there are no nodes, add one.
        if (this.inputs.length <= 0 || this.isInputConnected(this.inputs.length - 1)) {
            this.addInput("In" + (this.getOutputData(1)), "key-value", "");
            this.incSize(1, 1);
        }

        this.setSize(1, this.inputs.length);
        this.size = this.computeSize();
    }
}

InputMap.title = "Map";
InputMap.desc = "Merges several parameter into a map";

LiteGraph.registerNodeType("parameters/Map", InputMap);

console.log("InputMap node created"); //helps to debug