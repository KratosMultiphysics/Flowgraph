import { InputList } from "/js/nodes/lists/input_list.js";

class ProcessesList extends InputList {
    constructor() {
        super();

        let that = this;

        this.scaling_type = this.addWidget("toggle", "Group", true, function(v){
            that.process_list.disabled = !v;
            console.log(that.process_list.disabled.value)
        });

        this.process_list = this.addWidget("combo", "Process List", 0, function(v) {}, {
            values: [
                "initial_conditions_process_list",
                "boundary_conditions_process_list",
                "gravity",
                "auxiliary_process_list",
                "json_check_process"
            ]
        });

        this.process_list.tooltip = (w) => {
            return w.value;
        }

        this.scaling_type.tooltip = (w) => {
            return w.value;
        }
    }

    setIOType() {
        this.input_type = "process_list";
        this.output_type = "process_list";
    }

    onExecute() {
        this.group_value = this.scaling_type.value ? this.process_list.value : undefined;
        super.onExecute();
    }
}

ProcessesList.title = "List of Processes";
ProcessesList.desc = "Merges several processes into a list";

LiteGraph.registerNodeType("Lists/Processes", ProcessesList);
