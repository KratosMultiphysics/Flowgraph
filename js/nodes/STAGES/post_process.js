class StagePostProcess {
    constructor() {
        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        // Identifier Glyph
        this.glyph = {shape: '\uf35a', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Stage", "stage_flow");
        this.addInput("Modelers", "modelers_array");
        this.addInput("Operations", "operations_array");

        this.addOutput("Output", "stage_flow");
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

StagePostProcess.title = "Postprocess";
StagePostProcess.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("STAGES/PostProcess", ModelManager.registerNodeType(StagePostProcess));

console.log("Modeler node created"); //helps to debug
