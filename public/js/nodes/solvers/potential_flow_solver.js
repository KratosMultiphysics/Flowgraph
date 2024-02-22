class PotentialFlowSolver extends Solver {
    constructor() {
        super();

        // node configuration
        this.size = this.computeSize();

        // set inputs
        this.addInput("Modelpart Name",         "string");                  // 0 
        this.addInput("Modelpart Settings",     "model_import_settings");   // 1
        this.addInput("Material  Settings",     "material_import_settings");// 2
        this.addInput("Volume submodelpart",    "string");                  // 3
        this.addInput("Skin submodelparts",     "string_list");             // 4
        this.addInput("NonSkin submodelparts",  "string_list");             // 5

        // set outputs
        this.addOutput("Solver", "solver_settings,fluid_solver_settings");  // 0 

        // set properties
        this.properties = {
            "model_part_name"               : "FluidModelPart",
            "domain_size"                   : 2,
            "solver_type"                   : "potential_flow",
            "model_import_settings"         : {},
            "material_import_settings"      : {
                "materials_filename"        :   "FluidMaterials.json"
                                              },
            "formulation"                   : {
                "element_type"              :   "compressible"
                                              },
            "maximum_iterations"            : 50,
            "echo_level"                    : 1,
            "volume_model_part_name"        : "FluidParts_Fluid",
            "skin_parts"                    : [],
            "no_skin_parts"                 : [],
            "reform_dofs_at_each_step"      : false
        };

        this.echo_level = this.addWidget("combo", "Echo level", this.properties["echo_level"], { property:"echo_level", values: [0, 1, 2, 3]});
        this.max_iterat = this.addWidget("number", "Maximum iterations", this.properties["maximum_iterations"], "maximum_iterations", {min: 1, max: 100, step: 1});
    }

    onExecute() {
        this._value = Object.assign({}, this.properties);

        if (this.getInputData(0) != undefined) {
            this._value["model_part_name"] = this.getInputData(0);
        }

        if (this.getInputData(1) != undefined) {
            this._value["model_import_settings"] = this.getInputData(1);
        }

        if (this.getInputData(2) != undefined) {
            this._value["material_import_settings"] = this.getInputData(2);
        }

        if (this.getInputData(3) != undefined) {
            this._value["volume_model_part_name"] = this.getInputData(3);
        }

        if (this.getInputData(4) != undefined) {
            this._value["skin_parts"] = this.getInputData(4);
        }

        if (this.getInputData(5) != undefined) {
            this._value["no_skin_parts"] = this.getInputData(5);
        }

        this.setOutputData(0, this._value);
    }
}

PotentialFlowSolver.title = "Potential Flow Solver";
PotentialFlowSolver.desc = "Properties for the potential flow solver";

LiteGraph.registerNodeType("Solvers/Potential Flow", PotentialFlowSolver);
