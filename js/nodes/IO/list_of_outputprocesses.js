class OutputProcessesList extends InputList {
    constructor() {
        super();

        this.input_type = "output_process";
        this.output_type = "output_process_list";
    }
}

OutputProcessesList.title = "List of Output Processes";
OutputProcessesList.desc = "Merges several output processes into a list";

LiteGraph.registerNodeType("IO/OutputProcessesList", OutputProcessesList);
