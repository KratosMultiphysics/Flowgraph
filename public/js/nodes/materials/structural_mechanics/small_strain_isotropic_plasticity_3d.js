import { Material } from "/js/nodes/materials/material.js";

class SmallStrainIsotropicPlasticity3D extends Material {
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
            "VonMises" : ["PlasticPotential","DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "FRACTURE_ENERGY", "HARDENING_CURVE"],
            "Tresca" : ["PlasticPotential","DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "FRACTURE_ENERGY", "HARDENING_CURVE"],
            "Rankine" : ["PlasticPotential","DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "FRACTURE_ENERGY", "HARDENING_CURVE"],
            "MohrCoulomb" : ["PlasticPotential","DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "YIELD_STRESS_COMPRESSION", "FRACTURE_ENERGY", "HARDENING_CURVE", "FRICTION_ANGLE","COHESION"],
            "ModifiedMohrCoulomb" : ["PlasticPotential","DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "YIELD_STRESS_COMPRESSION", "FRACTURE_ENERGY", "HARDENING_CURVE","FRICTION_ANGLE"],
            "DruckerPrager" : ["PlasticPotential","DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "YIELD_STRESS_COMPRESSION", "FRACTURE_ENERGY", "HARDENING_CURVE", "FRICTION_ANGLE", "DILATANCY_ANGLE"],
            "SimoJu" : ["PlasticPotential","DENSITY", "YOUNG_MODULUS", "POISSON_RATIO", "YIELD_STRESS", "FRACTURE_ENERGY", "HARDENING_CURVE"],
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
                if (this.yieldsurfaceproperties[v][dynProperty] == "PlasticPotential"){
                    this.defaultPlasticPotential = "VonMises"
                    this.plasticPotential = this.addWidget("combo","PlasticPotential", this.defaultPlasticPotential, function(v){}, { 
                        values:["VonMises", "ModifiedMohrCoulomb","Tresca","DruckerPrager","Rankine","SimoJu","MohrCoulomb"]});
                } else if (this.yieldsurfaceproperties[v][dynProperty] == "HARDENING_CURVE"){
                    this.dynamicValues[this.yieldsurfaceproperties[v][dynProperty]] = this.addWidget("combo", "HARDENING_CURVE","", { property:"HARDENING_CURVE", values: [0, 1, 2, 3, 4, 5, 6]});
                } else {
                    this.dynamicValues[this.yieldsurfaceproperties[v][dynProperty]] = this.addWidget("number",  this.yieldsurfaceproperties[v][dynProperty], 0.0, { step: 1 })
                };
            }
        }

        let tmp_size = this.computeSize();
        console.log(tmp_size)
        this.size = tmp_size;
    }

    onExecute()
    {
        var output = {
            "model_part_name" : "",
            "properties_id"   : 0,
            "Material"        : {
                "constitutive_law" : {
                    "name" : "SmallStrainIsotropicPlasticity3D"
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

        this._value["Material"]["constitutive_law"]["name"] = this._value["Material"]["constitutive_law"]["name"] + this.yieldSurface.value + this.plasticPotential.value;

        for (let key in this.dynamicValues) {
            this._value["Material"]["Variables"][key] = this.dynamicValues[key].value;
        }

        this.setOutputData(0, this._value);
    }
}

SmallStrainIsotropicPlasticity3D.title = "Small strain isotropic platicity 3D";
SmallStrainIsotropicPlasticity3D.desc = "Node to specify a elastoplastic isotropic material.";

LiteGraph.registerNodeType("Materials/StructuralMechanics/SmallStrainIsotropicPlasticity3D", SmallStrainIsotropicPlasticity3D);

console.log("SmallStrainIsotropicPlasticity3D node created"); //helps to debug
