// This is an example copied directly from two random Kratos procsses.
const processes = {
    "assign_scalar_input_to_conditions_process": {
        "help"               : "This process assigns a given value (input) to all the conditions belonging a certain submodelpart",
        "mesh_id"            : 0,
        "model_part_name"    : "please_specify_model_part_name",
        "variable_name"      : "SPECIFY_VARIABLE_NAME",
        "interval"           : [0.0, 1e30],
        "file"               : "",
        "transfer_algorithm" : "nearest_neighbour",
        "entities"           : ["conditions"]
    },
    "check_scalar_base_process": {
        "help"            : "This process is the base class to check analytically from a function the solution (scalar) in a certain entity belonging a certain submodelpart",
        "model_part_name" : "please_specify_model_part_name",
        "variable_name"   : "SPECIFY_VARIABLE_NAME",
        "interval"        : [0.0, 1e30],
        "value"           : 0.0,
        "tolerance_rank"  : 3
    }
}

function titleCaseProcess(str) {
    let splitStr = str.toLowerCase().replace(/_/g,' ').split(' ');

    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }

    splitStr.splice(splitStr.length-1);

    return splitStr.join(' '); 
}

Object.entries(processes).forEach(([key, value]) => {
    let processClass = class {
        constructor() {
            this.properties = Object.assign({}, value);
            this.widgets_up = true;

            // Delete the help and move it to the description
            if(this.properties['help'] != undefined) {
                delete this.properties['help'];
            }

            this.widget_storage = new Map();

            Object.entries(this.properties).forEach(([pkey, pvalue]) => {
                if(pkey === "model_part_name") {
                    this.addInput(`${pkey}`,"string");
                    this.addOutput(`${pkey}`,"string");
                    this.widget_storage[`${pkey}`] = this.addWidget("string", `${pkey}`, this.properties[pkey], `${pkey}`)
                }
            });

            this.addOutput(`Process`,"process");
            this.serialize_widgets = true;
        }

        onExecute() {
            this._value = Object.assign({}, this.properties);

            // If connected to something its value takes precedence over the one
            // in the properties.
            for (let i = 0; i < this.inputs.length; i++) {
                if (this.isInputConnected(i)) {
                    this._value[this.inputs[i].name] = this.getInputData(i);
                }
                this.setOutputData(i,  this._value[this.inputs[i].name]);
            }

            this.setOutputData(this.outputs.length - 1,  this._value);
        }

        onAdded() {
            this.size = this.computeSize();
        }

        onConnectionsChange() {
            // Last slot is the process output and all the others should behabe like widget-binded I/O
            for (let i = 0; i < this.inputs.length; i++) {
                if(!this.isInputConnected(i)) {
                    this.widget_storage[this.inputs[i].name].type = "string"
                    this.widget_storage[this.inputs[i].name].draw = true
                } else {
                    this.widget_storage[this.inputs[i].name].type = "invisible"
                    this.widget_storage[this.inputs[i].name].draw = false
                }
            }
        }
    };

    processClass.title = titleCaseProcess(`${key}`);
    processClass.desc = `${value['help']}`;

    LiteGraph.registerNodeType(`PROCESSES/${key}`, processClass);

    console.log(`${key} created`); //helps to debug
})
