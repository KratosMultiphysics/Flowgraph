class FluidMonolithicSolver {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf085', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Model", "modelpart_settings", {"glyph": {shape:"\uf6cf", font:'900 10px "Font Awesome 5 Free"', width:9, height:10}});  // 0
        this.addInput("model_part_name", "string");  // 1
        this.addInput("Volume submodelpart", "submodelpart");  // 2
        this.addInput("Skin submodelparts", "submodelparts");  // 3
        this.addInput("NonSkin submodelparts", "submodelparts");  // 4
        this.addInput("Linear solver", "map");  // 5
        this.addInput("Materials", "materials_settings");  // 6
        this.addInput("Time stepping", "map");  // 7
        
        this.addOutput("Solver", "solver_settings");

        // List of properties
        this.properties = {
            "solver_type": "Monolithic",
            "model_import_settings": {},
            "echo_level": 0,
            "compute_reactions": false,
            "maximum_iterations": 10,
            "relative_velocity_tolerance": 1e-3,
            "absolute_velocity_tolerance": 1e-5,
            "relative_pressure_tolerance": 1e-3,
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

        //if (this.getInputData(0) != undefined) {
        //    this._value["model_part_name"] = this.getInputData(1);
        //}
        this._value["model_import_settings"] = this.getInputData(0);
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

LiteGraph.registerNodeType("PROJECT PARAMETERS/Solvers/Fluid Monolithic Solver", FluidMonolithicSolver);
