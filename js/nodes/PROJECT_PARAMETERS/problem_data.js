function ProblemData() {

    this.properties = {
        "problem_name"  : "Name",
        "parallel_type" : "OpenMP",
        "echo_level"    : 0,
        "start_time"    : 0.0,
        "end_time"      : 45
    }

    this.addOutput("General","problem_data");
//    this.addOutput("problem_name","string");
//    this.addOutput("start_time","number");
//    this.addOutput("end_time","number");
    this.size = this.computeSize();
}

ProblemData.title = "General Settings";
ProblemData.desc = "Create a problem_data";

ProblemData.prototype.onExecute = function() {
    this.setOutputData(0, this.properties);
//    this.setOutputData(1, this.properties["problem_name"]);
//    this.setOutputData(2, this.properties["start_time"]);
//    this.setOutputData(3, this.properties["end_time"]);
};

LiteGraph.registerNodeType("PROJECT PARAMETERS/1", ProblemData);

console.log("ProblemData node created"); //helps to debug
