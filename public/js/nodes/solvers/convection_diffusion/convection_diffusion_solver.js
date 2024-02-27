class ConvectionDiffusionSolver extends Solver {
    constructor() {
        super();

        // node configuration
        this.size = this.computeSize();

        // set inputs
        let iidx = 0;
        this.imod = iidx++;
        this.addInput("Modelpart settings", "model_import_settings", {
            //"glyph": {
            //    shape: "\uf6cf",
            //    font: '900 10px "Font Awesome 5 Free"',
            //    width: 9,
            //    height: 10
            //}
        });
        this.ivolmp = iidx++;
        this.addInput("Volume submodelpart", "modelpart");
        this.iskinmp = iidx++;
        this.addInput("Skin submodelparts", "modelparts");
        this.inskinmp = iidx++;
        this.addInput("NonSkin submodelparts", "modelparts");
        this.ilinsol = iidx++;
        this.addInput("Linear solver", "linear_solver_settings");
        this.imat = iidx++;
        this.addInput("Materials settings", "material_import_settings");
        this.itime = iidx++;
        this.addInput("Time stepping", "time");
        this.iformulation = iidx++;
        this.addInput("Formulation", "formulation");

        // set outputs

        let oidx = 0;
        this.osolver = oidx++;
        this.addOutput("Solver", "solver_settings");

        // properties

        this.properties = {
            "solver_type": "",
            "echo_level": -1,
            "compute_reactions": true,

            "analysis_type": "",

            "solution_relative_tolerance": -1,
            "solution_absolute_tolerance": -1,
            "residual_relative_tolerance": -1,
            "residual_absolute_tolerance": -1,

            "domain_size": -1,
            "model_import_settings": {},
            "model_part_name": "",

            "material_import_settings": {},

            "linear_solver_settings": {},
            "time_stepping": {},

            "convection_diffusion_variables" : {
                "density_variable"              : "DENSITY",
                "diffusion_variable"            : "CONDUCTIVITY",
                "unknown_variable"              : "TEMPERATURE",
                "volume_source_variable"        : "HEAT_FLUX",
                "surface_source_variable"       : "FACE_HEAT_FLUX",
                "projection_variable"           : "PROJECTED_SCALAR1",
                "convection_variable"           : "CONVECTION_VELOCITY",
                "gradient_variable"             : "TEMPERATURE_GRADIENT",
                "mesh_velocity_variable"        : "MESH_VELOCITY",
                "transfer_coefficient_variable" : "TRANSFER_COEFFICIENT",
                "velocity_variable"             : "VELOCITY",
                "specific_heat_variable"        : "SPECIFIC_HEAT",
                "reaction_variable"             : "REACTION_FLUX",
                "reaction_gradient_variable"    : "REACTION"
            }
        };

        this.echo_level = this.addWidget("combo", "Echo level", 0, function(v) {}, {
            values: [0, 1, 2, 3]
        });
        this.compute_reactions = this.addWidget("combo", "Compute reactions", false, function(v) {}, {
            values: [false, true]
        });
        this.maximum_iterations = this.addWidget("number", "Maximum iterations", 10, function(v) {}, {
		min: 1, max: 100, step: 10
        });
        this.solution_relative_tolerance = this.addWidget("combo", "Solution REL tol ", 1e-3, function(v) {}, {
            values: [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6,]
        });
        this.solution_absolute_tolerance = this.addWidget("combo", "Solution ABS tol", 1e-5, function(v) {}, {
            values: [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6,]
        });
        this.residual_relative_tolerance = this.addWidget("combo", "Residual REL tol ", 1e-3, function(v) {}, {
            values: [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6,]
        });
        this.residual_absolute_tolerance = this.addWidget("combo", "Residual ABS tol", 1e-5, function(v) {}, {
            values: [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6,]
        });
    }

    onExecute() {
        this._value = Object.assign({}, this.properties);
        let val;
        let idx;

        idx = this.imod;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx)["mp_name"];
            this._value["model_part_name"] = val;
        }

        idx = this.imod;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx)["linear"];
            this._value["analysis_type"] = val;
        }

        idx = this.imod;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx)["dim"];
            this._value["domain_size"] = val;
        }

        idx = this.imod;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this._value["model_import_settings"] = val;
        }

        idx = this.ivolmp;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx)["smp_name"];
            this._value["volume_model_part_name"] = val;
        }

        idx = this.iskinmp;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this._value["skin_parts"] = val;
        }

        idx = this.inskinmp;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this._value["no_skin_parts"] = val;
        }

        idx = this.ilinsol;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this._value["linear_solver_settings"] = val;
        }

        idx = this.itime;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this._value["time_stepping"] = val;
        }

        idx = this.imat;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this._value["material_import_settings"] = val;
        }

        idx = this.iformulation;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx)["type"];
            this._value["solver_type"] = val;
            val = this.getInputData(idx)["formulation"];
            this._value["formulation"] = val;
        }

        this._value["echo_level"] = this.echo_level.value;
        this._value["compute_reactions"] = this.compute_reactions.value;
        this._value["maximum_iterations"] = this.maximum_iterations.value;
        this._value["solution_relative_tolerance"] = this.solution_relative_tolerance.value;
        this._value["solution_absolute_tolerance"] = this.solution_absolute_tolerance.value;
        this._value["residual_relative_tolerance"] = this.residual_relative_tolerance.value;
        this._value["residual_absolute_tolerance"] = this.residual_absolute_tolerance.value;

        this.setOutputData(this.osolver, this._value);
    }
}

ConvectionDiffusionSolver.title = "Convection-diffusion solver";
ConvectionDiffusionSolver.desc = "Properties for the convection-diffusion solver";

LiteGraph.registerNodeType("Solvers/Convection-diffusion/ConvectionDiffusionSolver", ConvectionDiffusionSolver);
