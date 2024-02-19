class Process {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf12b', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};
    }
}

// Set the colors of selected connection to better reflect the flow
LGraphCanvas.link_type_colors["process"] = "#de6d47";
LGraphCanvas.slot_type_colors["process"] = "#de6d47";
LGraphCanvas.link_type_colors["process_list"] = "#de6d47";
LGraphCanvas.slot_type_colors["process_list"] = "#de6d47";