class StagePreProcess {
    constructor() {
        this.addInput("Modeler", "modeler");
        this.addInput("Process List", "process_array");
        
        this.addOutput("Pre Process", "stage_pre_process");
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

StagePreProcess.title = "\uf359 Pre Process";
StagePreProcess.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("Stages/PreProcess", StagePreProcess);

console.log("Modeler node created"); //helps to debug