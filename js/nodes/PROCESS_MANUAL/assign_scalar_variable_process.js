class AssignScalarVariable extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
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
            "constrained"     : true,
            "local_axes"      : {}
        }

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        let output = {
            "python_module" : "assign_scalar_variable_process",
            "kratos_module" : "KratosMultiphysics"
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        output["Parameters"]["value"] = this.scalar_value.value
        output["Parameters"]["variable_name"] = this.variable_name.value

        this.setOutputData(0, [output]);
    };
}

AssignScalarVariable.title = "Assign scalar variable";
AssignScalarVariable.desc = "Sets a given scalar value for a certain variable in all the nodes of a submodelpart";

LiteGraph.registerNodeType("Processes/AssignScalarVariable", AssignScalarVariable);

console.log("AssignScalarVariable node created"); //helps to debug
