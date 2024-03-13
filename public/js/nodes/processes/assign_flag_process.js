import { Process } from "/js/nodes/processes/process.js";

class AssignFlagProcess extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addInput("entities","array");
        this.addOutput("Process","process_list");

        this.flag_name = this.addWidget("string","Flag name=", "", function(v){} );
        this.boolean_value = this.addWidget("toggle","Value", true, function(v){}, { on: "true", off:"false"} );
        
        this.properties = {
            "interval"        : [0.0, 1e30]
        }

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        let output = {
            "python_module" : "assign_flag_process",
            "kratos_module" : "KratosMultiphysics"
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        output["Parameters"]["entities"] = this.getInputData(1)
        output["Parameters"]["flag_name"] = this.flag_name.value
        output["Parameters"]["value"] = this.boolean_value.value

        this.setOutputData(0, [output]);
    };
}

AssignFlagProcess.title = "Assign flag value";
AssignFlagProcess.desc = "Sets a given value for a certain flag in all the given entities of a submodelpart";

LiteGraph.registerNodeType("Processes/AssignFlagProcess", AssignFlagProcess);

console.log("AssignFlagProcess node created"); //helps to debug
