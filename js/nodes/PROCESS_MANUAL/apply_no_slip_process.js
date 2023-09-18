class ApplyNoSlipProcess extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addOutput("Process","process_list");
        this.properties = {
            "model_part_name" : "",
            "variable_name"        : "VELOCITY",
            "interval"             : [0.0, 1e30],
            "value"                : [0.0, 0.0, 0.0],
            "constrained"          : [true,true,true]
        };

        this.size = this.computeSize();
    }

    onExecute()
    {
        let output = {
            "python_module" : "apply_noslip_process",
            "kratos_module" : "KratosMultiphysics.FluidDynamicsApplication"
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        
        this.setOutputData(0, [output]);
    }
}

ApplyNoSlipProcess.title = "Apply No-slip Process";
ApplyNoSlipProcess.desc = "Node to specify a no-slip boundary process.";

LiteGraph.registerNodeType("Processes/ApplyNo-SlipProcess", ApplyNoSlipProcess);

console.log("ApplyNoSlipProcess node created"); //helps to debug
