
class MultiStage extends InputList{
    constructor() {
        super();
        this.input_type = "stage_data_model";
        this.output_type = "multi_stage_data_model";
    }
};

MultiStage.title = "MultiStage";
MultiStage.desc = "Creates a MultiStage object from several Stages";

LiteGraph.registerNodeType("Stages/multi_stage", MultiStage);

console.log("MultiStage node created");

    