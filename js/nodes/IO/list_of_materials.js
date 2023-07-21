
class MaterialsList extends InputList{
    constructor() {
        super();
        this.input_type = "material";
        this.output_type = "materials_list";
    }
};

MaterialsList.title = "List of materials";
MaterialsList.desc = "Merges several materials into an array";

LiteGraph.registerNodeType("IO/materials_list", MaterialsList);

console.log("Materials list node created"); //helps to debug
