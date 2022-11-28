class AssignMaterialToModelPart {

    constructor() {
        // Node settings
        this.glyph = {
            shape: '\uf6d1',
            font: '900 14px "Font Awesome 5 Free"',
            width: 16,
            height: 9
        };
        this.serialize_widgets = true;

        this.addInput("Modelpart", "modelpart");
        this.addInput("Material", "material");
        this.addOutput("Modelpart property", "modelpart_property");
    }

    onExecute() {
        const modelpart = this.getInputData(this.findInputSlot("Modelpart"));
        const material = this.getInputData(this.findInputSlot("Material"));
        this.out = {
            "material": material,
            "modelpart": modelpart
        };
        this.setOutputData(this.findOutputSlot("Modelpart property"), this.out);
    }
}

AssignMaterialToModelPart.title = "Assign material to modelpart";
AssignMaterialToModelPart.desc = "Assign material to modelpart";
LiteGraph.registerNodeType("IO/AssignMaterialToModelPart", AssignMaterialToModelPart);
