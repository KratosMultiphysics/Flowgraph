import { Process } from "/js/nodes/processes/process.js";

class ApplyOutletProcess extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addOutput("Process","process_list");

        this.variable_name = this.addWidget("string","Variable=", "PRESSURE", function(v){} );
        this.value = this.addWidget("number", "Value=", 0, function(v) {});

        this.properties = {
            "constrained"        : true,
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
        output["Parameters"]["variable_name"] = this.variable_name.value
        output["Parameters"]["value"] = this.value.value
    
        this.setOutputData(0, [output]);
    };
}

ApplyOutletProcess.title = "Apply Outlet Process";
ApplyOutletProcess.desc = "Define outlet";

LiteGraph.registerNodeType("Processes/ApplyOutletProcess", ApplyOutletProcess);

console.log("ApplyOutletProcess created"); //helps to debug
