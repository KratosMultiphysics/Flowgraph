// TODO: Create a material base class
class MaterialNewtonian {
    constructor()
    {
        this.addInput("model_part_name","string");
        this.addInput("properties_id","number");
        this.addInput("density","number");
        this.addInput("viscosity","number");
        this.addOutput("Material","material");
        this.properties = {
            "properties_id" : 0,
            "density" : 0.0,
            "dynamic_viscosity" : 0.0
        };

        this.size = this.computeSize();
    }

    onExecute()
    {
        var output = {
            "model_part_name" : "",
            "properties_id" : 0,
            "Material" : {
                "constitutive_law" : {
                    "name" : "Newtonian2DLaw"
                },
                "Variables" : {
                    "DENSITY" : 0.0,
                    "DYNAMIC_VISCOSITY" : 0.0
                },
                "Tables" : {}
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

        // Dynamic viscosity
        if (this.getInputData(3) != undefined) {
            this._value["Material"]["Variables"]["DYNAMIC_VISCOSITY"] = this.getInputData(3)
        } else {
            this._value["Material"]["Variables"]["DYNAMIC_VISCOSITY"] = this.properties["dynamic_viscosity"]
        }

        this.setOutputData(0, this._value);
    }
}

MaterialNewtonian.title = "Newtonian material";
MaterialNewtonian.desc = "Node to specify a Newtonian fluid material.";

LiteGraph.registerNodeType("materials/Newtonian", MaterialNewtonian);

console.log("MaterialNewtonian node created"); //helps to debug