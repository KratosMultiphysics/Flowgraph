class Stage {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf121', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Pre", "stage_pre_process");      // 0
        this.addInput("Solver", "map");                         // 1 To be changed to solver_settings
        this.addInput("Post", "stage_post_process");    // 2

        this.addOutput("Stage Output", "stage_data_model")
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

Stage.title = "Stage";
Stage.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("Stages/Stage", Stage);

console.log("Stage node created"); //helps to debug