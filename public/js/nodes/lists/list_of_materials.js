import { InputList } from "/js/nodes/utilities/input_list.js";

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

LiteGraph.registerNodeType("Lists/Materials", MaterialsList);

console.log("Materials list node created"); //helps to debug
