class ProcessesList {
    constructor() {
        this.input_type = "process";
        this.output_type = "processes";
    }

    onAdded() {
        this.buildConnections();
    }

    buildConnections() {
        this.addInput("Process", this.input_type);
        this.addOutput("Processes", this.output_type);
        //this.addOutput("size", "number");
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
                this.inputs[i].name = "Process";
            }
        }

        // If all nodes are connected, or there are no nodes, add one.
        if (this.inputs.length <= 0 || this.isInputConnected(this.inputs.length - 1)) {
            //this.addInput("Process " + (this.getOutputData(1)), this.input_type, "");
            this.addInput("Process" , this.input_type);
            this.incSize(1, 1);
        }

        this.setSize(1, this.inputs.length);
        this.size = this.computeSize();
    }
}

ProcessesList.title = "Processes List";
ProcessesList.desc = "Merges several processes into a list";

LiteGraph.registerNodeType("PROJECT PARAMETERS/ProcessesList", ProcessesList);
