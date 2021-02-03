class Models {
    constructor() {
        this.widgets_up = true;
        this.comboWidget = this.addWidget("combo","ModelPart", "DEBUG", (v) => {this.buildOutputs(v)}, { 
            values:["DEBUG_0","DEBUG_1"]
        });

        this.updateCombos();
    }

    updateCombos() {
        this.comboWidget.options.values = [];
        this.problem_modelpart_data = {};

        for (const modelpart of Object.keys(problem_modelparts)) {
            this.comboWidget.options.values.push(problem_modelparts[modelpart][0]);
            this.problem_modelpart_data[problem_modelparts[modelpart][0]] = problem_modelparts[modelpart];
        }
    }

    buildOutputs(value) {
        while (this.outputs != undefined && this.outputs.length != 0) {
            this.removeOutput(0);
        }

        for (const submodelpart of this.problem_modelpart_data[value]) {
            this.addOutput(submodelpart, "string");
        }
    }

    onAdded() {
        model_nodes[this.id] = this;
    }

    onRemoved() {
        delete model_nodes[this.id];
    }

    onExecute() {
    }

    onSelection(e) {
    }
}

Models.title = "Models";
Models.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("model_part/Models", Models);

console.log("Models node created"); //helps to debug