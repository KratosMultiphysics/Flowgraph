function TimeStepping() {

    this.output = {
        "automatic_time_step": false,
        "time_step": -1,
        //"time_step_table": [[0.1, 0.1],[0.2, 0.2]]
    }

    this.automatic_time_step = this.addWidget("combo", "Auto stepping", "false",
        function(v) {}, {
            values: ["false", "true"]
        });
    this.time_step = this.addWidget("number", "Time step", 0.1,
        function(v) {}, {
            min: 0, max: 100,
        });

    this.addOutput("Time stepping", "time");
    this.size = this.computeSize();
}

TimeStepping.prototype.onExecute = function() {

    this.output["automatic_time_step"] = this.automatic_time_step.value;
    this.output["time_step"] = this.time_step.value;
    //this.output["time_step_table"] = this.time_step_table.value;

    this.setOutputData(0, this.output);
};

TimeStepping.title = "Time Stepping";
TimeStepping.desc = "Set time stepping";
LiteGraph.registerNodeType("Solvers/TimeStepping", TimeStepping);
