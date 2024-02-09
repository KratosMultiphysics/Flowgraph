class AssignEntityToModelPart {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf248', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Set inputs
        this.addInput("Model part", "string");

        // Set outputs
        this.addOutput("Pair", "");

        // Set widgets
        this.entity_type_selector = this.addWidget("combo","Combo", "element", function(v){}, { values:["element","condition"]} );

        this.list_of_entities = {
            "element" : list_of_elements,
            "condition" : list_of_conditions
        };

        this.application_selector = this.addWidget("combo", "Application", Object.keys(this.list_of_entities[this.entity_type_selector.value])[0], () => { }, { 
            values: () => { return Object.keys(this.list_of_entities[this.entity_type_selector.value]) || ['Invalid Entity']; }
        });

        this.entities_selector = this.addWidget("combo", this.entity_type_selector.value + " Name", this.list_of_entities[this.entity_type_selector.value][this.application_selector.value][0], () => { }, {
            values: () => { return this.list_of_entities[this.entity_type_selector.value][this.application_selector.value] || ['Invalid Application']; }
        });

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute() {
        this._pair = {"model_part_name": this.getInputData(0)};
        this._pair[this.entity_type_selector.value + "_name"] = this.getInputData(1);

        this.setOutputData(0, this._pair);
    }
}

AssignEntityToModelPart.title = "Assign Entity to ModelPart";
AssignEntityToModelPart.desc = "Assigns an entity (element or condition) to the compatible given modelpart geometries";

LiteGraph.registerNodeType("Modelers/AssignEntityToModelPart", AssignEntityToModelPart);
