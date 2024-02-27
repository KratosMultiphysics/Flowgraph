class Modeler {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf6cf', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addOutput("Modeler", "modeler_list")
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

Modeler.title = "Modeler";
Modeler.desc = "Base Modeler";

LiteGraph.registerNodeType("Modelers/Base/Modeler", Modeler);

console.log("Modeler node created"); //helps to debug
