class ApplyInletByFunction extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addOutput("Process","process_list");

        this.modulus = this.addWidget("string","f(x,y,z,t)=", "", function(v){} );

        this.properties = {
            "variable_name"   : "VELOCITY",
            "interval"        : [0,"End"],
            "direction"       : "automatic_inwards_normal"
        }

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        let output = {
            "python_module" : "apply_inlet_process",
            "kratos_module" : "KratosMultiphysics.FluidDynamicsApplication"
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        output["Parameters"]["modulus"] = this.modulus.value

        this.setOutputData(0, [output]);
    };
}

ApplyInletByFunction.title = "Apply Inlet By Function";
ApplyInletByFunction.desc = "Define inlet";

LiteGraph.registerNodeType("Processes/ApplyInletByFunction", ApplyInletByFunction);

console.log("ApplyInletByFunction node created"); //helps to debug
