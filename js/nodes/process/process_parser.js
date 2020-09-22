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

            // Delete the help and move it to the description
            if(this.properties['help'] != undefined) {
                delete this.properties['help'];
            }

            Object.entries(this.properties).forEach(([pkey, pvalue]) => {
                if(pkey === "model_part_name") {
                    this.addInput(`${pkey}`,"string");
                }
            })

            this.addOutput(`Process`,"process");
            this.serialize_widgets = true;
        }

        onExecute() {
            this._value = Object.assign({}, this.properties);
            this.setOutputData(0,  this._value);
        }

        onAdded() {
            this.size = this.computeSize();
        }
    };

    processClass.title = titleCaseProcess(`${key}`);
    processClass.desc = `${value['help']}`;

    LiteGraph.registerNodeType(`processes/${key}`, processClass);

    console.log(`${key} created`); //helps to debug
})