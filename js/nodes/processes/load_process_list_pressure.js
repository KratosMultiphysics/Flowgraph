
function AssignScalarVariableToConditionsProcess() {
    this.addInput("model_part_name","string");
    this.addInput("interval","process_array");

    this.properties = {
        "python_module" : "",
        "kratos_module" : "",
        "process_name"  : "",
        "Parameters"    : {
            "model_part_name" : "",
            "variable_name"   : "",
            "value"           : "",
            "interval"        : []
        }
        
    };

        var that = this;
        this.variable_name = this.addWidget("text","VariableName", "", function(v){}, {} );
        this.value = this.addWidget("text","Value", "", function(v){}, {});


        this.addOutput("Process","process");

        this.size = this.computeSize();
        this.serialize_widgets = true;

    }

    AssignScalarVariableToConditionsProcess.title = "Load process list pressure";
    AssignScalarVariableToConditionsProcess.desc = "Node to specify a load process";

    AssignScalarVariableToConditionsProcess.prototype.onExecute = function() {
        myoutput = this.properties
    // model_part_name
    if (this.getInputData(0) != undefined) {
        myoutput["Parameters"]["model_part_name"] = this.getInputData(0)
    } else {
        myoutput["Parameters"]["model_part_name"] = this.properties["Parameters"]["model_part_name"]
    }
    // interval
    if (this.getInputData(1) != undefined) {
        myoutput["Parameters"]["interval"] = this.getInputData(1)
    } else {
        myoutput["Parameters"]["interval"] = this.properties["Parameters"]["interval"]
    }
  
        myoutput["Parameters"]["variable_name"] = this.variable_name.value
        myoutput["Parameters"]["value"] = this.value.value

        this.setOutputData(0,  myoutput);
    };

    LiteGraph.registerNodeType("processes/AssignScalarVariableToConditionsProcess", AssignScalarVariableToConditionsProcess);