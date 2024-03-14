import { FluidSolver } from "/js/nodes/solvers/fluid_dynamics/fluid_solver.js";

class NavierStokesSolverMonolithic extends FluidSolver {
    constructor() {
        super();

        // node configuration
        this.size = this.computeSize();

        // set inputs
        this.addInput("Modelpart settings", "model_import_settings");
        this.addInput("Volume submodelpart", "string");
        this.addInput("Skin submodelparts", "string");
        this.addInput("NonSkin submodelparts", "string");
        this.addInput("Linear solver", "linear_solver_settings");
        this.addInput("Materials settings", "material_import_settings");
        this.addInput("Time stepping", "time");
        this.addInput("Formulation", "formulation");

        // set outputs
        this.addOutput("Solver", "solver_settings");

        // properties
        this.properties = {
            "solver_type": "monolithic",
            "domain_size": 2,
            "echo_level": 0,
            "compute_reactions": false,
            "maximum_iterations": 10,
            "relative_velocity_tolerance": 1.0e-3,
            "absolute_velocity_tolerance": 1.0e-5,
            "relative_pressure_tolerance": 1.0e-3,
            "absolute_pressure_tolerance": 1.0e-5,
            "model_import_settings": {},
            "model_part_name": "FluidModelPart",
            "volume_model_part_name": "",
            "skin_parts": [],
            "no_skin_parts": [],
            "material_import_settings": {},
            "linear_solver_settings": {},
            "time_stepping": {},
            "formulation": {}
        };

        this.echo_level = this.addWidget("combo", "Echo level", this.properties["echo_level"], {
            property: "echo_level", values: [0, 1, 2, 3]
        });
        this.compute_reactions = this.addWidget("combo", "Compute reactions", this.properties["compute_reactions"], {
            property: "compute_reactions", values: [false, true]
        });
        this.maximum_iterations = this.addWidget("number", "Maximum iterations", this.properties["maximum_iterations"], {
		    property: "maximum_iterations", min: 1, max: 100, step: 1
        });
        this.relative_velocity_tolerance = this.addWidget("number", "Velocity relative tol.", this.properties["relative_velocity_tolerance"], {
            property: "relative_velocity_tolerance"
        });
        this.absolute_velocity_tolerance = this.addWidget("number", "Velocity absolute tol.", this.properties["absolute_velocity_tolerance"], {
            property: "absolute_velocity_tolerance"
        });
        this.relative_pressure_tolerance = this.addWidget("number", "Pressure relative tol.", this.properties["relative_pressure_tolerance"], {
            property: "relative_pressure_tolerance"
        });
        this.absolute_pressure_tolerance = this.addWidget("number", "Pressure absolute tol.", this.properties["absolute_pressure_tolerance"], {
            property: "absolute_pressure_tolerance"
        });
        this.domain_size = this.addWidget("combo", "Domain size", this.properties["domain_size"], { property:"domain_size", values: [2,3]});
    }

    onExecute() {
        this._value = Object.assign({}, this.properties);

        if (this.getInputData(0) != undefined) {
            this._value["model_import_settings"] = this.getInputData(0);
        }

        if (this.getInputData(1) != undefined) {
            this._value["volume_model_part_name"] = this.getInputData(1);
        }

        if (this.getInputData(2) != undefined) {
            this._value["skin_parts"] = this.getInputData(2);
        }

        if (this.getInputData(3) != undefined) {
            this._value["no_skin_parts"] = this.getInputData(3);
        }

        if (this.getInputData(4) != undefined) {
            this._value["linear_solver_settings"] = this.getInputData(4);
        }

        if (this.getInputData(5) != undefined) {
            this._value["material_import_settings"] = this.getInputData(5);
        }

        if (this.getInputData(6) != undefined) {
            this._value["time_stepping"] = this.getInputData(6);
        }

        if (this.getInputData(7) != undefined) {
            this._value["solver_type"] = this.getInputData(7)["type"];
            this._value["formulation"] = this.getInputData(7)["formulation"];
        }

        this.setOutputData(0, this._value);
    }
}

NavierStokesSolverMonolithic.title = "Navier-Stokes monolithic solver";
NavierStokesSolverMonolithic.desc = "Incompressible Navier-Stokes monolithic solver.";

LiteGraph.registerNodeType("Solvers/Fluid dynamics/NavierStokesSolverMonolithic", NavierStokesSolverMonolithic);
