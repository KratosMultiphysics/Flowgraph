class StagePostProcess {
    constructor() {
        this.addInput("Process List", "process_array");

        this.addOutput("Post Process", "stage_post_process");
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

StagePostProcess.title = "\uf35a Post Process";
StagePostProcess.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("Stages/PostProcess", StagePostProcess);

console.log("Modeler node created"); //helps to debug