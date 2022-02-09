class AnalysisStage {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf121', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Type
        this._type = "analysis_stage"

        // Stage Name
        this._name = this.addWidget("text","Stage Name", "", function(v){}, {} );

        // List of inputs and outputs ("name", "type")
        this.addInput("Previous Stage",     "analysis_stage")       // 0
        this.addInput("Pre",                "stage_pre");           // 1
        this.addInput("Problem Data",       "problem_data");        // 2
        this.addInput("Solver Settings",    "solver_settings");     // 3
        
        // TODO: Add processes and output_processes
        
        this.addInput("Post",               "stage_post");          // 4

        this.addOutput("Stage",             "analysis_stage")       // 0
    }

    onExecute() {
        if(this.getInputData(0) == undefined) {
            this._value = {};
            this._value["execution_order"] = [];
            this._value["stages"] = {};
        } else {
            this._value = this.getInputData(0);
        }
        
        let stage_name = "auto_" + this.id + "_stage";
        if(this._name.value != undefined && this._name.value != "") {
            stage_name = this._name.value + "_stage";
        }

        // The if is needed to prevent cycles and duplicated stages
        if(!this._value["execution_order"].includes(stage_name)) {
            this._value["execution_order"].push(stage_name);

            this._value["stages"][stage_name] = {
                "stage_preprocess":     this.getInputData(1),
                "analysis_stage":       this._type,
                "problem_data":         this.getInputData(2),
                "solver_settings":      this.getInputData(3),
                "stage_postprocess":    this.getInputData(4)
            }
        } else {
            // TODO: How to report to the user that the stage is already added?
        }
        
        this.setOutputData(0, this._value);
    }

    onSelection(e) {
    }
}

AnalysisStage.title = "AnalysisStage";
AnalysisStage.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("Stages/AnalysisStage", AnalysisStage);

console.log("AnalysisStage node created"); //helps to debug