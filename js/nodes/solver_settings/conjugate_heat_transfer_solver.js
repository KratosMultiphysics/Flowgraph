class ConjugateHeatTransferSolver {
    constructor() {
        this.addInput("fluid_domain_solver_settings", "solver_settings");       // 0
        this.addInput("solid_domain_solver_settings", "solver_settings");       // 1
        this.addInput("coupling_settings", "coupling_settings");                // 2
        this.addOutput("solver_settings", "solver_settings");

        this.properties =  {
            "solver_type": "conjugate_heat_transfer",
            "domain_size": -1,
            "echo_level": 0,
            "fluid_domain_solver_settings": {
                "solver_type": "ThermallyCoupled",
                "domain_size": -1,
                "echo_level": 1,
                "fluid_solver_settings": {
                    "solver_type": "Monolithic",
                    "model_import_settings": {
                        "input_type": "mdpa",
                        "input_filename": "unknown_name"
                    }
                },
                "thermal_solver_settings":{
                    "model_part_name": "FluidThermalModelPart",
                    "solver_type": "Transient",
                    "analysis_type": "linear",
                    "model_import_settings": {
                        "input_type": "use_input_model_part"
                    },
                    "material_import_settings": {
                        "materials_filename": "ThermicMaterialsFluid.json"
                    }
                }
            },
            "solid_domain_solver_settings":{
                "solid_solver_settings": {
                },
                "thermal_solver_settings": {
                    "model_part_name": "SolidThermalModelPart",
                    "solver_type": "Transient",
                    "analysis_type": "linear",
                    "model_import_settings": {
                        "input_type": "mdpa",
                        "input_filename": "unknown_name"
                    },
                    "material_import_settings": {
                        "materials_filename": "ThermicMaterialsSolid.json"
                    }
                }
            },
            "coupling_settings":{
                "max_iteration": 10,
                "temperature_relative_tolerance": 1e-5,
                "dirichlet_coupling_interface": "fluid",
                "variable_redistribution_settings": {
                    "absolute_tolerance": 1.0e-9,
                    "max_iterations": 200
                },
                "mappers_settings": {
                    "echo_level": 0,
                    "distance_threshold": 1.0e+24,
                    "absolute_convergence_tolerance": 1.0e-9,
                    "relative_convergence_tolerance": 1.0e-7,
                    "max_number_iterations": 10,
                    "integration_order": 2,
                    "search_parameters": {
                        "allocation_size": 1000,
                        "bucket_size": 4,
                        "search_factor": 1.0
                    }
                },
                "convergence_accelerator_settings": {
                    "solver_type": "Relaxation",
                    "acceleration_type": "Aitken",
                    "w_0": 0.5
                },
                "fluid_interfaces_list": [],
                "solid_interfaces_list": []
            }
        };
        
        this.domain_size = this.addWidget("combo","Domain Size", "2", function(v){}, { values:["2","3"]} );
        this.echo_level = this.addWidget("combo","Echo Level", "0", function(v){}, { values:["0", "1", "2","3"]} );
        this.size = this.computeSize();
    }

    onExecute() {
        this._value = Object.assign({}, this.properties);

        this._value["domain_size"] = this.domain_size.value;
        this._value["echo_level"] = this.echo_level.value;

        this._value["fluid_domain_solver_settings"] = this.getInputData(0);
        this._value["solid_domain_solver_settings"] = this.getInputData(1);
        this._value["coupling_settings"] = this.getInputData(2);

        // Get the output
        this.setOutputData(0, this._value);
    }
}

ConjugateHeatTransferSolver.title = "Conjugate heat transfer";
ConjugateHeatTransferSolver.desc = "Properties for the monolthic fluid solver";

LiteGraph.registerNodeType("solver_settings/ConjugateHeatTransferSolver", ConjugateHeatTransferSolver);

console.log("ConjugateHeatTransferSolver node created");