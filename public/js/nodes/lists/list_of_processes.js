import { InputList } from "/js/nodes/lists/input_list.js";

class ProcessesList extends InputList {
    constructor() {
        super();

        let that = this;

        this.scaling_type = this.addWidget("toggle", "Group", true, function(v){
            that.process_list.disabled = !v;
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

            let tooltip = [
                `${w.name}`, "", `${w.value}`, "",
                "Selects the process list where the ", "process will be assigned",
            ];

            let help_tooltip = {
                "title": `${w.name}`,
                "value": `${w.value}`,
                "descp": [
                    "Selects the process list where the process will be assigned",
                    "depending on the ascending house of mars",
                    "the solver may refuse to work until you perform",
                    "a sacrifice of blood to the god of war"
                ],
            }

            return help_tooltip;
        }

        // this.scaling_type.tooltip = (w) => {
        //     return [w.value];
        // }
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
