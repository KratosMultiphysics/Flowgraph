class ApplySlipProcess extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addOutput("Process","process_list");
        this.properties = {
            "model_part_name" : "",
            "avoid_recomputing_normals" : false,
            "slip_tangential_correction" : true
        };

        this.size = this.computeSize();
    }

    onExecute()
    {
        let output = {
            "python_module" : "apply_slip_process",
            "kratos_module" : "KratosMultiphysics.FluidDynamicsApplication"
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        
        this.setOutputData(0, [output]);
    }
}

ApplySlipProcess.title = "Apply Slip Process";
ApplySlipProcess.desc = "Node to specify a slip boundary process.";

LiteGraph.registerNodeType("Processes/ApplySlipProcess", ApplySlipProcess);

console.log("ApplySlipProcess node created"); //helps to debug
