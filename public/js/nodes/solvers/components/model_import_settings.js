class ModelImportSettings {
    constructor() {
        this.addInput("name","string");
        this.model_type = this.addWidget("combo", "Type", "mdpa", function(v) {}, { values: ["mdpa", "use_input_model_part"] });

        this.addOutput("Settings","model_import_settings");

        this.properties = {
            "input_type": "mpda",
            "input_filename": ""
        }

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        this._value = Object.assign({}, this.properties);

        this._value["input_type"] = this.model_type.value;
        this._value["input_filename"] = this.getInputData(0)

        this.setOutputData(0, this._value);
    };
}

ModelImportSettings.title = "Model Import Settings";
ModelImportSettings.desc = "Define inlet";

LiteGraph.registerNodeType("Solvers/Components/ModelImportSettings", ModelImportSettings);

console.log("ModelImportSettings node created"); //helps to debug
