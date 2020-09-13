  //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/
    function ProblemData() {

        this.properties = {
            "problem_name"  : "riccardo",
            "parallel_type" : "OpenMP",
            "echo_level"    : 0,
            "start_time"    : 0.0,
            "end_time"      : 45
        }

        this.addOutput("problem_data","object");
        this.addOutput("problem_name","string");
        this.addOutput("start_time","number");
        this.addOutput("end_time","number");
        this.size = this.computeSize();
    }

    ProblemData.title = "ProblemData";
    ProblemData.desc = "create an problem_data object";

    ProblemData.prototype.onExecute = function() {
        this.setOutputData(0, this.properties);
    };

    LiteGraph.registerNodeType("parameters/ProblemData", ProblemData);

    console.log("ProblemData node created"); //helps to debug

    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/
    function StringsList() {

        this.addOutput("StringsList","object");
        this.size = this.computeSize();
    }

    StringsList.title = "StringsList";
    StringsList.desc = "create an empty list";

    StringsList.prototype.onGetInputs = function() {
        return [
            ["string", "string"],
        ];
    };

    StringsList.prototype.onExecute = function() {
        tmp = []
        console.log(this.inputs.length)
        for (var i = 0; i < this.inputs.length; ++i) {
                var input = this.inputs[i];
                if (input.link !== null) {
                    var v = this.getInputData(i);
                    tmp.push(v);
                }
            }
        console.log(tmp)
        this.setOutputData(0, tmp);
    };

    LiteGraph.registerNodeType("parameters/StringsList", StringsList);

    console.log("StringsList node created"); //helps to debug



    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/
    function ParametersList() {

        this.addOutput("ParametersList","object");
        this.size = this.computeSize();
    }

    ParametersList.title = "ParametersList";
    ParametersList.desc = "create an empty list";

    ParametersList.prototype.onGetInputs = function() {
        return [
            ["Process", "object"],
        ];
    };

    ParametersList.prototype.onExecute = function() {
        tmp = []
        console.log(this.inputs.length)
        for (var i = 0; i < this.inputs.length; ++i) {
                var input = this.inputs[i];
                if (input.link !== null) {
                    var v = this.getInputData(i);
                    tmp.push(v);
                }
            }
        console.log(tmp)
        this.setOutputData(0, tmp);
    };

    LiteGraph.registerNodeType("parameters/ParametersList", ParametersList);

    console.log("ParametersList node created"); //helps to debug

    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/
    function EmptyList() {
        this.addOutput("EmptyList","object");
        this.size = this.computeSize();
    }

    EmptyList.title = "EmptyList";
    EmptyList.desc = "create an empty list";

    EmptyList.prototype.onExecute = function() {
        tmp = []
        this.setOutputData(0, tmp);
    };

    LiteGraph.registerNodeType("parameters/EmptyList", EmptyList);

    console.log("EmptyList node created"); //helps to debug
    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/
    function PushBack() {
        this.addInput("InputList","object");
        this.addInput("ToAdd","object");
        this.addOutput("OutputList","object");
        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    PushBack.title = "PushBack";
    PushBack.desc = "add to a list";

    PushBack.prototype.onExecute = function() {
        tmp = this.getInputData(0)
        v = this.getInputData(1)

        tmp.push(v)
        this.setOutputData(0, tmp);
    };

    LiteGraph.registerNodeType("parameters/PushBack", PushBack);

    console.log("PushBack node created"); //helps to debug

//********************************************************************/    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/
    function InletByFunction() {
        this.addInput("model_part","text");
        this.addOutput("OutputList","object");

        this.modulus = this.addWidget("string","f(x,y,z,t)=", "", function(v){} );

        this.properties = {
            "variable_name"   : "VELOCITY",
            "interval"        : [0,"End"],
            "direction"       : "automatic_inwards_normal"
        }
        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    InletByFunction.title = "InletByFunction";
    InletByFunction.desc = "define inlet";

    InletByFunction.prototype.onExecute = function() {
        output =     {
            "python_module" : "apply_inlet_process",
            "kratos_module" : "KratosMultiphysics.FluidDynamicsApplication"
        }
        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        output["Parameters"]["modulus"] = this.modulus.value

        this.setOutputData(0, output);
    };

    LiteGraph.registerNodeType("parameters/InletByFunction", InletByFunction);

    console.log("InletByFunction node created"); //helps to debug


//********************************************************************/    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/
    function OutletProcess() {
        this.addInput("model_part","text");
        this.addOutput("Output","object");

        this.properties = {
            "variable_name"      : "PRESSURE",
            "constrained"        : true,
            "value"              : 0.0,
            "hydrostatic_outlet" : false,
            "h_top"              : 0.0
        }
        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    OutletProcess.title = "OutletProcess";
    OutletProcess.desc = "define inlet";

    OutletProcess.prototype.onExecute = function() {
        output =     {
            "python_module" : "apply_outlet_process",
            "kratos_module" : "KratosMultiphysics.FluidDynamicsApplication"
        }
        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)

        this.setOutputData(0, output);
    };

    LiteGraph.registerNodeType("parameters/OutletProcess", OutletProcess);

    console.log("OutletProcess created"); //helps to debug

     //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/
    function ProjectParameters() {
        this.addInput("problem_data", "object"); //0
        this.addInput("output_processes", "object"); //1
        this.addInput("solver_settings", "object"); //2
        this.addInput("initial_conditions_process_list", "object"); //3
        this.addInput("boundary_conditions_process_list", "object"); //4
        this.addInput("gravity", "object"); //5
        this.addInput("auxiliar_process_list", "object"); //6
        



        this.addOutput("project_parameters","object");
        this.size = this.computeSize();
    }

    ProjectParameters.title = "ProjectParameters";
    ProjectParameters.desc = "create an problem_data object";

    ProjectParameters.prototype.onExecute = function() {
        tmp = {};
        tmp["processes"] = {};

        tmp["problem_data"] = this.getInputData(0); //0
        tmp["output_processes"] = this.getInputData(1); //1
        tmp["solver_settings"] = this.getInputData(2); //2
        tmp["processes"]["initial_conditions_process_list"] = this.getInputData(3); //3
        tmp["processes"]["boundary_conditions_process_list"] = this.getInputData(4);
        tmp["processes"]["gravity"] = this.getInputData(5);
        tmp["processes"]["auxiliar_process_list"] = this.getInputData(6); //6

        this.setOutputData(0, tmp);
    };

    LiteGraph.registerNodeType("parameters/ProjectParameters", ProjectParameters);

    console.log("ProjectParameters node created"); //helps to debug

