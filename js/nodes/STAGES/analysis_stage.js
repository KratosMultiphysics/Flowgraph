class AnalysisStage {
    constructor() {
        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        // Identifier Glyph
        this.glyph = {shape: '\uf121', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Type
        this._type = "analysis_stage"

        // Stage Name
        this._name = this.addWidget("text","Stage Name", "", function(v){}, {} );

        // List of inputs and outputs ("name", "type")
        this.addInput("Stage",              "stage_flow");          // 0
        this.addInput("Problem Data",       "problem_data");        // 1
        this.addInput("Solver Settings",    "solver_settings");     // 2
        this.addInput("Processes",          "process_list");        // 3
        this.addInput("Output Processes",   "output_process_list"); // 4

        this.addOutput("Stage",             "stage_flow");          // 0

        this.crop_title = 20;
        this.hover_tooltip = false;
        this.error_list = []
        // this.error_list = ["Error1", "Error2", "Error3", "Error4"];

        // Set the color to visualize flows
        this.color = LGraphCanvas.node_colors["pale_blue"].color;
        this.bgcolor = LGraphCanvas.node_colors["pale_blue"].bgcolor;
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
        
        let stage_name = "auto_" + this.id + "_stage";
        if(this._name.value != undefined && this._name.value != "") {
            stage_name = toSnakeCase(this._name.value) + "_stage";
        }

        // For our sequential orchestrator we add stages if they are not repeated.
        if(!this._value["orchestrator"]["settings"]["execution_list"].includes(stage_name)) {
            this._value["orchestrator"]["settings"]["execution_list"].push(stage_name);

            this._value["stages"][stage_name] = {
                "stage_preprocess":     this.getInputData(1),
                "analysis_stage":       this._type,
                "problem_data":         this.getInputData(2),
                "solver_settings":      this.getInputData(3),
                "processes":            this.getInputData(4),
                "output_processes":     this.getInputData(5),
                "stage_postprocess":    this.getInputData(6)
            }
        } else {
            this.error_list.push("Stage '"+stage_name+"' already exists")
        }
        
        this.setOutputData(0, this._value);
    }

    onSelection(e) {
    }
}

AnalysisStage.title = "Analysis stage";
AnalysisStage.desc = "Select different ModelParts and access their submodelparts directly";

// Set the colors of selected connection to better reflect the flow
LGraphCanvas.link_type_colors["stage_flow"] = "#90bdd1";

LiteGraph.registerNodeType("STAGES/AnalysisStage", ModelManager.registerNodeType(AnalysisStage));

console.log("AnalysisStage node created");
