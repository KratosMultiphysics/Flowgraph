class FluidMonolithicSolver {

    constructor() {

        // node configuration

        this.glyph = {
            shape: '\uf085',
            font: '900 14px "Font Awesome 5 Free"',
            width: 16,
            height: 9
        };
        this.size = this.computeSize();
        //this.crop_title = 5;

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
        this.addInput("Volume submodelpart", "submodelpart");
        this.iskinmp = iidx++;
        this.addInput("Skin submodelparts", "list-submodelpart");
        this.inskinmp = iidx++;
        this.addInput("NonSkin submodelparts", "list-submodelpart");
        this.ilinsol = iidx++;
        this.addInput("Linear solver", "map");
        this.imat = iidx++;
        this.addInput("Materials", "materials_settings");
        this.itime = iidx++;
        this.addInput("Time stepping", "time");

        // set outputs

        let oidx = 0;
        this.osolver = oidx++;
        this.addOutput("Solver", "solver_settings");

        // properties
        this.properties = {
            "solver_type": "Monolithic",
            "model_import_settings": {},
            "model_part_name": "",
            "domain_size": -1,
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
            "time_stepping": {},
            "formulation": {
                "element_type": "vms",
                "use_orthogonal_subscales": false,
                "dynamic_tau": 1.0
            },
            "reform_dofs_at_each_step": false,
            "linear_solver_settings": {}
        };

        this.echo_level = this.addWidget("combo", "Echo level", "0", function(v) {}, {
            values: ["0", "1", "2", "3"]
        });
        this.compute_reactions = this.addWidget("combo", "Compute reactions", false, function(v) {}, {
            values: [false, true]
        });
        this.reform_dofs_at_each_step = this.addWidget("combo", "Reform DOFs", false, function(v) {}, {
            values: [false, true]
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
            val = this.getInputData(idx)["mp_name"] + "." + this.getInputData(idx)["smp_name"];
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

        this._value["echo_level"] = this.echo_level.value;
        this._value["compute_reactions"] = this.compute_reactions.value;
        this._value["reform_dofs_at_each_step"] = this.reform_dofs_at_each_step.value;

        this.setOutputData(this.osolver, this._value);
    }
}

FluidMonolithicSolver.title = "Fluid monolithic solver";
FluidMonolithicSolver.desc = "Properties for the monolthic fluid solver";

LiteGraph.registerNodeType("SOLVERS/Fluid Monolithic Solver", FluidMonolithicSolver);
