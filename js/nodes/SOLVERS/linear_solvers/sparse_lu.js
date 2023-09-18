class SparseLUSolver {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf013', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        this.properties = {
            "solver_type": "LinearSolversApplication.sparse_lu"
        };

        this.addOutput("Settings", "linear_solver_settings");

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute = function() {
        this.setOutputData(0, this.properties);
    }
};

SparseLUSolver.title = "SparseLU";
SparseLUSolver.desc = "SparseLU linear solver from LinearSolversApplication";

LiteGraph.registerNodeType("SOLVERS/Linear Solvers/SparseLU", SparseLUSolver);
