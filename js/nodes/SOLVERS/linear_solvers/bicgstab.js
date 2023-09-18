class BICGSTABSolver {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf013', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        this.properties = {
            "solver_type": "BICGSTAB",
            "tolerance": 0.000001,
            "max_iteration": 1000,
            "verbosity": 1,
            "preconditioner_type": "none"
        };
        var that = this;

        // Define the widgets and store them as instance variables
        this.tolerance = this.addWidget("number", "Tolerance", this.properties.tolerance, "tolerance", { step: 0.000001, precision: 6 });
        this.max_iteration = this.addWidget("number", "Max Iteration", this.properties.max_iteration, "max_iteration", { step: 1, precision: 0 });
        this.verbosity = this.addWidget("number", "Verbosity", this.properties.verbosity, "verbosity", { step: 1, precision: 0 });
        this.preconditioner_type = this.addWidget("combo", "Preconditioner", this.properties.preconditioner_type, "preconditioner_type", { values: ["none", "diagonal", "ilu0", "ilut", "iluk", "damped_jacobi", "gauss_seidel", "chebyshev"] });

        this.addOutput("Settings", "linear_solver_settings");

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute = function() {
        let myoutput = this.properties;
        // Access the widget values using the instance variables
        myoutput["tolerance"] = this.tolerance.value;
        myoutput["max_iteration"] = this.max_iteration.value;
        myoutput["verbosity"] = this.verbosity.value;
        myoutput["preconditioner_type"] = this.preconditioner_type.value;

        this.setOutputData(0, myoutput);
    }
};

BICGSTABSolver.title = "BICGSTAB";
BICGSTABSolver.desc = "Biconjugate gradient stabilized linear solver";

LiteGraph.registerNodeType("SOLVERS/Linear Solvers/BICGSTAB", BICGSTABSolver);

// const l_solver_color = "#7a8ec4";
// LGraphCanvas.link_type_colors["linear_solver_settings"] = l_solver_color;
// LGraphCanvas.slot_type_colors["linear_solver_settings"] = l_solver_color;
