import { Orchestrator } from "/js/nodes/orchestrators/base/orchestrator.js";

class SequentialOrchestrator extends Orchestrator {
    constructor() {
        super();
        this._type = "Orchestrators.KratosMultiphysics.SequentialOrchestrator"

        // Properties
        this.properties = {
            "echo_level" : 0,
            "execution_list" : [],
            "load_from_checkpoint" : null,
            "stage_checkpoints" : false
        }
    }
}

SequentialOrchestrator.title = "Sequential orchestrator";
SequentialOrchestrator.desc = "Creates a SequentialOrchestrator object for several stages.";

LiteGraph.registerNodeType("Orchestrators/SequentialOrchestrator", SequentialOrchestrator);

console.log("SequentialOrchestrator node created");


