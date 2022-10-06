class Modeler {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf6cf', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Input", "stage_modeler");
        
        this.addOutput("Modeler", "stage_modeler")
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

Modeler.title = "Modeler";
Modeler.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("STAGES/MODELERS/Modeler", Modeler);

console.log("Modeler node created"); //helps to debug
