class ApplyOutletProcess extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addOutput("Process","process_list");

        this.properties = {
            "variable_name"      : "PRESSURE",
            "constrained"        : true,
            "value"              : 0.0,
            "hydrostatic_outlet" : false,
            "h_top"              : 0.0
        }

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        let output =     {
            "python_module" : "apply_outlet_process",
            "kratos_module" : "KratosMultiphysics.FluidDynamicsApplication"
        }
        
        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
    
        this.setOutputData(0, [output]);
    };
}

ApplyOutletProcess.title = "Apply Outlet Process";
ApplyOutletProcess.desc = "Define outlet";

LiteGraph.registerNodeType("Processes/ApplyOutletProcess", ApplyOutletProcess);

console.log("ApplyOutletProcess created"); //helps to debug
