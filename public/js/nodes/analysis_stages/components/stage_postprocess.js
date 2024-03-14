class StagePostprocess {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf56e', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Operations", "operations_array");

        this.addOutput("Output", "stage_post");
    }

    onExecute() {
        this.output = {
            "operations": this.getInputData(0) || []
        }

        this.setOutputData(0, this.output);
    }
}

StagePostprocess.title = "Postprocess";
StagePostprocess.desc = "Creates a Post Process section for a stage";

LiteGraph.registerNodeType("Analysis stages/Components/PostProcess", StagePostprocess);

console.log("Post-Process node created"); //helps to debug
