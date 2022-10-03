function ProjectParameters() {
    this.addInput("problem_data", "map");
//
    this.addInput("solver_settings", "solver_settings");
    this.addInput("initial_conditions_process_list", "process_array");
    this.addInput("boundary_conditions_process_list", "process_array");
    this.addInput("gravity", "map");
    this.addInput("auxiliar_process_list", "process_array");
    this.addInput("output_processes", "process_array");

    this.addOutput("project_parameters","map");
    this.size = this.computeSize();
}

ProjectParameters.title = "Project Parameters";
ProjectParameters.desc = "create a Project Parmaters";

ProjectParameters.prototype.onExecute = function() {
    tmp = {};

    tmp["problem_data"] = this.getInputData(0);
    tmp["output_processes"] = this.getInputData(1);
    tmp["solver_settings"] = this.getInputData(2);

    tmp["processes"] = {};
    tmp["processes"]["initial_conditions_process_list"] = this.getInputData(3);
    tmp["processes"]["boundary_conditions_process_list"] = this.getInputData(4);
    tmp["processes"]["gravity"] = this.getInputData(5);
    tmp["processes"]["auxiliar_process_list"] = this.getInputData(6);

    this.setOutputData(0, tmp);
};

LiteGraph.registerNodeType("PARAMETERS/ProjectParameters", ProjectParameters);

console.log("ProjectParameters node created"); //helps to debug
