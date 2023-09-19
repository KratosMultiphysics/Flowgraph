class FsiStage extends AnalysisStage {
    constructor() {
        super();
        this._type = "KratosMultiphysics.FSIApplication.fsi_analysis"
    }

    SetUpInputs(){
        // List of inputs and outputs ("name", "type")
        this.addInput("Stage",              "stage_flow");          // 0
        this.addInput("Stage Pre",          "stage_pre");           // 1
        this.addInput("Stage Post",         "stage_post");          // 2
        this.addInput("Problem Data",       "problem_data");        // 3
        this.addInput("Fluid Settings",    "fluid_solver_settings");     // 4
        this.addInput("Structure Settings",    "structure_solver_settings");     // 5
        this.addInput("Processes",          "process_list");        // 6
        this.addInput("Output Processes",   "output_process_list"); // 7
    }

    combineSolvers(){
        return {
            "fluid_solver_settings": this.getInputData(4),
            "structure_solver_settings": this.getInputData(5),
        }
    };

    onExecute() {
         super.onExecute();

         this._value["stages"][this.stage_name] = {
             "stage_preprocess":         this.getInputData(1),
             "stage_postprocess":        this.getInputData(2),
             "stage_settings": {
                 "analysis_stage":           this._type,
                 "problem_data":             this.getInputData(3),
                 "solver_settings":          this.combineSolvers(),
                 "processes":                this.getInputData(6),
                 "output_processes":         this.getInputData(7),
                 },
             }

         // Set the output data
         this.setOutputData(0, this._value);
         this.setOutputData(1, this.stage_name);

     };

    }


FsiStage.title = "Fluid Structure Interaction analysis stage";
FsiStage.desc = "Base FSIApplication stage";

LiteGraph.registerNodeType("Stages/FsiStage", FsiStage);
