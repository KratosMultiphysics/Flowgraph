class ModelImportSettings {
    constructor() {
        this.addInput("name","string");
        this.model_type = this.addWidget("combo", "Type", "mdpa", function(v) {}, { values: ["mdpa"] });

        this.addOutput("Process","model_import_settings");

        this.properties = {
            "input_type": "mpda",
            "input_name": ""
        }

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        this._value = Object.assign({}, this.properties);

        output["input_type"] = this.model_type.value;
        output["input_name"] = this.getInputData(0)

        this.setOutputData(0, this._value);
    };
}

ModelImportSettings.title = "Model Import Settings";
ModelImportSettings.desc = "Define inlet";

LiteGraph.registerNodeType("ModelParts/ModelImportSettings", ModelImportSettings);

console.log("ModelImportSettings node created"); //helps to debug
