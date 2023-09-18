class MLSolver {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf013', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        this.properties = {
            "solver_type": "multi_level",
            "tolerance": 1.0e-6,
            "max_iteration": 200,
            "max_levels": 3,
            "scaling": true,
            "reform_preconditioner_at_each_step": true,
            "symmetric": false,
            "verbosity": 0
        };

        // Define the widgets and store them as instance variables
        this.max_iteration = this.addWidget("number", "Max Iteration", this.properties.max_iteration, "max_iteration", { step: 1, precision: 0 });
        this.tolerance = this.addWidget("number", "Tolerance", this.properties.tolerance, "tolerance", { step: 0.000001, precision: 6 });
        this.max_levels = this.addWidget("number", "Max Levels", this.properties.max_levels, "max_levels", { step: 1, precision: 0 });
        this.verbosity = this.addWidget("number", "Verbosity", this.properties.verbosity, "verbosity", { step: 1, precision: 0 });
        this.scaling = this.addWidget("toggle", "Scaling", this.properties.scaling, "scaling");
        this.reform_preconditioner_at_each_step = this.addWidget("toggle", "Reform Preconditioner At Each Step", this.properties.reform_preconditioner_at_each_step, "reform_preconditioner_at_each_step");
        this.symmetric = this.addWidget("toggle", "Symmetric", this.properties.symmetric, "symmetric");

        this.addOutput("Settings", "linear_solver_settings");

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute = function() {
        let myoutput = this.properties;
        // Access the widget values using the instance variables
        myoutput["max_iteration"] = Math.round(this.max_iteration.value);
        myoutput["tolerance"] = this.tolerance.value;
        myoutput["max_levels"] = Math.round(this.max_levels.value);
        myoutput["verbosity"] = Math.round(this.verbosity.value);
        myoutput["scaling"] = this.scaling.value;
        myoutput["reform_preconditioner_at_each_step"] = this.reform_preconditioner_at_each_step.value;
        myoutput["symmetric"] = this.symmetric.value;

        this.setOutputData(0, myoutput);
    }
};

MLSolver.title = "Multi-Level";
MLSolver.desc = "Multi-Level solver from Trilinos";

LiteGraph.registerNodeType("SOLVERS/Linear Solvers/MPI/Multi-Level", MLSolver);

