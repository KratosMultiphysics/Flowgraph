import { Solver } from "/js/nodes/solvers/base/solver.js";

class NavierStokesSolverFractionalStep extends Solver {
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
        this.imodn = iidx++;
        this.addInput("model_part_name", "string");
        this.ivolmp = iidx++;
        this.addInput("Volume submodelpart", "string");
        this.iskinmp = iidx++;
        this.addInput("Skin submodelparts", "string");
        this.inskinmp = iidx++;
        this.addInput("NonSkin submodelparts", "string");
        this.vilinsol = iidx++;
        this.addInput("Velocity Linear solver", "velocity_linear_solver_settings");
        this.pilinsol = iidx++;
        this.addInput("Pressure Linear solver", "pressure_linear_solver_settings");
        this.imat = iidx++;
        this.addInput("Materials settings", "material_import_settings");
        this.itime = iidx++;
        this.addInput("Time stepping", "time");
        this.iformulation = iidx++;
        this.addInput("Formulation", "formulation");

        // set outputs

        let oidx = 0;
        this.osolver = oidx++;
        this.addOutput("Solver settings", "solver_settings");

        // properties

        this.properties = {
            "solver_type": "fractional_step",
            "echo_level": -1,
            "compute_reactions": false,

            "maximum_velocity_iterations": -1,
            "maximum_pressure_iterations": -1,
            "velocity_tolerance": -1,
            "pressure_tolerance": -1,

            "domain_size": -1,
            "model_import_settings": {},
            "model_part_name": [],
            "volume_model_part_name": [],
            "skin_parts": [],
            "no_skin_parts": [],

            "material_import_settings": {},

            "velocity_linear_solver_settings": {},
            "pressure_linear_solver_settings": {},
            "time_stepping": {},
            "formulation": {}
        };
            //"formulation": {
            //    "element_type": "vms",
            //    "use_orthogonal_subscales": false,
            //    "dynamic_tau": 1.0
            //},

        this.echo_level = this.addWidget("combo", "Echo level", 0, function(v) {}, {
            values: [0, 1, 2, 3]
        });
        this.compute_reactions = this.addWidget("combo", "Compute reactions", false, function(v) {}, {
            values: [false, true]
        });
        this.maximum_iterations = this.addWidget("number", "Maximum iterations", 10, function(v) {}, {
		min: 1, max: 100, step: 1
        });
        this.velocity_tolerance = this.addWidget("combo", "Velocity non-lin tol ", 1e-3, function(v) {}, {
            values: [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6,]
        });
        this.pressure_tolerance = this.addWidget("combo", "Pressure non-lin tol", 1e-3, function(v) {}, {
            values: [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6,]
        });
    }

    onExecute() {
        this._value = Object.assign({}, this.properties);
        let val;
        let idx;

        idx = this.imodn;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this._value["model_part_name"] = val;
        }

        idx = this.ivolmp;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
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

        idx = this.imod;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx)["dim"];
            this._value["domain_size"] = val;
        }

        idx = this.imod;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx)["mp_settings"];
            this._value["model_import_settings"] = val;
        }


        idx = this.pilinsol;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this._value["pressure_linear_solver_settings"] = val;
        }

        idx = this.vilinsol;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this._value["velocity_linear_solver_settings"] = val;
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
        this._value["velocity_tolerance"] = this.velocity_tolerance.value;
        this._value["pressure_tolerance"] = this.pressure_tolerance.value;

        this.setOutputData(this.osolver, this._value);
    }
}

NavierStokesSolverFractionalStep.title = "Navier-Stokes fractional step solver";
NavierStokesSolverFractionalStep.desc = "Incompressible Navier-Stokes fractional step solver.";

LiteGraph.registerNodeType("Solvers/Fluid dynamics/NavierStokesSolverFractionalStep", NavierStokesSolverFractionalStep);
