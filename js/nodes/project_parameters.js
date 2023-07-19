class ProjectParameters {

    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf0ad', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        this.size = this.computeSize();

        // set inputs
        let iidx = 0
        this.isolver = iidx++;
        this.addInput("Solver", "solver_settings");
        this.iprocinit = iidx++;
        this.addInput("Processes: Initial conditions", "processes");
        this.iprocbound = iidx++;
        this.addInput("Processes: Boundary conditions", "processes");
        this.iprocother = iidx++;
        this.addInput("Processes: Other", "processes");
        this.iprocout = iidx++;
        this.addInput("Output Processes", "output_processes");

        // set outputs

        this.addOutput("Project Parameters (json)", 0);

        // properties

        this.properties = {
            "problem_data": {
                "problem_name": "",
                "parallel_type": "",
                "echo_level": -1,
                "start_time": -1,
                "end_time": -1,
            },
            "solver_settings": {},
            "processes": {
                "initial_conditions_process_list": [],
                "boundary_conditions_process_list": [],
                "auxiliar_process_list": [],
            },
            "output_processes": {},
        }

        this.problem_name = this.addWidget("text", "Problem name", "UNSET",
            function(v) {}, {}
        );
        this.parallel_type = this.addWidget("combo", "Parallel type", "OpenMP",
            function(v) {}, {
                values: ["OpenMP", "MPI", ]
            });
        this.echo_level = this.addWidget("combo", "Echo level", 0,
            function(v) {}, {
                values: [0, 1, 2, 3]
            });
        this.start_time = this.addWidget("number", "Start time", 0,
            function(v) {}, {
                min: 0,
                max: 10000,
                step: 0.01,
            }
        );
        this.end_time = this.addWidget("number", "End time", 1,
            function(v) {}, {
                min: 0,
                max: 10000,
                step: 0.01,
            }
        );
    }

    onExecute() {
        this.output = Object.assign({}, this.properties);
        let val;
        let idx;

        idx = this.isolver;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this.output["solver_settings"] = val;
        }

        idx = this.iprocinit;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this.output["processes"]["initial_conditions_process_list"] = val;
        }

        idx = this.iprocbound;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this.output["processes"]["boundary_conditions_process_list"] = val;
        }

        idx = this.iprocother;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this.output["processes"]["auxiliar_process_list"] = val;
        }

        idx = this.iprocout;
        if (this.getInputData(idx) != undefined) {
            val = this.getInputData(idx);
            this.output["output_processes"] = val;
        }

        this.output["problem_data"]["problem_name"] = this.problem_name.value
        this.output["problem_data"]["parallel_type"] = this.parallel_type.value
        this.output["problem_data"]["echo_level"] = this.echo_level.value
        this.output["problem_data"]["start_time"] = this.start_time.value
        this.output["problem_data"]["end_time"] = this.end_time.value

        this.setOutputData(0, this.output);
    }
}

ProjectParameters.title = "Project Parameters";
ProjectParameters.desc = "Main Project-Parameters level. Start here.";

LiteGraph.registerNodeType("START HERE/ProjectParameters", ProjectParameters);
