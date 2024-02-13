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
        this.output = {
            "list_of_modelers": this.getInputData(0) || "[]",
            "list_of_operations": this.getInputData(1) || "[]"
        }
        
        this.setOutputData(0, this.output);
    }

    onSelection(e) {
    }
}

StagePreProcess.title = "Preprocess";
StagePreProcess.desc = "Creates a Pre Process section for a stage";

LiteGraph.registerNodeType("Stages/Preprocess", StagePreProcess);

console.log("Pre-Process node created"); //helps to debug
