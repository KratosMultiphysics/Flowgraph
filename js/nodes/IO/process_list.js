
class ProcessList extends InputList{
    constructor() {
        super();
        this.input_type = "process";
        this.output_type = "process_array";
    }
};

ProcessList.title = "List of processes";
ProcessList.desc = "Merges several processes into an array";

LiteGraph.registerNodeType("IO/process list", ProcessList);

console.log("Process List node created"); //helps to debug

    
