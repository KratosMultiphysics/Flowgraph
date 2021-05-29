
function LoadProcessList() {
    this.addInput("model_part_name","string");
    this.addInput("interval","process_array");
    this.addInput("direction","process_array");

    this.properties = {
        "python_module" : "assign_vector_by_direction_to_condition_process",
        "kratos_module" : "KratosMultiphysics",
        "check"         : "DirectorVectorNonZero direction",
        "process_name"  : "AssignVectorByDirectionToConditionProcess",
        "Parameters"    : {
            "model_part_name" : "Structure.LineLoad2D_Load_on_lines_Auto1",
            "variable_name"   : "LINE_LOAD",
            "interval"        : [0.0,"End"],
            "modulus"         : 100000.0,
            "direction"       : [0.0,-1,0.0]
        }
        
    };

        var that = this;
        this.variable_name = this.addWidget("text","VariableName", "LINE_LOAD", function(v){}, {} );
        this.modulus = this.addWidget("number","Modulus", 100000, function(v){}, {});


        this.addOutput("Process","process");

        this.size = this.computeSize();
        this.serialize_widgets = true;

    }

    LoadProcessList.title = "Load process list";
    LoadProcessList.desc = "Node to specify a load process";

    LoadProcessList.prototype.onExecute = function() {
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
    // direction
    if (this.getInputData(2) != undefined) {
        myoutput["Parameters"]["direction"] = this.getInputData(2)
    } else {
        myoutput["Parameters"]["direction"] = this.properties["Parameters"]["direction"]
    }
        myoutput["Parameters"]["variable_name"] = this.variable_name.value
        myoutput["Parameters"]["modulus"] = this.modulus.value

        this.setOutputData(0,  myoutput);
    };

    LiteGraph.registerNodeType("processes/LoadProcessList", LoadProcessList);