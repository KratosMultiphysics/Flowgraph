class CombineMaterialsModelparts {

    constructor() {
        // Node settings
        this.glyph = {
            shape: '\uf6d1',
            font: '900 14px "Font Awesome 5 Free"',
            width: 16,
            height: 9
        };
        this.serialize_widgets = true;
        this.size = this.computeSize();

        this.addInput("Material 0", "material");
        this.addInput("Modelpart 0", "modelpart");
        this.icount = 2
    }

    onExecute() {
	    // TBD
    }

    onConnectionsChange() {
        if (this.isInputConnected(this.icount - 1) &&
            this.isInputConnected(this.icount - 2)) {

            const idx = Math.floor(this.icount / 2);
            this.addInput("Material " + idx, "material");
            this.addInput("Modelpart " + idx, "modelpart");
            this.icount += 2;
        }
    }
}

CombineMaterialsModelparts.title = "Combine materials and modelparts";
CombineMaterialsModelparts.desc = "Combine materials and modelparts, and create a valid materials file.";
LiteGraph.registerNodeType("IO/CombineMaterialsModelparts", CombineMaterialsModelparts);
