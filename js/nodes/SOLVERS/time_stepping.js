function TimeStepping() {

    this.properties = {
        "automatic_time_step": false,
        "time_step": 0.1,
    }

    this.addOutput("Time stepping","time");
//    this.addOutput("problem_name","string");
//    this.addOutput("start_time","number");
//    this.addOutput("end_time","number");
    this.size = this.computeSize();
}

TimeStepping.title = "Time Stepping";
TimeStepping.desc = "Set time stepping";

TimeStepping.prototype.onExecute = function() {
    this.setOutputData(0, this.properties);
//    this.setOutputData(1, this.properties["problem_name"]);
//    this.setOutputData(2, this.properties["start_time"]);
//    this.setOutputData(3, this.properties["end_time"]);
};

LiteGraph.registerNodeType("SOLVERS/TimeStepping", TimeStepping);
