class AmesosSolver {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf013', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        this.properties = {
            "solver_type": "klu", // Defaulting to "klu" as it seems to be the most common choice.
            "amesos_solver_type": "Amesos_Klu",
            "trilinos_amesos_parameter_list": {}
        };

        // Define the widgets and store them as instance variables
        this.solver_type = this.addWidget("combo", "Solver Type", this.properties.solver_type, "solver_type", { values: ["klu", "super_lu_dist", "mumps", "amesos"] });

        this.addOutput("Settings", "linear_solver_settings");

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute = function() {
        let myoutput = this.properties;
        // Access the widget values using the instance variables
        myoutput["solver_type"] = this.solver_type.value.toLowerCase(); // Ensuring lowercase

        this.setOutputData(0, myoutput);
    }
};

AmesosSolver.title = "Amesos";
AmesosSolver.desc = "Trilinos Amesos-Solver";

LiteGraph.registerNodeType("SOLVERS/Linear Solvers/MPI/Amesos", AmesosSolver);


