    function InletByFunction() {
        this.addInput("model_part","string");
        this.addOutput("OutputList","map");

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
