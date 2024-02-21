class StructuralMechanicsSolver extends Solver {
    constructor() {
        super();

        // List of inputs and outputs ("name", "type")
        this.addInput("model_import_settings", "model_import_settings", {"glyph": {shape:"\uf6cf", font:'900 10px "Font Awesome 5 Free"', width:9, height:10}}); // 0
        this.addInput("model_part_name", "string");         // 1
        this.addInput("volume_model_part_name", "string");  // 2
        this.addInput("skin_parts", "array");               // 3
        this.addInput("no_skin_parts", "array");            // 4
        this.addInput("linear_solver_settings", "linear_solver_settings");     // 5
        this.addInput("material_import_settings", "model_import_settings");   // 6

        this.addOutput("solver_settings", "solver_settings,structure_solver_settings");

        // List of properties
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
        this.crop_title = 5;
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

        if (this.getInputData(0) == undefined) {
            if (this.getInputData(1) != undefined) {
                this._value["model_import_settings"]["input_filename"] = this.getInputData(2)["problem_name"];
                this._value["model_import_settings"]["input_type"] = this.getInputData(2)["problem_name"];
            }
        } else {
            // Custom input provided
            this._value["model_import_settings"] = this.getInputData(0);
        }

        this._value["material_import_settings"] = this.getInputData(6);

        // Get the
        this.setOutputData(0, this._value);
    }
}

StructuralMechanicsSolver.title = "Structural mechanics solver";
StructuralMechanicsSolver.desc = "Properties for the structural mechanics solver";

LiteGraph.registerNodeType("Solvers/Structural Mechanics Solver", StructuralMechanicsSolver);

console.log("StructuralMechanicsSolver node created"); //helps to debug
