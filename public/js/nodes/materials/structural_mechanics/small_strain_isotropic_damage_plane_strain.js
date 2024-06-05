import { Material } from "/js/nodes/materials/material.js";

class SmallStrainIsotropicDamagePlaneStrain extends Material {
    constructor() {
        super(); 

        let that = this;

        this.properties = {
            "properties_id" : 0,
        };
        
        this.addInput("model_part_name","string");
        this.addInput("properties_id","number");

        this.addOutput("Material","material");

        this.dynamicValues = { };
        this.yieldsurfaceproperties = {
            "VonMises" : ["DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "FRACTURE_ENERGY", "SOFTENING_TYPE"],
            "Tresca" : ["DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "FRACTURE_ENERGY", "SOFTENING_TYPE"],
            "Rankine" : ["DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "FRACTURE_ENERGY", "SOFTENING_TYPE"],
            "MohrCoulomb" : ["DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "YIELD_STRESS_COMPRESSION", "FRACTURE_ENERGY", "SOFTENING_TYPE", "FRICTION_ANGLE","COHESION"],
            "ModifiedMohrCoulomb" : ["DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "YIELD_STRESS_COMPRESSION", "FRACTURE_ENERGY", "SOFTENING_TYPE","FRICTION_ANGLE"],
            "DruckerPrager" : ["DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "YIELD_STRESS_COMPRESSION", "FRACTURE_ENERGY", "SOFTENING_TYPE", "FRICTION_ANGLE", "DILATANCY_ANGLE"],
            "SimoJu" : ["DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "FRACTURE_ENERGY", "SOFTENING_TYPE"],
        }
       
        this.defaultYieldSurface = "VonMises"
        this.yieldSurface = this.addWidget("combo","YieldSurface", this.defaultYieldSurface, function(v){
            that.updateDynCombo(v);
        }, { values:["VonMises", "ModifiedMohrCoulomb","Tresca","DruckerPrager","Rankine","SimoJu","MohrCoulomb"]} );

        this.updateDynCombo(this.defaultYieldSurface);

    }

    updateDynCombo(v) {
        if (v in this.yieldsurfaceproperties) {
            let numInitialWidgets = this.widgets.length;

            for (let i = 1; i < numInitialWidgets; i++) {
                this.removeWidget(1);
            }

            this.dynamicValues = { };

            for (let dynProperty in this.yieldsurfaceproperties[v]) {
                if (this.yieldsurfaceproperties[v][dynProperty] == "SOFTENING_TYPE"){
                    this.dynamicValues[this.yieldsurfaceproperties[v][dynProperty]] = this.addWidget("combo", "SOFTENING_TYPE","", { property:"SOFTENING_TYPE", values: [0, 1, 2, 3]});
                } else {
                    this.dynamicValues[this.yieldsurfaceproperties[v][dynProperty]] = this.addWidget("number",  this.yieldsurfaceproperties[v][dynProperty], 0.0, { step: 1 })
                };
            }
        }

        this.size = this.computeSize();
    }

    onExecute()
    {
        var output = {
            "model_part_name" : "",
            "properties_id"   : 0,
            "Material"        : {
                "constitutive_law" : {
                    "name" : "SmallStrainIsotropicDamagePlaneStrain"
                },
                "Variables"        : {
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

        this._value["Material"]["constitutive_law"]["name"] = this._value["Material"]["constitutive_law"]["name"] + this.yieldSurface.value;

        for (let key in this.dynamicValues) {
            this._value["Material"]["Variables"][key] = this.dynamicValues[key].value;
        }

        this.setOutputData(0, this._value);
    }
}

SmallStrainIsotropicDamagePlaneStrain.title = "Small strain isotropic damage plane strain";
SmallStrainIsotropicDamagePlaneStrain.desc = "Node to specify a elastic isotropic material.";

LiteGraph.registerNodeType("Materials/StructuralMechanics/SmallStrainIsotropicDamagePlaneStrain", SmallStrainIsotropicDamagePlaneStrain);

console.log("SmallStrainIsotropicDamagePlaneStrain node created"); //helps to debug
