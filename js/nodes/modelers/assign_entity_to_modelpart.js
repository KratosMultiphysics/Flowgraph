class AssignEntityToModelPart {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf1b3', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Set inputs
        this.addInput("Model part", "string");

        // Set outputs
        this.addOutput("Pair", "");

        // Set widgets
        this.entity_combo = this.addWidget("combo","Combo", "element", function(v){}, { values:["element","condition"]} );

        var list_of_entities;
        if (this.entity_combo.value == "element") {
            list_of_entities = list_of_elements;
        } else if ((this.entity_combo.value == "condition")) {
            list_of_entities = list_of_conditions;
        }
        this.application_selector = this.addWidget("combo", "Application", Object.keys(list_of_entities)[0], () => { },
            { values: Object.keys(list_of_elements) }
        );

        this.element_selector = this.addWidget("combo", this.entity_combo.value + " Name", list_of_entities[this.application_selector.value][0], () => { }, {
            values: () => { return list_of_elements[this.application_selector.value] || ['Invalid Application'] }
        });
    }

    onExecute() {
        this._pair = {"model_part_name": this.getInputData(0)};
        this._pair[this.entity_combo.value + "_name"] = this.getInputData(1);

        this.setOutputData(0, this._pair);
    }
}

AssignEntityToModelPart.title = "Assign entity to model part";
AssignEntityToModelPart.desc = "Assigns an entity (element or condition) to the compatible given model part geometries";

LiteGraph.registerNodeType("Modelers/AssignEntityToModelPart", AssignEntityToModelPart);
