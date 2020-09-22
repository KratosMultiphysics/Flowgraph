function ProblemData() {

    this.properties = {
        "problem_name"  : "riccardo",
        "parallel_type" : "OpenMP",
        "echo_level"    : 0,
        "start_time"    : 0.0,
        "end_time"      : 45
    }

    this.addOutput("problem_data","map");
    this.addOutput("problem_name","string");
    this.addOutput("start_time","number");
    this.addOutput("end_time","number");
    this.size = this.computeSize();
}

ProblemData.title = "Problem Data";
ProblemData.desc = "Create a problem_data";

ProblemData.prototype.onExecute = function() {
    this.setOutputData(0, this.properties);
    this.setOutputData(1, this.properties["problem_name"]);
    this.setOutputData(2, this.properties["start_time"]);
    this.setOutputData(3, this.properties["end_time"]);
};

LiteGraph.registerNodeType("parameters/ProblemData", ProblemData);

console.log("ProblemData node created"); //helps to debug

function ProjectParameters() {
    this.addInput("problem_data", "map");
    this.addInput("output_processes", "process_array");
    this.addInput("solver_settings", "map");
    this.addInput("initial_conditions_process_list", "process_array");
    this.addInput("boundary_conditions_process_list", "process_array");
    this.addInput("gravity", "map");
    this.addInput("auxiliar_process_list", "process_array");
    
    this.addOutput("project_parameters","map");
    this.size = this.computeSize();
}

ProjectParameters.title = "Project Parameters";
ProjectParameters.desc = "create a Project Parmaters";

ProjectParameters.prototype.onExecute = function() {
    tmp = {};
    tmp["processes"] = {};

    tmp["problem_data"] = this.getInputData(0); //0
    tmp["output_processes"] = this.getInputData(1); //1
    tmp["solver_settings"] = this.getInputData(2); //2
    tmp["processes"]["initial_conditions_process_list"] = this.getInputData(3); //3
    tmp["processes"]["boundary_conditions_process_list"] = this.getInputData(4);
    tmp["processes"]["gravity"] = this.getInputData(5);
    tmp["processes"]["auxiliar_process_list"] = this.getInputData(6); //6

    this.setOutputData(0, tmp);
};

LiteGraph.registerNodeType("parameters/ProjectParameters", ProjectParameters);

console.log("ProjectParameters node created"); //helps to debug

