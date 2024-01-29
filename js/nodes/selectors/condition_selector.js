class ConditionSelector {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf1b3', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Set outputs
        this.addOutput("Condition", "condition_type");

        // Set widgets
        this.application_selector = this.addWidget("combo", "Application", Object.keys(list_of_conditions)[0], () => {},
            { values: Object.keys(list_of_conditions) }
        );

        this.condition_selector = this.addWidget("combo", "Condition Name", list_of_conditions[this.application_selector.value][0], () => {}, {
            values: () => { return list_of_conditions[this.application_selector.value] || ['Invalid Application'] }
        });
    }

    onExecute() {
        this.setOutputData(0, this.condition_selector.value);
    }
}

ConditionSelector.title = "Condition Selector";
ConditionSelector.desc = "Select a condition from the available options";

LiteGraph.registerNodeType("Elem & Cond/Conditions", ConditionSelector);

// Set the colors of selected connection to better reflect the flow
const condition_color = "#924ccf";

LGraphCanvas.link_type_colors["condition_type"] = condition_color;
LGraphCanvas.slot_type_colors["condition_type"] = condition_color;
