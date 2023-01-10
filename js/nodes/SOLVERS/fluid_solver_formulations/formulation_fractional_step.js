function FractionalStepFormulation() {

        this.size = this.computeSize();

        this.output = {
            "type": "FrationalStep",
            "formulation": {
                "fract_step_coeff_0": "",
                "fract_step_coeff_1": "",
                "fract_step_coeff_1": "",
            }
        }

        this.element_type = this.addWidget("combo", "Element", "vms",
            function(v) {}, {
                values: ["vms", "vms"]
            });
        this.use_subscale = this.addWidget("combo", "Orthogonal subsc", "false",
            function(v) {}, {
                values: ["false", "true"]
            });
        this.dynamic_tau = this.addWidget("number", "Dynamic tau ", 1.0,
            function(v) {}, {
                min: 0, max: 1,
            });

        this.addOutput("Formulation", "formulation");

}

FractionalStepFormulation.prototype.onExecute = function() {

        this.output["formulation"]["fract_step_coeff_0"] = this.element_type.value;
        this.output["formulation"]["fract_step_coeff_1"] = this.use_subscale.value;
        this.output["formulation"]["fract_step_coeff_2"] = this.dynamic_tau.value;

        this.setOutputData(0, this.output);
}

FractionalStepFormulation.title = "Fractional step formulation";
FractionalStepFormulation.desc = "Description of the fractional step formulation";
LiteGraph.registerNodeType("SOLVERS/Formulations/FractionalStep", FractionalStepFormulation);
