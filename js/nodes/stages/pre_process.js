class StagePreProcess {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf359', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Modelers", "modelers_array");
        this.addInput("Operations", "operations_array");
        
        this.addOutput("Pre Process", "stage_pre");
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

StagePreProcess.title = "Pre Process";
StagePreProcess.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("Stages/PreProcess", StagePreProcess);

console.log("Modeler node created"); //helps to debug