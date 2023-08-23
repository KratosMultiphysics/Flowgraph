class OutletProcess extends Process {
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

OutletProcess.title = "Outlet Process";
OutletProcess.desc = "Define outlet";

LiteGraph.registerNodeType("Processes/OutletProcess", OutletProcess);

console.log("OutletProcess created"); //helps to debug
