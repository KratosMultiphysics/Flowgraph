class Modeler {
    constructor() {
        this.addInput("Input", "stage_data_model");
        
        this.addOutput("Modeler", "modeler")
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

Modeler.title = "\uf6cf Modeler";
Modeler.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("Stages/Modeler", Modeler);

console.log("Modeler node created"); //helps to debug