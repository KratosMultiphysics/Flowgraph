class MaterialWriter {
    constructor()
    {
        this.material_file_name = this.addWidget("string","Materials Filenae", "Materials.json");
        this.addInput("Material List","material_array");
        this.addOutput("Material","string");
        this.size = this.computeSize();
    }

    onExecute()
    {
        this.setOutputData(0, this.material_file_name.value);
        problem_files["materials"][this] = {"name":this.material_file_name.value, "data":this.getInputData(0)};
    }
}

MaterialWriter.title = "Material Writer";
MaterialWriter.desc = "Node to write materials file.";

LiteGraph.registerNodeType("materials/Material Writer", MaterialWriter);

console.log("Material Writer node created"); //helps to debug