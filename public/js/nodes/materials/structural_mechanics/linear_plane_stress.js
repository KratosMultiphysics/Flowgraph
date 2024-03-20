import { Material } from "/js/nodes/materials/material.js";

class MaterialLinearPlaneStress extends Material {
    constructor() {
        super(); 
        
        this.addInput("model_part_name","string");
        this.addInput("properties_id","number");
        this.addInput("density","number");
        this.addInput("young_modulus","number");
        this.addInput("poisson_ratio","number");
        this.addInput("thickness","number");        
        this.addOutput("Material","material");
        this.properties = {
            "properties_id" : 0,
            "density" : 0.0,
            "young_modulus" : 0.0,
            "poisson_ratio" : 0.0,
            "thickness" : 0.0
        };

        this.size = this.computeSize();
    }

    onExecute()
    {
        var output = {
            "model_part_name" : "",
            "properties_id"   : 0,
            "Material"        : {
                "constitutive_law" : {
                    "name" : "LinearElasticPlaneStress2DLaw"
                },
                "Variables"        : {
                    "DENSITY"       : 0.0,
                    "YOUNG_MODULUS" : 0.0,
                    "POISSON_RATIO" : 0.0,
                    "THICKNESS"     : 0.0
                },
                "Tables"           : {}
            }
        }
        this._value = Object.assign({}, output);

        // Current material model part
        this._value["model_part_name"] = this.getInputData(0)

        // Properties id
        if (this.getInputData(1) != undefined) {
            this._value["properties_id"] = this.getInputData(1)
        } else {
            this._value["properties_id"] = this.properties["properties_id"]
        }

        // Density
        if (this.getInputData(2) != undefined) {
            this._value["Material"]["Variables"]["DENSITY"] = this.getInputData(2)
        } else {
            this._value["Material"]["Variables"]["DENSITY"] = this.properties["density"]
        }

        // Young modulus
        if (this.getInputData(3) != undefined) {
            this._value["Material"]["Variables"]["YOUNG_MODULUS"] = this.getInputData(3)
        } else {
            this._value["Material"]["Variables"]["YOUNG_MODULUS"] = this.properties["young_modulus"]
        }

        // Poisson ratio
        if (this.getInputData(4) != undefined) {
            this._value["Material"]["Variables"]["POISSON_RATIO"] = this.getInputData(4)
        } else {
            this._value["Material"]["Variables"]["POISSON_RATIO"] = this.properties["poisson_ratio"]
        }

        // Thickness
        if (this.getInputData(5) != undefined) {
            this._value["Material"]["Variables"]["THICKNESS"] = this.getInputData(5)
        } else {
            this._value["Material"]["Variables"]["THICKNESS"] = this.properties["thickness"]
        }

        this.setOutputData(0, this._value);
    }
}

MaterialLinearPlaneStress.title = "Linear plane stress";
MaterialLinearPlaneStress.desc = "Node to specify a linear plane stress material.";

LiteGraph.registerNodeType("Materials/StructuralMechanics/LinearPlaneStress", MaterialLinearPlaneStress);

console.log("MaterialLinearPlaneStress node created"); //helps to debug
