class MaterialImportSettings {
    constructor()
    {
        this.addInput("Materials filename", "string");

        this.properties = {
            "materials_filename" : ""
        };

        this.addOutput("solver_settings", "map");

        this.size = this.computeSize();
    }

    onExecute()
    {
        this._value = Object.assign({}, this.properties);
        if (this.getInputData(0) != undefined) {
            this._value["materials_filename"] = this.getInputData(0);
        }

        this.setOutputData(0, this._value);
    }
}

MaterialImportSettings.title = "Material import settings";
MaterialImportSettings.desc = "Node to specify the model import settings of a solver.";

LiteGraph.registerNodeType("IO/MaterialImportSettings", MaterialImportSettings);

console.log("MaterialImportSettings node created"); //helps to debug
