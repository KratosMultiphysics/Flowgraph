class ImportMDPAModeler {
    constructor() {
        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        // Identifier Glyph
        this.glyph = {shape: '\uf6cf', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("File Name", "string");
        this.addInput("ModelPart Name", "string");
        this.addOutput("Modeler", "stage_modeler");

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute() {
        this._value = {
            "model": {
                "echo_level" : 0,
                "input_filename" :  this.getInputData(0),
                "model_part_name" : this.getInputData(1),
            }
        };

        this.setOutputData(0, this._value);
    }
}

ImportMDPAModeler.title = "Import MDPA modeler";
ImportMDPAModeler.desc  = "This modeler loads a MDPA file and makes its modelparts avaliable";

LiteGraph.registerNodeType("Modelers/Import MDPA", ModelManager.registerNodeType(ImportMDPAModeler));

console.log("ImportMDPAModeler node created"); //helps to debug
