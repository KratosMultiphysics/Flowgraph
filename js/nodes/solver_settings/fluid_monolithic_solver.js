class FluidMonolithicSolver {
    constructor() {
        this.addInput("model_import_settings", "map");      // 0
        this.addInput("model_part_name", "string");         // 1
        // this.addInput("ProblemData", "map");                // 2
        this.addInput("volume_model_part_name", "string");  // 2
        this.addInput("skin_parts", "array");               // 3
        this.addInput("no_skin_parts", "array");            // 4
        this.addInput("linear_solver_settings", "map");     // 5
        this.addInput("material_import_settings", "map");   // 6
        this.addOutput("solver_settings", "map");
        this.properties = {
            "solver_type": "Monolithic",
            "model_import_settings": {
                "input_type": "mdpa",
            },
            "echo_level": 0,
            "compute_reactions": false,
            "maximum_iterations": 10,
            "relative_velocity_tolerance": 0.001,
            "absolute_velocity_tolerance": 1e-5,
            "relative_pressure_tolerance": 0.001,
            "absolute_pressure_tolerance": 1e-5,
            "volume_model_part_name": "",
            "skin_parts": [],
            "no_skin_parts": [],
            "time_stepping": {
                "automatic_time_step": false,
                "time_step": 0.1
            },
            "formulation": {
                "element_type": "vms",
                "use_orthogonal_subscales": false,
                "dynamic_tau": 1.0
            },
            "reform_dofs_at_each_step": false,
            "linear_solver_settings": {
            }
        };
        this.domain_size = this.addWidget("combo","Domain Size", "2", function(v){}, { values:["2","3"]} );
        this.size = this.computeSize();
    }

    onExecute() {
        this._value = Object.assign({}, this.properties);
        if (this.getInputData(0) != undefined) {
            this._value["model_part_name"] = this.getInputData(1);
        }
        this._value["domain_size"] = this.domain_size.value;
        this._value["volume_model_part_name"] = this.getInputData(2);

        this._value["skin_parts"] = this.getInputData(3);
        this._value["no_skin_parts"] = this.getInputData(4);
        this._value["linear_solver_settings"] = this.getInputData(5);
        if (this.getInputData(7) == undefined) {
            // If the input is not provided, get the "problem_name" as mpda input file
            if (this.getInputData(1) != undefined) {
                this._value["model_import_settings"]["input_filename"] = this.getInputData(2)["problem_name"];
            }
            this._value["model_import_settings"]["input_type"] = "mdpa";
        } else {
            // Custom input provided
            this._value["model_import_settings"] = this.getInputData(0);
        }
        this._value["material_import_settings"] = this.getInputData(6);

        // Get the 

        this.setOutputData(0, this._value);
    }
}

FluidMonolithicSolver.title = "Fluid monolithic solver";
FluidMonolithicSolver.desc = "Properties for the monolthic fluid solver";

LiteGraph.registerNodeType("solver_settings/FluidMonolithicSolver", FluidMonolithicSolver);

console.log("FluidMonolithicSolver node created"); //helps to debug