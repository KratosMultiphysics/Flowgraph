
//********************************************************************/    
//********************************************************************/    
//********************************************************************/    
//********************************************************************/
function GidIO() {
    this.addInput("ModelPart", "string");
    this.addInput("OutputName", "string");
    this.addOutput("GidIO", "object");

    this.settings = {
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

GidIO.title = "GidIO";
GidIO.desc = "Creates Gid IO";

GidIO.prototype.onExecute = function () {
    tmp = this.settings
    tmp["Parameters"]["model_part_name"] = this.getInputData(0);
    tmp["Parameters"]["output_name"] = this.getInputData(1);

    for(let item in this.properties )
    {
        console.log(item)
        tmp["Parameters"][item] = this.properties[item]
    }

    this.setOutputData(0, [tmp]);
};

LiteGraph.registerNodeType("postprocess/GidIO", GidIO);

console.log("GidIO node created"); //helps to debug