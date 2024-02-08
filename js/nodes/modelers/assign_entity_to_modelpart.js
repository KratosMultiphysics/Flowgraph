class AssignEntityToModelPart {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf1b3', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Set inputs
        this.addInput("Model part", "string");
        this.addInput("Entity", "");

        // Set outputs
        this.addOutput("Pair", "");

        // Set widgets
        this.combo = this.addWidget("combo","Combo", "element", function(v){}, { values:["element","condition"]} );
    }

    onExecute() {
        this._pair = {"model_part_name": this.getInputData(0)};
        this._pair[this.combo.value + "_name"] = this.getInputData(1);

        this.setOutputData(0, this._pair);
    }
}

AssignEntityToModelPart.title = "Assign entity to model part";
AssignEntityToModelPart.desc = "Assigns an entity (element or condition) to the compatible given model part geometries";

LiteGraph.registerNodeType("Modelers/AssignEntityToModelPart", AssignEntityToModelPart);
