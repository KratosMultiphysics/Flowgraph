import { InputList } from "/js/nodes/lists/input_list.js";

class SubmodelPartsList extends InputList {
    constructor() {
        super();
    }

    setIOType() {
        this.input_type = "string";
        this.output_type = "string";
    }
}

SubmodelPartsList.title = "List of Submodelparts";
SubmodelPartsList.desc = "Merges several submodelparts into a list";

LiteGraph.registerNodeType("Lists/Submodelparts", SubmodelPartsList);
