function ProjectParameters() {
    this.addInput("problem_data", "map");  // #1
    this.addInput("solver_settings", "solver_settings");  // #2
//
    this.addInput("initial_conditions_process_list", "process_array"); //2
    this.addInput("boundary_conditions_process_list", "process_array");  //3
    this.addInput("auxiliar_process_list", "process_array");  //4
    this.addInput("gravity", "map");  //5
    this.addInput("output_processes", "process_array");  //6

    this.addOutput("project_parameters","map");
    this.size = this.computeSize();
}

ProjectParameters.title = "Project Parameters";
ProjectParameters.desc = "create a Project Parmaters";

ProjectParameters.prototype.onExecute = function() {
    tmp = {};

    tmp["problem_data"] = this.getInputData(0);
    tmp["solver_settings"] = this.getInputData(1);

    tmp["processes"] = {};
    tmp["processes"]["initial_conditions_process_list"] = this.getInputData(2);
    tmp["processes"]["boundary_conditions_process_list"] = this.getInputData(3);
    tmp["processes"]["auxiliar_process_list"] = this.getInputData(4);
    tmp["processes"]["gravity"] = this.getInputData(5);
    tmp["output_processes"] = this.getInputData(6);

    this.setOutputData(0, tmp);
};

LiteGraph.registerNodeType("PROJECT PARAMETERS/ProjectParameters", ProjectParameters);

console.log("ProjectParameters node created"); //helps to debug
