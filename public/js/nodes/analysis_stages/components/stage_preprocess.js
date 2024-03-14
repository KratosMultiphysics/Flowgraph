class StagePreprocess {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf56f', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Modelers", "modeler_list");
        this.addInput("Operations", "operations_array");

        this.addOutput("Output", "stage_pre");
    }

    onExecute() {
        this.output = {
            "modelers": this.getInputData(0) || [],
            "operations": this.getInputData(1) || []
        }

        this.setOutputData(0, this.output);
    }
}

StagePreprocess.title = "Preprocess";
StagePreprocess.desc = "Creates a preprocess section for a stage";

LiteGraph.registerNodeType("Analysis stages/Components/Preprocess", StagePreprocess);

console.log("Pre-Process node created"); //helps to debug
