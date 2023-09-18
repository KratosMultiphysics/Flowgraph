class AMGCLSolver {
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
        this.coarsening_type = this.addWidget("combo", "Coarsening", this.properties.coarsening_type, "coarsening_type", { values: ["ruge_stuben", "aggregation", "smoothed_aggregation", "smoothed_aggr_emin"] });
        this.smoother_type = this.addWidget("combo", "Smoother", this.properties.smoother_type, "smoother_type", { values: ["spai0", "spai1", "ilu0", "ilut", "iluk", "damped_jacobi", "gauss_seidel", "chebyshev"] });
        this.krylov_type = this.addWidget("combo", "Krylov", this.properties.krylov_type, "krylov_type", { values: ["gmres", "bicgstab", "cg", "bicgstabl", "lgmres", "fgmres", "bicgstab_with_gmres_fallback", "idrs"] });
        this.preconditioner_type = this.addWidget("combo", "Preconditioner", this.properties.preconditioner_type, "preconditioner_type", { values: ["diagonal", "ilu0", "ilut", "iluk", "damped_jacobi", "gauss_seidel", "chebyshev"] });
        this.scaling_type = this.addWidget("combo", "Scaling", this.properties.scaling, "scaling", { values: ["standard", "advanced"] });
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

AMGCLSolver.title = "AMGCL";
AMGCLSolver.desc = "Description for AMGCL";

LiteGraph.registerNodeType("SOLVERS/Linear Solvers/AMGCL", AMGCLSolver);

const l_solver_color = "#7a8ec4";
LGraphCanvas.link_type_colors["linear_solver_settings"] = l_solver_color;
LGraphCanvas.slot_type_colors["linear_solver_settings"] = l_solver_color;

