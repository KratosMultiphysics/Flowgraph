class StagePostProcess {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf35a', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Modelers", "modelers_array");
        this.addInput("Operations", "operations_array");

        this.addOutput("Post Process", "stage_post");
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

StagePostProcess.title = "Post Process";
StagePostProcess.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("Stages/PostProcess", StagePostProcess);

console.log("Modeler node created"); //helps to debug