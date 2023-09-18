class NavierStokesSolverMonolithic extends Solver {
    constructor() {
        super();

        // node configuration
        this.size = this.computeSize();

        // set inputs
        let iidx = 0;
        this.imod = iidx++;
        this.addInput("Modelpart settings", "modelpart_settings", {
            //"glyph": {
            //    shape: "\uf6cf",
            //    font: '900 10px "Font Awesome 5 Free"',
            //    width: 9,
            //    height: 10
            //}
        });
        this.ivolmp = iidx++;
        this.addInput("Volume submodelpart", "string");
        this.iskinmp = iidx++;
        this.addInput("Skin submodelparts", "string");
        this.inskinmp = iidx++;
        this.addInput("NonSkin submodelparts", "string");
        this.ilinsol = iidx++;
        this.addInput("Linear solver", "linear_solver_settings");
        this.imat = iidx++;
        this.addInput("Materials settings", "materials_settings");
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
            "compute_reactions": false,

            "maximum_iterations": -1,
            "relative_velocity_tolerance": -1,
            "absolute_velocity_tolerance": -1,
            "relative_pressure_tolerance": -1,
            "absolute_pressure_tolerance": -1,

            "domain_size": -1,
            "model_import_settings": {},
            "model_part_name": "",
            "volume_model_part_name": "",
            "skin_parts": [],
            "no_skin_parts": [],

            "material_import_settings": {},

            "linear_solver_settings": {},
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
        this.relative_velocity_tolerance = this.addWidget("combo", "Velocity REL tol ", 1e-3, function(v) {}, {
            values: [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6,]
        });
        this.absolute_velocity_tolerance = this.addWidget("combo", "Velocity ABS tol", 1e-5, function(v) {}, {
            values: [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6,]
        });
        this.relative_pressure_tolerance = this.addWidget("combo", "Pressure REL tol", 1e-3, function(v) {}, {
            values: [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6,]
        });
        this.absolute_pressure_tolerance = this.addWidget("combo", "Pressure ABS tol", 1e-5, function(v) {}, {
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
            val = this.getInputData(idx)["dim"];
            this._value["domain_size"] = val;
        }

        idx = this.imod;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx)["mp_settings"];
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
        this._value["relative_velocity_tolerance"] = this.relative_velocity_tolerance.value;
        this._value["absolute_velocity_tolerance"] = this.absolute_velocity_tolerance.value;
        this._value["relative_pressure_tolerance"] = this.relative_pressure_tolerance.value;
        this._value["absolute_pressure_tolerance"] = this.absolute_pressure_tolerance.value;

        this.setOutputData(this.osolver, this._value);
    }
}

NavierStokesSolverMonolithic.title = "Navier Stokes Solver Monolithic";
NavierStokesSolverMonolithic.desc = "Properties for the fluid solver";

LiteGraph.registerNodeType("SOLVERS/Navier Stokes Solver Monolithic", NavierStokesSolverMonolithic);
