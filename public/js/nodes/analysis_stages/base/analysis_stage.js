export class AnalysisStage {
    constructor() {
        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        // Identifier Glyph
        this.glyph = {shape: '\uf15b', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Type
        this._type = "KratosMultiphysics.analysis_stage"

        // Stage Name
        this._name = this.addWidget("text", "Stage Name", "", function(v){}, {} );

        this.SetUpInputs()
        this.SetUpOutputs()

        this.crop_title = 20;
        this.hover_tooltip = false;
        this.error_list = []
        // this.error_list = ["Error1", "Error2", "Error3", "Error4"];
    }

    SetUpInputs(){
        // List of inputs and outputs ("name", "type")
        this.addInput("Stage",              "stage_flow");          // 0
        this.addInput("Stage Pre",          "stage_pre");           // 1
        this.addInput("Stage Post",         "stage_post");          // 2
        this.addInput("Problem Data",       "problem_data");        // 3
        this.addInput("Solver Settings",    "solver_settings");     // 4
        this.addInput("Processes",          "process_list");        // 5
        this.addInput("Output Processes",   "output_process_list"); // 6

    }

    SetUpOutputs(){
        this.addOutput("Stage",             "stage_flow");          // 0
        this.addOutput("Name",              "string");              // 1
    }

    onDrawTitle(ctx) {
        if(this.error_list.length) {
            ErrorHandler.drawErrorMark(ctx, this);
        }
    }

    onMouseMove(e, pos, graph_canvas) {
        if (pos[0] > this.size[0]-24 &&
            pos[0] < this.size[0]-10 &&
            pos[1] > LiteGraph.NODE_TITLE_TEXT_Y - LiteGraph.NODE_TITLE_HEIGHT - 13 &&
            pos[1] < LiteGraph.NODE_TITLE_TEXT_Y - LiteGraph.NODE_TITLE_HEIGHT + 2) {

            this.hover_tooltip = true;
        } else {
            this.hover_tooltip = false;
        }
    }

    onDrawForeground(ctx, area) {
        if(this.hover_tooltip && this.error_list.length) {
            ErrorHandler.drawErrorTooltip(ctx, this);
        }
    }

    setUpOrchestrtor(){

    }

    onExecute() {
        this.error_list = [];

        if(this.getInputData(0) == undefined) {
            this._value = {};

            // Define a default set of settings for the orchestrator in case is not provided.
            this._value["orchestrator"] = {
                "name": "Orchestrators.KratosMultiphysics.SequentialOrchestrator",
                "settings" : {
                    "echo_level" : 0,
                    "execution_list" : [],
                    "load_from_checkpoint" : null,
                    "stage_checkpoints" : false
                }
            }

            this._value["stages"] = {};
        } else {
            this._value = this.getInputData(0);
        }

        this.stage_name = "auto_" + this.id + "_stage";
        if(this._name.value != undefined && this._name.value != "") {
            this.stage_name = toSnakeCase(this._name.value) + "_stage";
        }

        // Generate the stage data
        if(!this._value["orchestrator"]["settings"]["execution_list"].includes(this.stage_name)) {
            this._value["orchestrator"]["settings"]["execution_list"].push(this.stage_name);

            this._value["stages"][this.stage_name] = {
                "stage_preprocess":         this.getInputData(1),
                "stage_postprocess":        this.getInputData(2),
                "stage_settings": {
                    "analysis_stage":           this._type,
                    "problem_data":             this.getInputData(3),
                    "solver_settings":          this.getInputData(4),
                    "processes":                {"boundary_conditions_process_list":this.getInputData(5)},
                    "output_processes":         {"output_process_list": this.getInputData(6)},
                },
            }
        } else {
            this.error_list.push("Stage '"+this.stage_name+"' already exists")
        }

        // Set the output data
        this.setOutputData(0, this._value);
        this.setOutputData(1, this.stage_name);
    }

    onSelection(e) {
    }
}

// Set the node name and the description
AnalysisStage.title = "Analysis stage";
AnalysisStage.doc_ref = "https://kratosmultiphysics.github.io/Kratos/pages/Kratos/Sequence_Diagrams/General/AnalysisStage.html"
AnalysisStage.desc = "Base Analysis stage que tal estas hace muy buen dia ";
AnalysisStage.doc = `<span class='glyph-solid'>&#xf02d</span> <a href="${AnalysisStage.doc_ref}">Analysis Stage</a>`;

// Set the colors of selected connection to better reflect the flow
LGraphCanvas.link_type_colors["stage_flow"] = "#90bdd1";
LGraphCanvas.slot_type_colors["stage_flow"] = "#90bdd1";
LGraphCanvas.slot_type_colorsOff["stage_flow"] = "#90bdd1";

// Register default i/o
register_default_in_type("problem_data", "Stages/Problem Data");
register_default_in_type("stage_flow", "Stages/AnalysisStage");
register_default_out_type("stage_flow", "Stages/AnalysisStage");

// Register in the system
LiteGraph.registerNodeType("Analysis stages/Base/AnalysisStage", AnalysisStage);
