class AztecSolver {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf013', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        this.properties = {
            "solver_type": "aztec",
            "tolerance": 1.0e-6,
            "max_iteration": 200,
            "preconditioner_type": "none",
            "overlap_level": 1,
            "gmres_krylov_space_dimension": 100,
            "scaling": false,
            "verbosity": 0,
            "trilinos_aztec_parameter_list": {},
            "trilinos_preconditioner_parameter_list": {}
        };

        // Define the widgets and store them as instance variables
        this.tolerance = this.addWidget("number", "Tolerance", this.properties.tolerance, "tolerance", { step: 0.000001, precision: 6 });
        this.max_iteration = this.addWidget("number", "Max Iteration", this.properties.max_iteration, "max_iteration", { step: 1, precision: 0 });
        this.preconditioner_type = this.addWidget("combo", "Preconditioner", this.properties.preconditioner_type, "preconditioner_type", { values: ["none", "diagonal", "ilu0", "ilut", "iluk", "damped_jacobi", "gauss_seidel", "chebyshev"] });
        this.overlap_level = this.addWidget("number", "Overlap Level", this.properties.overlap_level, "overlap_level", { step: 1, precision: 0 });
        this.gmres_krylov_space_dimension = this.addWidget("number", "GMRES Krylov Space Dimension", this.properties.gmres_krylov_space_dimension, "gmres_krylov_space_dimension", { step: 1, precision: 0 });
        this.scaling = this.addWidget("toggle", "Scaling", this.properties.scaling, "scaling");
        this.verbosity = this.addWidget("number", "Verbosity", this.properties.verbosity, "verbosity", { step: 1, precision: 0 });

        this.addOutput("Settings", "linear_solver_settings");

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute = function() {
        let myoutput = this.properties;
        // Access the widget values using the instance variables
        myoutput["tolerance"] = this.tolerance.value;
        myoutput["max_iteration"] = Math.round(this.max_iteration.value);
        myoutput["preconditioner_type"] = this.preconditioner_type.value;
        myoutput["overlap_level"] = Math.round(this.overlap_level.value);
        myoutput["gmres_krylov_space_dimension"] = Math.round(this.gmres_krylov_space_dimension.value);
        myoutput["scaling"] = this.scaling.value;
        myoutput["verbosity"] = Math.round(this.verbosity.value);

        this.setOutputData(0, myoutput);
    }
};

AztecSolver.title = "Aztec";
AztecSolver.desc = "Aztec linear solver for MPI";

LiteGraph.registerNodeType("SOLVERS/Linear Solvers/MPI/Aztec", AztecSolver);
