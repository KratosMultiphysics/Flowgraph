class AssignEntityToModelPart {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf1b3', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Set inputs
        this.addInput("name", "");
        this.addInput("element", "");

        // Set outputs
        this.addOutput("pair", "");

        // Set widgets
        this.combo = this.addWidget("combo","Combo", "element", function(v){}, { values:["element","condition", "constraint"]} );
    }

    onExecute() {
        this._pair = {"model_part_name": this.getInputData(0)};
        this._pair[this.combo.value + "_name"] = this.getInputData(1);

        this.setOutputData(0, this._pair);
    }
}

AssignEntityToModelPart.title = "Assign Entity To ModelPart";
AssignEntityToModelPart.desc = "Assigns a value to a key";

LiteGraph.registerNodeType("ModelParts/AssignEntityToModelPart", AssignEntityToModelPart);
