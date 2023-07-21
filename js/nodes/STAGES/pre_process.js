class StagePreProcess {
    constructor() {
        // Model
        this.MODEL_INPUT  = 1;
        this.MODEL_OUTPUT = 0;
        
        // Identifier Glyph
        this.glyph = {shape: '\uf56f', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Modelers", "stage_modeler");
        this.addInput("Operations", "operations_array");
        
        this.addOutput("Output", "stage_pre");
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

StagePreProcess.title = "Preprocess";
StagePreProcess.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("STAGES/Preprocess", StagePreProcess);

console.log("Modeler node created"); //helps to debug
