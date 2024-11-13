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
            let help_tooltip = {
                "title": `${w.name}`,
                "value": `${w.value}`,
                "descp": [
                    "Selects the process list where the process will be assigned",
                ],
            }

            return help_tooltip;
        }

        this.scaling_type.tooltip = (w) => {
            let help_tooltip = {
                "title": `${w.name}`,
                "value": `${w.value}`,
                "descp": [
                    "Toggles a switch controling if the process list will be used as a group or not",
                ],
            }

            return help_tooltip;
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
ProcessesList.doc_ref = "https://kratosmultiphysics.github.io/Kratos/pages/Kratos/Processes/process.html"
ProcessesList.desc = "Merges several processes into a list";
ProcessesList.doc = `<span class='glyph-solid'>&#xf02d</span> <a href="${ProcessesList.doc_ref}">Process</a>`;

LiteGraph.registerNodeType("Lists/Processes", ProcessesList);
