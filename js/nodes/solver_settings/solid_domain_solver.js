class SolidDomainSolver {
    constructor() {
        this.addInput("solid_solver_settings", "solver_settings");        // 0
        this.addInput("thermal_solver_settings", "solver_settings");      // 1

        this.addOutput("solver_settings", "solver_settings");

        this.properties =  {
            "solid_solver_settings": {
            },
            "thermal_solver_settings": {
                "model_part_name": "SolidThermalModelPart",
                "solver_type": "Transient",
                "analysis_type": "linear",
                "model_import_settings": {
                    "input_type": "mdpa",
                    "input_filename": "unknown_name"
                },
                "material_import_settings": {
                    "materials_filename": "ThermicMaterialsSolid.json"
                }
            }
        };
        
        this.size = this.computeSize();
    }

    onExecute() {
        this._value = Object.assign({}, this.properties);

        // Get the input
        this._value["solid_solver_settings"] = this.getInputData(0);
        this._value["thermal_solver_settings"] = this.getInputData(1);

        // Get the output
        this.setOutputData(0, this._value);
    }
}

SolidDomainSolver.title = "Solid Domain";
SolidDomainSolver.desc = "Properties for the monolthic fluid solver";

LiteGraph.registerNodeType("solver_settings/SolidDomainSolver", SolidDomainSolver);

console.log("SolidDomainSolver node created");