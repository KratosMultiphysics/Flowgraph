class AssignVectorVariableToConditionsProcess extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addInput("value","array");
        this.addInput("entities","array")
        this.addOutput("Process","process_list");

        this.variable_name = this.addWidget("string","Variable=", "", function(v){} );

        this.properties = {
            "interval"        : [0.0, 1e30],
            "local_axes"      : {}
        }

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        let output = {
            "python_module" : "assign_vector_variable_to_conditions_process",
            "kratos_module" : "KratosMultiphysics"
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        output["Parameters"]["value"] = this.getInputData(1)
        output["Parameters"]["entities"] = this.getInputData(2)
        output["Parameters"]["variable_name"] = this.variable_name.value

        this.setOutputData(0, [output]);
    };
}

AssignVectorVariableToConditionsProcess.title = "Assign vector variable to conditions";
AssignVectorVariableToConditionsProcess.desc = "Sets a given vector to the conditions belonging to a certain submodelpart";

LiteGraph.registerNodeType("Processes/AssignVectorVariableToConditionsProcess", AssignVectorVariableToConditionsProcess);

console.log("AssignVectorVariableToConditionsProcess node created"); //helps to debug
