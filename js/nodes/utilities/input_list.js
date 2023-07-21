class InputList {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf0cb', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};
        
        this.input_type = 0;
        this.output_type = "array";
    }

    onAdded() {
        this.buildConnections();
    }

    buildConnections() {
        this.addInput("In0", this.input_type, "");
        this.addOutput("array", this.output_type);
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
        if (!this._value) {
            this._value = new Array();
        }
        this._value.length = this.inputs.length - 1;
        for (let i = 0; i < this.inputs.length - 1; ++i) {
            this._value[i] = this.getInputData(i);
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
            this.addInput("In" + (this.getOutputData(1)), this.input_type, "");
            this.incSize(1, 1);
        }

        this.setSize(1, this.inputs.length);
        this.size = this.computeSize();
    }
}

InputList.title = "List";
InputList.desc = "Merges several elements into an array";

LiteGraph.registerNodeType("PROJECT PARAMETERS/List", InputList);

console.log("InputList node created"); //helps to debug

// export default InputList;
