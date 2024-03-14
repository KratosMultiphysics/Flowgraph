import { Process } from "/js/nodes/processes/base/process.js";

class ApplyInletProcess extends Process {
    constructor() {
        super();

        this.addInput("model_part","string");
        this.addOutput("Process","process_list");

        this.variable_name = this.addWidget("string","Variable=", "VELOCITY", function(v){} );
        this.modulus = this.addWidget("string","f(x,y,z,t)=", "", function(v){} );
        this.direction = this.addWidget("string","Direction=", "automatic_inwards_normal", function(v){} );

        this.properties = {
            "interval" : [0, 1e30]
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
        output["Parameters"]["variable_name"] = this.variable_name.value
        output["Parameters"]["modulus"] = this.modulus.value
        output["Parameters"]["direction"] = this.direction.value

        this.setOutputData(0, [output]);
    };
}

ApplyInletProcess.title = "Apply inlet process";
ApplyInletProcess.desc = "Define inlet.";

LiteGraph.registerNodeType("Processes/Fluid dynamics/ApplyInletProcess", ApplyInletProcess);

console.log("ApplyInletProcess node created"); //helps to debug
