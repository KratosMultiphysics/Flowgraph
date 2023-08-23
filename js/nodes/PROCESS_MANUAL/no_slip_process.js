class NoSlipProcess extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addOutput("Process","process_list");
        this.properties = {
            "model_part_name" : ""
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

NoSlipProcess.title = "No-slip process";
NoSlipProcess.desc = "Node to specify a no-slip boundary process.";

LiteGraph.registerNodeType("Processes/No-Slip Process", NoSlipProcess);

console.log("NoSlipProcess node created"); //helps to debug
