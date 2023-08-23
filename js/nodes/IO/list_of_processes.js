class ProcessesList extends InputList {
    constructor() {
        super();
    }

    setIOType() {
        this.input_type = "process_list";
        this.output_type = "process_list";
    }
}

ProcessesList.title = "List of Kratos Processes";
ProcessesList.desc = "Merges several processes into a list";

LiteGraph.registerNodeType("Lists/ProcessesList", ProcessesList);
