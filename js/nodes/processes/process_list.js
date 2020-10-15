
class ProcessList extends InputList{
    constructor() {
        super();
        this.input_type = "process";
        this.output_type = "process_array";
    }
};

ProcessList.title = "Process List";
ProcessList.desc = "Merges several processes into an array";

LiteGraph.registerNodeType("processes/list", ProcessList);

console.log("Process List node created"); //helps to debug

    