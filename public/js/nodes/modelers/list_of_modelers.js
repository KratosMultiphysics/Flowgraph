import { InputList } from "/js/nodes/lists/input_list.js";

class ModelersList extends InputList {
    constructor() {
        super();
    }

    setIOType() {
        this.input_type = "modeler_list";
        this.output_type = "modeler_list";
    }
}

ModelersList.title = "List of modelers";
ModelersList.desc = "Merges several processes into a list";

LiteGraph.registerNodeType("Modelers/ModelersList", ModelersList);
