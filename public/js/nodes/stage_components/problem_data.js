class ProblemData {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf56e', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // set inputs

        // set outputs
        this.addOutput("Output", "problem_data");

        // set properties
        this.properties = {
            "problem_name"  : "KratosProblem",
            "parallel_type" : "OpenMP",
            "echo_level"    : 0,
            "start_time"    : 0.0,
            "end_time"     : 1.0
        };

        // set widgets
        this.problem_name   = this.addWidget("string", "Name", this.properties["problem_name"]);
        this.echo_level     = this.addWidget("combo", "Parallel Type", this.properties["parallel_type"], { property:"parallel_type", values: ["Serial", "OpenMP", "MPI"]});
        this.echo_level     = this.addWidget("combo", "Echo level", this.properties["echo_level"], { property:"echo_level", values: [0, 1, 2, 3]});
        this.start_time     = this.addWidget("number", "Start Time", this.properties["start_time"], "start_time", {step: 0.1});
        this.stop_time      = this.addWidget("number", "End Time", this.properties["end_time"], "end_time", {step: 0.1});
    }

    onExecute() {
        this._value = Object.assign({}, this.properties);
        this.setOutputData(0, this._value);
    }
}

ProblemData.title = "Problem Data";
ProblemData.desc = "General configutation of the problem";

LiteGraph.registerNodeType("Stage components/Problem Data", ProblemData);

console.log("ProblemData node created"); //helps to debug

// Register default i/o
register_default_out_type("problem_data", "Stage components/Analysis stages/AnalysisStage");