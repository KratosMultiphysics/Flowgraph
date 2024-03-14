class MaterialImportSettings {
    constructor() {
        this.addInput("name","string");

        this.addOutput("Settings","material_import_settings");

        this.properties = {
            "materials_filename": ""
        }

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        this._value = Object.assign({}, this.properties);

        this._value["materials_filename"] = this.getInputData(0)

        this.setOutputData(0, this._value);
    };
}

MaterialImportSettings.title = "Material Import Settings";
MaterialImportSettings.desc = "Define Material Settings";

LiteGraph.registerNodeType("Solvers/Components/MaterialImportSettings", MaterialImportSettings);

console.log("MaterialImportSettings node created"); //helps to debug
