export class Solver {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf085', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};
    }
}

// Set the colors of selected connection to better reflect the flow
const solver_color = "#5374c9";

LGraphCanvas.link_type_colors["solver_settings"] = solver_color;
LGraphCanvas.slot_type_colors["solver_settings"] = solver_color;