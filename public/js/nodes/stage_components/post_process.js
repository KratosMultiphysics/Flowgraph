class StagePostProcess {
    constructor() {
        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        // Identifier Glyph
        this.glyph = {shape: '\uf56e', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Operations", "operations_array");

        this.addOutput("Output", "stage_post");
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

StagePostProcess.title = "Postprocess";
StagePostProcess.desc = "Creates a Post Process section for a stage";

LiteGraph.registerNodeType("Stage components/PostProcess", StagePostProcess);

console.log("Post-Process node created"); //helps to debug
