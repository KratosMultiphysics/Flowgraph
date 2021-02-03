class ThermallyCoupledSolver extends BaseSolver {
    constructor() {
        super();

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

        this.override_properties = ['domain_size'];    // Define which properties are being override to down-stream nodes
    }

    onExecute() {
        this._value = Object.assign({}, this.properties);

        // Get the input
        this.assignIfNeeded(this._value, "domain_size", this.domain_size.value);
        this._value["echo_level"] = this.echo_level.value;

        if (this.getInputData(0) != undefined) this._value["fluid_solver_settings"] = this.getInputData(0);
        if (this.getInputData(1) != undefined) this._value["thermal_solver_settings"] = this.getInputData(1);

        // Get the output
        this.setOutputData(0, this._value);
    }

    onConnectionsChange() {
        // Check if the up-stream node has change and update the override
        this.handleUpStreamOverride('domain_size', 0);
    }
}

ThermallyCoupledSolver.title = "Thermally coupled solver";
ThermallyCoupledSolver.desc = "Properties for the monolthic fluid solver";

LiteGraph.registerNodeType("solver_settings/ThermallyCoupledSolver", ThermallyCoupledSolver);

console.log("ThermallyCoupledSolver node created");