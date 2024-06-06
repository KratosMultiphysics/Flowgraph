import { Process } from "/js/nodes/processes/base/process.js";

class ApplyInletProcess extends Process {
    constructor() {
        super();

        this.addInput("model_part","string");
        this.addOutput("Process","process_list");

        this.variable_name = this.addWidget("string","Variable", "VELOCITY", function(v){} );
        this.modulus = this.addWidget("string","Modulus", "", function(v){} );
        this.direction = this.addWidget("string","Direction", "automatic_inwards_normal", function(v){} );

        this.variable_name.tooltip = (w) => {
            let help_tooltip = {
                "title": `${w.name}`,
                "value": `${w.value}`,
                "descp": [
                    "Name of the target variable of the process.",
                ],
            }

            return help_tooltip;
        }

        this.modulus.tooltip = (w) => {
            let help_tooltip = {
                "title": `${w.name}`,
                "value": `${w.value}`,
                "descp": [
                    "Modulus of the value that will be assigned to the targeted variable",
                    "Can be assigned as a number or function of x,y,z and t",
                ],
            }

            return help_tooltip;
        }

        this.direction.tooltip = (w) => {
            let help_tooltip = {
                "title": `${w.name}`,
                "value": `${w.value}`,
                "descp": [
                    "Defines the direction of the variable. It can be assigned as",
                    "a vector or using one of the following predefined strings:",
                    "\t - automatic_inwards_normal",
                    "\t - automatic_outwards_normal"
                ],
            }

            return help_tooltip;
        }

        this.properties = {
            "interval" : [0, 1e30]
        }

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        let output = {
            "python_module" : "apply_inlet_process",
            "kratos_module" : "KratosMultiphysics.FluidDynamicsApplication"
        }

        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
        output["Parameters"]["variable_name"] = this.variable_name.value
        output["Parameters"]["modulus"] = this.modulus.value
        output["Parameters"]["direction"] = this.direction.value

        this.setOutputData(0, [output]);
    };
}

// Set the node name and the description
ApplyInletProcess.title = "Apply inlet process";
ApplyInletProcess.doc_ref = "https://kratosmultiphysics.github.io/Kratos/pages/Kratos/Processes/General/AnalysisStage.html"
ApplyInletProcess.desc = "Define inlet.";
ApplyInletProcess.doc = `<span class='glyph-solid'>&#xf02d</span> <a href="${ApplyInletProcess.doc_ref}">Apply Inlet Process</a>`;

LiteGraph.registerNodeType("Processes/Fluid dynamics/ApplyInletProcess", ApplyInletProcess);

console.log("ApplyInletProcess node created"); //helps to debug
