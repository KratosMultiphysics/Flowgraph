
class MaterialsList extends InputList{
    constructor() {
        super();
        this.input_type = "material";
        this.output_type = "material_array";
    }
};

MaterialsList.title = "Materials list";
MaterialsList.desc = "Merges several materials into an array";

LiteGraph.registerNodeType("materials/materials_list", MaterialsList);

console.log("Materials list node created"); //helps to debug

    