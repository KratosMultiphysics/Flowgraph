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
        this.buildConnections(0);
    }

    //onAdded() {
    //    this.buildConnections();
    //}

    buildConnections(idx) {

        this.addInput("Material " + idx, "material");
        this.addInput("Modelpart " + idx, "modelpart");
    }


    onExecute() {
        if (!this._value) {
            this._value = new Array();
        }
        this._value.length = this.inputs.length - 1;
        for (let i = 0; i < this.inputs.length - 1; ++i) {
            this._value[i] = this.getInputData(i);
        }

        //const modelpart = this.getInputData(this.findInputSlot("Modelpart"));
        //const material = this.getInputData(this.findInputSlot("Material"));
        //this.out = {
        //    "material": material,
        //    "modelpart": modelpart
        //};
    }

    onConnectionsChange() {

        // Remove unconnected nodes
        for (let i = 0; i < this.inputs.length; i++) {
            if (!this.isInputConnected(i) && this.getOutputData(1) > 0) {
                this.removeInput(i);
            }
            if (i < this.inputs.length) {
                this.inputs[i].name = Math.floor(i / 2);
            }
        }

        // If all nodes are connected, or there are no nodes, add one.
        if (this.inputs.length <= 0 || this.isInputConnected(this.inputs.length - 1)) {
            this.buildConnections(Math.floor(this.inputs.length / 2));
            //this.addInput("Material", "material");
            //this.addInput("Modelpart", "modelpart");
        }

        this.size = this.computeSize();
    }
}

CombineMaterialsModelparts.title = "Combine materials and modelparts";
CombineMaterialsModelparts.desc = "Combine materials and modelparts, and create a valid materials file.";
LiteGraph.registerNodeType("IO/CombineMaterialsModelparts", CombineMaterialsModelparts);
