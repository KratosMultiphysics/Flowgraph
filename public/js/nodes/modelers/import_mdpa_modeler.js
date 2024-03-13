import { Modeler } from "/js/nodes/modelers/base/modeler.js";

class ImportMDPAModeler extends Modeler {
    constructor() {
        super()

        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        // Identifier Glyph
        this.glyph = {shape: '\uf6cf', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs
        this.input_filename = this.addWidget("string","MDPA filename", "", function(v){});
        this.model_part_name = this.addWidget("string","Model part name", "MainModelPart", function(v){});
        this.echo_level = this.addWidget("combo", "Echo level", 0, function(v) {}, {
            values: [0, 1, 2, 3]
        });

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute() {
        let output = {
            "name" : "KratosMultiphysics.modelers.import_mdpa_modeler.ImportMDPAModeler",
            "parameters": {
                "echo_level" : parseInt(this.echo_level.value),
                "input_filename" :  this.input_filename.value,
                "model_part_name" : this.model_part_name.value,
            }
        };

        this.setOutputData(0, [output]);
    }
}

ImportMDPAModeler.title = "Import MDPA modeler";
ImportMDPAModeler.desc  = "This modeler loads a MDPA file and makes its modelparts avaliable";

LiteGraph.registerNodeType("Modelers/Import MDPA", ModelManager.registerNodeType(ImportMDPAModeler));

console.log("ImportMDPAModeler node created"); //helps to debug
