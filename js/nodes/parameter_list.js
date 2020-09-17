class ParameterList {
    constructor() {
        this.addInput("In0", "number");
        this.addOutput("array", "array");
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
        for (const i = 0; i < this.inputs.length - 1; ++i) {
            this._value[i] = this.getInputData(i);
        }
        this.setOutputData(0, this._value);
    }

    onConnectionsChange() {
        // Remove unconnected nodes
        for (const i = 0; i < this.inputs.length; i++) {
            if (!this.isInputConnected(i) && this.getOutputData(1) > 0) {
                this.incSize(1, -1);
                this.removeInput(i);
            }
            if (i < this.inputs.length) {
                this.inputs[i].name = "In" + i;
            }
        }
        // If all nodes are connected, add another one.
        if (this.isInputConnected(this.inputs.length - 1)) {
            this.addInput("In" + (this.getOutputData(1) + 1), "number");
            this.incSize(1, 1);
        }
        this.size = this.computeSize();
    }
}

ParameterList.title = "ParameterList";
ParameterList.desc = "Merges several parameter into an array";

LiteGraph.registerNodeType("parameters/ParameterList", ParameterList);

console.log("ParsedModelPart node created"); //helps to debug