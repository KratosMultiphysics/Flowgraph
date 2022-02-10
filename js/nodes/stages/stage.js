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
        this.addInput("Processes",          "process_list");        // 4
        this.addInput("Output Processes",   "output_process_list"); // 5
        this.addInput("Post",               "stage_post");          // 6

        this.addOutput("Stage",             "analysis_stage")       // 0

        this.crop_title = 20;
        this.hover_tooltip = false;
        // this.error_list = []
        this.error_list = ["Error1", "Error2", "Error3", "Error4"];
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

    onDrawBackground(ctx, node, canvas, graph_mouse) {
        var title_height = LiteGraph.NODE_TITLE_HEIGHT;
        var area = [0,0,0,0];
        area[0] = 0; //x
        area[1] = -title_height; //y
        area[2] = this.size[0] + 1; //w
        area[3] = this.size[1] + title_height; //h

        console.log("ousize:", this.size);
        ctx.strokeStyle = "#C44";
        ctx.fillStyle = "#C44";
        ctx.beginPath();
        ctx.roundRect(
            area[0] + 10,
            area[1] + 10,
            area[2] + 10,
            area[3] + 10,
            [this.round_radius] 
        );
        ctx.fill();
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

AnalysisStage.title = "AnalysisStage";
AnalysisStage.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("Stages/AnalysisStage", AnalysisStage);

console.log("AnalysisStage node created");