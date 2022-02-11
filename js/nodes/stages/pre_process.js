class StagePreProcess {
    constructor() {
        // Model
        this.MODEL_INPUT  = 1;
        this.MODEL_OUTPUT = 0;
        
        // Identifier Glyph
        this.glyph = {shape: '\uf359', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Stage", "stage_flow");
        this.addInput("Modelers", "stage_modeler");
        this.addInput("Operations", "operations_array");
        
        this.addOutput("Output", "stage_flow");
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

StagePreProcess.title = "Pre Process";
StagePreProcess.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("Stages/PreProcess", ModelManager.registerNodeType(StagePreProcess));

console.log("Modeler node created"); //helps to debug