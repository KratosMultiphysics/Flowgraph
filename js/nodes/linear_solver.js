    //********************************************************************/
    function AMGCLSolver() {
        
        this.properties = {
            "preconditioner_type"            : "amg",
            "solver_type"                    : "AMGCL",
            "provide_coordinates"            : false,
            "max_iteration"                  : 100,
            "gmres_krylov_space_dimension"   : 100,
            "verbosity"                      : 1,
            "tolerance"                      : 1e-6,
            "scaling"                        : false,
            "block_size"                     : 1,
            "use_block_matrices_if_possible" : true,
            "coarse_enough"                  : 1000,
            "max_levels"                     : -1,
            "pre_sweeps"                     : 1,
            "post_sweeps"                    : 1,
            "use_gpgpu"                     : false
        };
        var that = this;
        this.coarsening_type = this.addWidget("combo","Coarsening", "aggregation", function(v){}, { values:["ruge_stuben","aggregation","smoothed_aggregation","smoothed_aggr_emin"]} );
        this.smoother_type = this.addWidget("combo","Smoother", "damped_jacobi", function(v){}, { values:["spai0","spai1","ilu0","ilut","iluk","damped_jacobi","gauss_seidel","chebyshev"]} );
        this.krylov_type = this.addWidget("combo","Krylov", "lgmres", function(v){}, { values:["gmres","bicgstab","cg","bicgstabl","lgmres","fgmres", "bicgstab_with_gmres_fallback","idrs"]} );
        this.addOutput("solver_settings","object");

        //this.size = this.computeSize();
        this.size = [300, 150];
        this.serialize_widgets = true;

    }

    AMGCLSolver.title = "AMGCLSolver";
    AMGCLSolver.desc = "trying to add a new node";

    AMGCLSolver.prototype.onExecute = function() {
        myoutput = this.properties
        myoutput["coarsening_type"] = this.coarsening_type.value
        myoutput["smoother_type"] = this.smoother_type.value
        myoutput["krylov_type"] = this.krylov_type.value

        this.setOutputData(0,  myoutput);
    };

    LiteGraph.registerNodeType("linear_solver/AMGCLSolver", AMGCLSolver);





    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/
    function OutputView() {
        this.addInput("json_object","object");
        this.size = this.computeSize();
    }

    OutputView.title = "OutputView";
    OutputView.desc = "view of an Output object";

    OutputView.prototype.onExecute = function() {
        this.myobj = this.getInputData(0);

        aaa = {"a":1, "sub":{}}
        aaa["sub"] = this.myobj;
    };

    LiteGraph.registerNodeType("linear_solver/OutputView", OutputView);

    console.log("OutputView node created"); //helps to debug