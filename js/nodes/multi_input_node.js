function MultiInput() {
    this.addInput("In0","number");

    this.addOutput("List","array");
    
    this.size = this.computeSize();
    this.serialize_widgets = true;

    this.num_inputs = 1;
}

MultiInput.title = "MultiInput";
MultiInput.desc = "Merges several inputs into an array";

MultiInput.prototype.onExecute = function() {
    if(!this._value) {
        this._value = new Array();
    }
        
	this._value.length = this.inputs.length-1;
    
    for(var i = 0; i < this.inputs.length-1; ++i) {
        this._value[i] = this.getInputData(i);
    }

    this.setOutputData(0,  this._value);
};

MultiInput.prototype.onConnectionsChange = function() {
    // Remove unconnected nodes
    for(var i = 1; i < this.inputs.length; i++) {
        console.log("input", i, "is connected:", this.isInputConnected(i))
        if(!this.isInputConnected(i)) {
            this.num_inputs--;
            this.removeInput(i);
        }
        
        if(i < this.inputs.length) {
            this.inputs[i].name = "In"+i;
        }
    }

    // If all nodes are connected, add another one.
    if(this.isInputConnected(this.inputs.length-1)) {
        this.addInput("In"+this.num_inputs, "number");
        this.num_inputs++;
    }
}

LiteGraph.registerNodeType("model_part/InputList", MultiInput);

console.log("ParsedModelPart node created"); //helps to debug