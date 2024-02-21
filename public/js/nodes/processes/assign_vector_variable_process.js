class AssignVectorVariableProcess extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addInput("value","array");
        this.addOutput("Process","process_list");

        this.variable_name = this.addWidget("string","Variable=", "", function(v){} );

        this.properties = {
            "interval"        : [0.0, 1e30],
            "constrained"     : [true,true,true],
            "local_axes"      : {}
        }

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        let output = {
            "python_module" : "assign_vector_variable_process",
            "kratos_module" : "KratosMultiphysics"
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        output["Parameters"]["value"] = this.getInputData(1)
        output["Parameters"]["variable_name"] = this.variable_name.value

        this.setOutputData(0, [output]);
    };
}

AssignVectorVariableProcess.title = "Assign vector variable";
AssignVectorVariableProcess.desc = "Sets a given vector for a certain variable to all the nodes of a submodelpart";

LiteGraph.registerNodeType("Processes/AssignVectorVariableProcess", AssignVectorVariableProcess);

console.log("AssignVectorVariableProcess node created"); //helps to debug
