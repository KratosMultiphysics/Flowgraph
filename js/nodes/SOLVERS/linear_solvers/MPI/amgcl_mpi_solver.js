class AMGCLMPISolver {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf013', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        this.properties = {
            "solver_type": "AMGCL",
            "provide_coordinates": false,
            "max_iteration": 100,
            "gmres_krylov_space_dimension": 100,
            "verbosity": 1,
            "tolerance": 1e-6,
            "scaling": false,
            "block_size": 1,
            "use_block_matrices_if_possible": true,
            "enforce_use_block_matrices": false,
            "coarse_enough": 1000,
            "max_levels": -1,
            "pre_sweeps": 1,
            "post_sweeps": 1,
            "use_gpgpu": false,
            "preconditioner_type": "amg"
        };

        var that = this;

        // Define the widgets and store them as instance variables
        this.max_iteration = this.addWidget("number", "Max Iteration", this.properties.max_iteration, "max_iteration", { step: 1, precision: 0 });
        this.gmres_krylov_space_dimension = this.addWidget("number", "GMRES Krylov Space Dimension", this.properties.gmres_krylov_space_dimension, "gmres_krylov_space_dimension", { step: 1, precision: 0 });
        this.verbosity = this.addWidget("number", "Verbosity", this.properties.verbosity, "verbosity", { step: 1, precision: 0 });
        this.tolerance = this.addWidget("number", "Tolerance", this.properties.tolerance, "tolerance", { step: 0.000001, precision: 6 });
        this.block_size = this.addWidget("number", "Block Size", this.properties.block_size, "block_size", { step: 1, precision: 0 });
        this.coarse_enough = this.addWidget("number", "Coarse Enough", this.properties.coarse_enough, "coarse_enough", { step: 1, precision: 0 });
        this.max_levels = this.addWidget("number", "Max Levels", this.properties.max_levels, "max_levels", { step: 1, precision: 0 });
        this.pre_sweeps = this.addWidget("number", "Pre Sweeps", this.properties.pre_sweeps, "pre_sweeps", { step: 1, precision: 0 });
        this.post_sweeps = this.addWidget("number", "Post Sweeps", this.properties.post_sweeps, "post_sweeps", { step: 1, precision: 0 });

        this.coarsening_type = this.addWidget("combo", "Coarsening", this.properties.coarsening_type, "coarsening_type", { values: ["ruge_stuben", "aggregation", "smoothed_aggregation", "smoothed_aggr_emin"] });
        this.smoother_type = this.addWidget("combo", "Smoother", this.properties.smoother_type, "smoother_type", { values: ["spai0", "spai1", "ilu0", "ilut", "iluk", "damped_jacobi", "gauss_seidel", "chebyshev"] });
        this.krylov_type = this.addWidget("combo", "Krylov", this.properties.krylov_type, "krylov_type", { values: ["gmres", "bicgstab", "cg", "bicgstabl", "lgmres", "fgmres", "bicgstab_with_gmres_fallback", "idrs"] });
        this.preconditioner_type = this.addWidget("combo", "Preconditioner", this.properties.preconditioner_type, "preconditioner_type", { values: ["diagonal", "ilu0", "ilut", "iluk", "damped_jacobi", "gauss_seidel", "chebyshev"] });
        this.scaling_type = this.addWidget("toggle", "Scaling", this.properties.scaling, "scaling");
        this.use_amg_preconditioning = this.addWidget("toggle", "Use AMG Preconditioning", this.properties.use_amg_preconditioning, "use_amg_preconditioning");
        this.provide_coordinates = this.addWidget("toggle", "Provide Coordinates", this.properties.provide_coordinates, "provide_coordinates");
        this.use_block_matrices_if_possible = this.addWidget("toggle", "Use Block Matrices If Possible", this.properties.use_block_matrices_if_possible, "use_block_matrices_if_possible");
        this.enforce_use_block_matrices = this.addWidget("toggle", "Enforce Use of Block Matrices", this.properties.enforce_use_block_matrices, "enforce_use_block_matrices");

        this.addOutput("Settings", "linear_solver_settings");

        this.size = this.computeSize();
        this.serialize_widgets = true;

    }

    onExecute = function() {
        let myoutput = this.properties;
        // Access the widget values using the instance variables
        myoutput["max_iteration"] = Math.round(this.max_iteration.value);
        myoutput["gmres_krylov_space_dimension"] = Math.round(this.gmres_krylov_space_dimension.value);
        myoutput["verbosity"] = Math.round(this.verbosity.value);
        myoutput["tolerance"] = this.tolerance.value;
        myoutput["block_size"] = Math.round(this.block_size.value);
        myoutput["coarse_enough"] = Math.round(this.coarse_enough.value);
        myoutput["max_levels"] = Math.round(this.max_levels.value);
        myoutput["pre_sweeps"] = Math.round(this.pre_sweeps.value);
        myoutput["post_sweeps"] = Math.round(this.post_sweeps.value);
        myoutput["coarsening_type"] = this.coarsening_type.value;
        myoutput["smoother_type"] = this.smoother_type.value;
        myoutput["krylov_type"] = this.krylov_type.value;
        myoutput["preconditioner_type"] = this.preconditioner_type.value;
        myoutput["scaling_type"] = this.scaling_type.value;
        myoutput["use_amg_preconditioning"] = this.use_amg_preconditioning.value;
        myoutput["provide_coordinates"] = this.provide_coordinates.value;
        myoutput["use_block_matrices_if_possible"] = this.use_block_matrices_if_possible.value;
        myoutput["enforce_use_block_matrices"] = this.enforce_use_block_matrices.value;

        this.setOutputData(0, myoutput);
    }
};

AMGCLMPISolver.title = "AMGCL MPI";
AMGCLMPISolver.desc = "MPI version of AMGCL";

LiteGraph.registerNodeType("SOLVERS/Linear Solvers/MPI/AMGCL", AMGCLMPISolver);
