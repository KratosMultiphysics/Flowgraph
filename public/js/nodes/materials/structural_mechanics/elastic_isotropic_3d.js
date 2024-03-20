import { Material } from "/js/nodes/materials/material.js";

class MaterialElasticIsotropic3D extends Material {
    constructor() {
        super(); 

        this.properties = {
            "properties_id" : 0,
            "density" : 0.0,
            "young_modulus" : 0.0,
            "poisson_ratio" : 0.0
        };
        
        this.addInput("model_part_name","string");
        this.addInput("properties_id","number");
        this.addInput("density","number");
        // this.poisson_ratio = this.addWidget("number", "density", this.properties.density, "density", { step: 1, precision: 0.1 });
        this.addInput("young_modulus","number");
        // this.poisson_ratio = this.addWidget("number", "young_modulus", this.properties.young_modulus, "young_modulus", { step: 1, precision: 0.1 });
        this.addInput("poisson_ratio","number"); 
        // this.poisson_ratio = this.addWidget("number", "poisson_ratio", this.properties.poisson_ratio, "poisson_ratio", { step: 1, precision: 0.05 });
        this.addOutput("Material","material");

        this.size = this.computeSize();
    }

    onExecute()
    {
        var output = {
            "model_part_name" : "",
            "properties_id"   : 0,
            "Material"        : {
                "constitutive_law" : {
                    "name" : "LinearElastic3DLaw"
                },
                "Variables"        : {
                    "DENSITY"       : 0.0,
                    "YOUNG_MODULUS" : 0.0,
                    "POISSON_RATIO" : 0.0
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

        this.setOutputData(0, this._value);
    }
}

MaterialElasticIsotropic3D.title = "Elastic isotropic 3D";
MaterialElasticIsotropic3D.desc = "Node to specify a elastic isotropic material.";

LiteGraph.registerNodeType("Materials/StructuralMechanics/ElasticIsotropic3D", MaterialElasticIsotropic3D);

console.log("MaterialElasticIsotropic3D node created"); //helps to debug
