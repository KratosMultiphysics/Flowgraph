import { Modeler } from "/js/nodes/modelers/base/modeler.js";

class CreateEntitiesFromGeometriesModeler extends Modeler {
    constructor() {
        super()

        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        // Identifier Glyph
        this.glyph = {shape: '\uf6cf', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Elements list", "input_list");
        this.addInput("Conditions list", "input_list");

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute() {
        this._value = {
            "elements_list" : (this.getInputData(0) == null ? [] : this.getInputData(0)),
            "conditions_list" : (this.getInputData(1) == null ? [] : this.getInputData(1)),
        };

        let output = {
            "python_module" : "create_entities_from_geometries_modeler",
            "kratos_module" : "KratosMultiphysics"
        }

        output["settings"] = this._value

        this.setOutputData(0, output);
    }
}

CreateEntitiesFromGeometriesModeler.title = "Create entities from geometries modeler";
CreateEntitiesFromGeometriesModeler.desc  = "This modeler assigns entities (elements and conditions) to a set of geometries contained in the specified model parts";

LiteGraph.registerNodeType("Modelers/Create entities from geometries", ModelManager.registerNodeType(CreateEntitiesFromGeometriesModeler));

console.log("CreateEntitiesFromGeometriesModeler node created"); //helps to debug
