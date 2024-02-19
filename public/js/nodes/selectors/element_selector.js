class ElementSelector {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf1b2', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Set outputs
        this.addOutput("Element", "element_type");

        // Set widgets
        this.application_selector = this.addWidget("combo", "Application", Object.keys(list_of_elements)[0], () => {},
            { values: Object.keys(list_of_elements) }
        );

        this.element_selector = this.addWidget("combo", "Element Name", list_of_elements[this.application_selector.value][0], () => {}, {
            values: () => { return list_of_elements[this.application_selector.value] || ['Invalid Application'] }
        });
    }

    onExecute() {
        this.setOutputData(0, this.element_selector.value);
    }
}

ElementSelector.title = "Element Selector";
ElementSelector.desc = "Select an element from the available options";

LiteGraph.registerNodeType("Elem & Cond/Elements", ElementSelector);

// Set the colors of selected connection to better reflect the flow
const element_color = "#924ccf";

LGraphCanvas.link_type_colors["element_type"] = element_color;
LGraphCanvas.slot_type_colors["element_type"] = element_color;