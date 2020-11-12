class NoSlipProcess {
    constructor()
    {
        this.addInput("model_part","string");
        this.addOutput("Process","process");
        this.properties = {
            "model_part_name" : ""
        };

        this.size = this.computeSize();
    }

    onExecute()
    {
        output = {
            "python_module" : "apply_noslip_process",
            "kratos_module" : "KratosMultiphysics.FluidDynamicsApplication"
        }
        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        this.setOutputData(0, output);
    }
}

NoSlipProcess.title = "No-slip process";
NoSlipProcess.desc = "Node to specify a no-slip boundary process.";

LiteGraph.registerNodeType("processes/NoSlipProcess", NoSlipProcess);

console.log("NoSlipProcess node created"); //helps to debug