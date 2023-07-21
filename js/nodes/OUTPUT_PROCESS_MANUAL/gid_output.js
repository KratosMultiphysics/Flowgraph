function GiDIO() {
    this.addInput("ModelPart", "string");
    this.addInput("OutputName", "string");
    this.addOutput("Output Process", "output_process");

    this.properties = {
        "file_label": "time",
        "output_control_type": "step",
        "output_frequency": 1,
        "body_output": true,
        "node_output": false,
        "skin_output": false,
        "plane_output": [],
        "nodal_results": ["VELOCITY", "PRESSURE"],
        "gauss_point_results": []
    }
    
    this.size = this.computeSize();
}

GiDIO.title = "GiD";
GiDIO.desc = "Creates GiD IO";

GiDIO.prototype.onExecute = function () {
    output = {
        "python_module": "gid_output_process",
        "kratos_module": "KratosMultiphysics",
        "process_name": "GiDOutputProcess",
        "help": "This process writes postprocessing files for GiD",
        "Parameters": {
            "postprocess_parameters": {
                "result_file_configuration": {
                    "gidpost_flags": {
                        "GiDPostMode": "GiD_PostBinary",
                        "WriteDeformedMeshFlag": "WriteDeformed",
                        "WriteConditionsFlag": "WriteConditions",
                        "MultiFileFlag": "SingleFile"
                    },
                },
                "point_data_configuration": []
            }
        }
    }
    output["Parameters"]["model_part_name"] = this.getInputData(0);
    output["Parameters"]["output_name"] = this.getInputData(1);

    for(let item in this.properties ) {
        output["Parameters"][item] = this.properties[item];
    }

    this.setOutputData(0, output);
};

LiteGraph.registerNodeType("OUTPUT PROCESS/GiD", GiDIO);

console.log("GiDIO node created"); //helps to debug
