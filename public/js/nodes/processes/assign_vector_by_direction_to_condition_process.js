import { Process } from "/js/nodes/processes/base/process.js";

class AssignVectorByDirectionToConditionProcess extends Process {
    constructor() {
        super();

        this.addInput("model_part","string");
        this.addInput("direction","array");
        this.addInput("entities","array");
        this.addOutput("Process","process_list");

        this.modulus = this.addWidget("number", "Modulus", 0,
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
            "python_module" : "assign_vector_by_direction_to_condition_process",
            "kratos_module" : "KratosMultiphysics"
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        output["Parameters"]["modulus"] = this.modulus.value
        output["Parameters"]["direction"] = this.getInputData(1)
        output["Parameters"]["entities"] = this.getInputData(2)
        output["Parameters"]["variable_name"] = this.variable_name.value

        this.setOutputData(0, [output]);
    };
}

AssignVectorByDirectionToConditionProcess.title = "Assign vector by direction to a condition";
AssignVectorByDirectionToConditionProcess.desc = "Sets a variable a certain scalar value in a given direction, for all the conditions belonging to a submodelpart.";

LiteGraph.registerNodeType("Processes/AssignVectorByDirectionToConditionProcess", AssignVectorByDirectionToConditionProcess);

console.log("AssignVectorByDirectionToConditionProcess node created"); //helps to debug
