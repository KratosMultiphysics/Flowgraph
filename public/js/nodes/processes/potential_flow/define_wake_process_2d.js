import { Process } from "/js/nodes/processes/base/process.js";

class DefineWakeProcess2D extends Process {
    constructor() {
        super();

        this.addInput("model_part","string");
        this.addOutput("Process","process_list");

        this.angle_of_attack = this.addWidget("string","Epsilon", "1e-9", function(v){} );
        this.echo_level = this.addWidget("combo", "Echo level", 0, function(v) {}, {
            values: [0, 1, 2, 3]
        });

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        let output = {
            "python_module" : "define_wake_process_2d",
            "kratos_module" : "KratosMultiphysics.CompressiblePotentialFlowApplication",
            "process_name"  : "DefineWakeProcess2D",
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        output["Parameters"]["epsilon"]         = parseFloat(this.angle_of_attack.value);
        output["Parameters"]["echo_level"]      = parseFloat(this.echo_level.value);

        this.setOutputData(0, [output]);
    };
}

DefineWakeProcess2D.title = "Define wake process (2D)";
DefineWakeProcess2D.desc = "Defines the wake in 2D.";

LiteGraph.registerNodeType("Processes/Potential flow/DefineWakeProcess2D", DefineWakeProcess2D);

console.log("DefineWakeProcess2D node created"); //helps to debug
