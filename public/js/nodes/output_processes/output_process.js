export class OutputProcess {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf303', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};
    }
}

// Set the colors of selected connection to better reflect the flow
LGraphCanvas.link_type_colors["output_process"] = "#de9847";
LGraphCanvas.slot_type_colors["output_process"] = "#de9847";
LGraphCanvas.link_type_colors["output_process_list"] = "#de9847";
LGraphCanvas.slot_type_colors["output_process_list"] = "#de9847";