import { Process } from "/js/nodes/processes/process.js";

class AssignScalarVariableToConditionsProcess extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addInput("entities","array");
        this.addOutput("Process","process_list");

        this.scalar_value = this.addWidget("number", "Value", 0,
            function(v) {}, {
                min: 0,
                max: 10000,
                step: 0.01,
            }
        );
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
            "python_module" : "assign_scalar_variable_to_conditions_process",
            "kratos_module" : "KratosMultiphysics"
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        output["Parameters"]["value"] = this.scalar_value.value
        output["Parameters"]["entities"] = this.getInputData(1)
        output["Parameters"]["variable_name"] = this.variable_name.value

        this.setOutputData(0, [output]);
    };
}

AssignScalarVariableToConditionsProcess.title = "Assign scalar variable to conditions";
AssignScalarVariableToConditionsProcess.desc = "Sets a variable a certain scalar value for all the conditions belonging to a submodelpart. Uses assign_scalar_variable_to_conditions_process for each component";

LiteGraph.registerNodeType("Processes/AssignScalarVariableToConditionsProcess", AssignScalarVariableToConditionsProcess);

console.log("AssignScalarVariableToConditionsProcess node created"); //helps to debug
