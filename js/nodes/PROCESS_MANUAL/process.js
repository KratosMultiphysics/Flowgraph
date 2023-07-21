class Process {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf12b', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Set the color to visualize flows
        this.color = LGraphCanvas.node_colors["red"].color;
        this.bgcolor = LGraphCanvas.node_colors["red"].bgcolor;
    }
}

// Set the colors of selected connection to better reflect the flow
LGraphCanvas.link_type_colors["process"] = "#85332d";
LGraphCanvas.link_type_colors["process_list"] = "#85332d";