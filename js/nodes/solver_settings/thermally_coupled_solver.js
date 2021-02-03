class ThermallyCoupledSolver {
    constructor() {
        this.addInput("fluid_solver_settings", "solver_settings");          // 0
        this.addInput("thermal_solver_settings", "solver_settings");        // 1
        this.addOutput("solver_settings", "solver_settings");

        this.properties =  {
            "solver_type": "ThermallyCoupled",
            "domain_size": -1,
            "echo_level": 1,
            "fluid_solver_settings": {},
            "thermal_solver_settings":{}
        };
        
        this.domain_size = this.addWidget("combo","Domain Size", "2", function(v){}, { values:["2","3"]} );
        this.echo_level = this.addWidget("combo","Echo Level", "0", function(v){}, { values:["0", "1", "2","3"]} );
        this.size = this.computeSize();
    }

    onExecute() {
        this._value = Object.assign({}, this.properties);

        // Get the input
        this._value["domain_size"] = this.domain_size.value;
        this._value["echo_level"] = this.echo_level.value;

        this._value["fluid_solver_settings"] = this.getInputData(0);
        this._value["thermal_solver_settings"] = this.getInputData(1);

        // Get the output
        this.setOutputData(0, this._value);
    }
}

ThermallyCoupledSolver.title = "Thermally coupled solver";
ThermallyCoupledSolver.desc = "Properties for the monolthic fluid solver";

LiteGraph.registerNodeType("solver_settings/ThermallyCoupledSolver", ThermallyCoupledSolver);

console.log("ThermallyCoupledSolver node created");