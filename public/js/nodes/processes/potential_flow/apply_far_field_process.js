import { Process } from "/js/nodes/processes/base/process.js";

class ApplyFarFieldProcess extends Process {
    constructor() {
        super();

        this.addInput("model_part","string");
        this.addOutput("Process","process_list");

        this.angle_of_attack = this.addWidget("string","Angle of attack", "0.0", function(v){} );
        this.mach_infinity = this.addWidget("string","Mach Infinity", "0.8", function(v){} );
        this.speed_of_sound = this.addWidget("string","Sound Speed", "332.0", function(v){} );

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        let output = {
            "python_module" : "apply_far_field_process",
            "kratos_module" : "KratosMultiphysics.CompressiblePotentialFlowApplication",
            "process_name"  : "FarFieldProcess",
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0);
        output["Parameters"]["angle_of_attack"] = parseFloat(this.angle_of_attack.value);
        output["Parameters"]["mach_infinity"]   = parseFloat(this.mach_infinity.value);
        output["Parameters"]["speed_of_sound"]  = parseFloat(this.speed_of_sound.value);

        this.setOutputData(0, [output]);
    };
}

ApplyFarFieldProcess.title = "Apply far field process";
ApplyFarFieldProcess.desc = "Applies a far field condition to a model part.";

LiteGraph.registerNodeType("Processes/Potential flow/ApplyFarFieldProcess", ApplyFarFieldProcess);

console.log("ApplyFarFieldProcess node created"); //helps to debug
