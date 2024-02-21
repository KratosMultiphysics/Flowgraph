class InputList {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf0cb', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};
        
        // This is a dirty bit to prevent onConnectionChange from triggering while making a copy/paste of the node (as the connection will change during the paste and break the list of inputs)
        this.isAdded = false;
        this.size = this.computeSize();
        this.setIOType();
        this.buildConnections();
    }

    onAdded() {
        this.isAdded = true;
        this.onConnectionsChange();
    }

    setIOType() {
        // Default types are generic arrays, derived lists can specialize this.
        this.input_type = "";
        this.output_type = "";
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
        this._value = [];
        for (let i = 0; i < this.inputs.length - 1; i++) {
            let in_i = this.getInputData(i);

            // Non Array objects are added to the results directly
            // Array objects forward all its contents to the output (merges arrays)
            if (!Array.isArray(in_i)) {
                this._value.push(in_i);
            } else {
                for(let j = 0; j < in_i.length; j++) {
                    this._value.push(in_i[j]);
                }
            }
        }
        
        this.setOutputData(0, this._value);
        this.setOutputData(1, this._value.length);
    }

    onConnectionsChange() {
        if(this.isAdded) {
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
}

InputList.title = "List";
InputList.desc = "Merges several elements into an array";

LiteGraph.registerNodeType("PROJECT PARAMETERS/List", InputList);

console.log("InputList node created"); //helps to debug

// export default InputList;
