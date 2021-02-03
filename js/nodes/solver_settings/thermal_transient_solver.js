class ThermalTransientSolver extends BaseSolver {
    constructor() {
        super();
        
        this.addInput("model_part_name", "string");                             // 0
        this.addInput("model_import_settings", "model_import_settings");        // 1
        this.addInput("material_import_settings", "material_import_setting");   // 2

        this.addOutput("solver_settings", "solver_settings");

        this.properties =  {
            "solver_type": "Transient",
            "model_part_name": "FluidThermalModelPart",
            "analysis_type": "linear",
            "model_import_settings": {
                "input_type": "use_input_model_part"
            },
            "material_import_settings": {
                "materials_filename": "ThermicMaterialsFluid.json"
            }
        };
        
        this.size = this.computeSize();
    }

    onExecute() {
        this._value = Object.assign({}, this.properties);

        if (this.getInputData(0) != undefined) {
            this._value["model_part_name"] = this.getInputData(0);
        }

        // Get the input
        this._value["model_part_name"] = this.getInputData(0);
        
        if (this.getInputData(1) != undefined) this._value["model_import_settings"] = this.getInputData(1);
        if (this.getInputData(2) != undefined) this._value["material_import_settings"] = this.getInputData(2);

        // Get the output
        this.setOutputData(0, this._value);
    }

    onConnectionsChange() {
        // Check if the up-stream node has change and update the override
        this.handleUpStreamOverride('domain_size', 0);
    }
}

ThermalTransientSolver.title = "Thermal transient solver";
ThermalTransientSolver.desc = "Properties for the monolthic fluid solver";

LiteGraph.registerNodeType("solver_settings/ThermalTransientSolver", ThermalTransientSolver);

console.log("ThermalTransientSolver node created");