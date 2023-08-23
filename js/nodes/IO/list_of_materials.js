
class MaterialsList extends InputList{
    constructor() {
        super();
    }

    setIOType() {
        this.input_type = "materials_list";
        this.output_type = "materials_list";
    }
};

MaterialsList.title = "List of Materials";
MaterialsList.desc = "Merges several materials into an array";

LiteGraph.registerNodeType("Lists/materials_list", MaterialsList);

console.log("Materials list node created"); //helps to debug
