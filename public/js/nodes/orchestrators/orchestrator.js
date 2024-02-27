
class Orchestrator {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf70e', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Properties
        this.properties = {}

        // Type identification
        this._type = "Orchestrators.KratosMultiphysics.Orchestrator"

        // List of inputs and outputs ("name", "type")
        this.echo_level  = this.addWidget("combo", "Echo level", 0, function(v) {}, {values: [0, 1, 2, 3]});

        this.addInput("Stage", "stage_flow");
        this.addInput("Save Checkpoints", null)
        this.addInput("Load Checkpoint", null);

        this.addOutput("Output", "stage_flow");

        this.error_list = [];
    }

    onExecute() {
        this.error_list = [];

        if(this.getInputData(0) == undefined) {
            this._value = {};

            // Define a default set of settings for the orchestrator in case is not provided.
            this._value["orchestrator"] = {
                "name": this._type,
                "settings" : this.properties
            }

            this._value["stages"] = {};
        } else {
            this._value = this.getInputData(0);
        }

        // Add the orchestrator values
        this._value["orchestrator"]["settings"]["echo_level"] = this.echo_level.value;

        // Save checkpoints
        if(this.getInputData(1) == undefined) {
            this._value["orchestrator"]["settings"]["stage_checkpoints"] = false;
        }
        else {
            this._value["orchestrator"]["settings"]["stage_checkpoints"] = this.getInputData(1);
        }

        // Load checkpoints
        if(this.getInputData(2) == undefined) {
            this._value["orchestrator"]["settings"]["load_from_checkpoint"] = null;
        }
        else {
            this._value["orchestrator"]["settings"]["load_from_checkpoint"] = this.getInputData(2);
        }

        this.setOutputData(0, this._value);
    }
};

Orchestrator.title = "Orchestrator";
Orchestrator.desc = "Creates a base Orchestrator object for several stages.";

LiteGraph.registerNodeType("basic (Kratos)/Orchestrator", Orchestrator);

console.log("Orchestrator node created");


