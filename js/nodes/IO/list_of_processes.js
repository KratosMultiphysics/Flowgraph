class ProcessesList extends InputList {
    constructor() {
        super();

        this.input_type = "process";
        this.output_type = "process_list";
    }
}

ProcessesList.title = "List of Kratos Processes";
ProcessesList.desc = "Merges several processes into a list";

LiteGraph.registerNodeType("LISTS/ProcessesList", ProcessesList);
