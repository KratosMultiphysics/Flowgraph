class Material {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf3a5', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};
    }
}

// Set the colors of selected connection to better reflect the flow
const material_color = "#924ccf";

LGraphCanvas.link_type_colors["material"] = material_color;
LGraphCanvas.slot_type_colors["material"] = material_color;
LGraphCanvas.link_type_colors["materials_list"] = material_color;
LGraphCanvas.slot_type_colors["materials_list"] = material_color;