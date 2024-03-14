function MonolithicFormulation() {

        this.size = this.computeSize();

        this.output = {
            "type": "monolithic",
            "formulation": {
                "element_type": "",
                "use_orthogonal_subscales": -1,
                "dynamic_tau": -1
            }
        }

        this.element_type = this.addWidget("combo", "Element", "vms",
            function(v) {}, {
                values: ["vms", "vms"]
            });
        this.use_subscale = this.addWidget("combo", "Orthogonal subsc", false,
            function(v) {}, {
                values: [false, true]
            });
        this.dynamic_tau = this.addWidget("number", "Dynamic tau ", 1,
            function(v) {}, {
                min: 0, max: 1,
            });

        this.addOutput("Formulation", "formulation");

}

MonolithicFormulation.prototype.onExecute = function() {

        this.output["formulation"]["element_type"] = this.element_type.value;
        this.output["formulation"]["use_orthogonal_subscales"] = this.use_subscale.value;
        this.output["formulation"]["dynamic_tau"] = this.dynamic_tau.value;

        this.setOutputData(0, this.output);
}

MonolithicFormulation.title = "Monolithic formulation";
MonolithicFormulation.desc = "Description of the monolitic formulation";
LiteGraph.registerNodeType("Solvers/Formulations/Monolithic", MonolithicFormulation);
