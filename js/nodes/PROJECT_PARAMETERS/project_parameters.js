function ProjectParameters() {
    this.addInput("General", "problem_data");  // 0
    this.addInput("Solver", "solver_settings");  // 1
    this.addInput("Processes: Initial conditions", "processes");  // 2
    this.addInput("Processes: Boundary conditions", "processes");  // 3
    this.addInput("Processes: Other", "processes");  // 4
    this.addInput("Output Processes", "output_processes");  // 5
    this.addOutput("Project Parameters (json)","json");
//    this.addInput("gravity", "map");
    this.size = this.computeSize();
}

ProjectParameters.title = "PROJECT PARAMETERS";
ProjectParameters.desc = "Main Project-Parameters level. Start here.";

ProjectParameters.prototype.onExecute = function() {
    tmp = {};

    tmp["problem_data"] = this.getInputData(0);
    tmp["solver_settings"] = this.getInputData(1);
    tmp["processes"] = {};
    tmp["processes"]["initial_conditions_process_list"] = this.getInputData(2);
    tmp["processes"]["boundary_conditions_process_list"] = this.getInputData(3);
    tmp["processes"]["auxiliar_process_list"] = this.getInputData(4);
    tmp["output_processes"] = this.getInputData(5);
//    tmp["processes"]["gravity"] = this.getInputData(5);

    this.setOutputData(0, tmp);
};

LiteGraph.registerNodeType("PROJECT PARAMETERS/0", ProjectParameters);
