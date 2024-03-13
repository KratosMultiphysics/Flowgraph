import { Process } from "/js/nodes/processes/process.js";

class ApplyWallLawProcess extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addOutput("Process","process_list");

        this.wall_model_name = this.addWidget("string","wall model name=","", function(v){} );

        this.properties = {
            "calculate_normals_at_each_step" : false
        };

        this.size = this.computeSize();
    }

    onExecute()
    {
        let output = {
            "python_module" : "apply_wall_law_process",
            "kratos_module" : "KratosMultiphysics.FluidDynamicsApplication"
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        output["Parameters"]["wall_model_name"] = this.wall_model_name.value
        
        this.setOutputData(0, [output]);
    }
}

ApplyWallLawProcess.title = "Apply Wall Law Process";
ApplyWallLawProcess.desc = "Node to specify a wall law boundary process.";

LiteGraph.registerNodeType("Processes/ApplyWallLawProcess", ApplyWallLawProcess);

console.log("ApplyWallLawProcess node created"); //helps to debug
