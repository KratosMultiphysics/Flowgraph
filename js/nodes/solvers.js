    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/
    function MonolithicFluidSolver() {
        this.addInput("model_part_name", "string");
        this.addInput("ProblemData", "object");
        this.addInput("domain_size", "number");
        this.addInput("volume_model_part_name", "string");
        this.addInput("skin_parts", "object");
        this.addInput("no_skin_parts", "object");

        this.addOutput("solver_settings","object");

        this.properties = {
            "solver_type"                 : "Monolithic",
            "model_import_settings"       : {
                "input_type"     : "mdpa",
            },
            "echo_level"                  : 0,
            "compute_reactions"           : false,
            "maximum_iterations"          : 10,
            "relative_velocity_tolerance" : 0.001,
            "absolute_velocity_tolerance" : 1e-5,
            "relative_pressure_tolerance" : 0.001,
            "absolute_pressure_tolerance" : 1e-5,
            "volume_model_part_name"      : "",
            "skin_parts"                  : [],
            "no_skin_parts"               : [],
            "time_stepping"               : {
                "automatic_time_step" : false,
                "time_step"           : 0.1
            },
            "formulation"                 : {
                "element_type"             : "vms",
                "use_orthogonal_subscales" : false,
                "dynamic_tau"              : 1.0
            },
            "reform_dofs_at_each_step"    : false
        }
        this.size = this.computeSize();
    }

    MonolithicFluidSolver.title = "MonolithicFluidSolver";
    MonolithicFluidSolver.desc = "Creates Gid IO";

    MonolithicFluidSolver.prototype.onExecute = function() {
        tmp = this.properties
        tmp["model_import_settings"]["input_filename"] = this.getInputData(0)["problem_name"];
        tmp["model_part_name"] = this.getInputData(1);
        tmp["domain_size"] = this.getInputData(2);

        tmp["volume_model_part_name"] = this.getInputData(3);;
        tmp["skin_parts"] =this.getInputData(4);
        tmp["no_skin_parts"] = this.getInputData(5);
        this.setOutputData(0, tmp);
    };

    LiteGraph.registerNodeType("solvers/MonolithicFluidSolver", MonolithicFluidSolver);

    console.log("MonolithicFluidSolver node created"); //helps to debug