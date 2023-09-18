class ApplyThermalFaceProcess extends Process {
    constructor() {
        super();
        
        this.addInput("model_part","string");
        this.addOutput("Process","process_list");

        this.properties = {
            "model_part_name": "",
            "ambient_temperature": 0.0,
            "add_ambient_radiation": false,
            "emissivity": 0.0,
            "add_ambient_convection": false,
            "convection_coefficient": 0.0,
            "interval": [0.0,1e30]
        }

        this.serialize_widgets = true;
        this.size = this.computeSize();
    }

    onExecute = function() {
        let output =     {
            "python_module" : "apply_thermal_face_process",
            "kratos_module" : "KratosMultiphysics.ConvectionDiffusionApplication.python_scripts"
        }
        
        output["Parameters"] = this.properties
        output["Parameters"]["model_part_name"] = this.getInputData(0)
    
        this.setOutputData(0, [output]);
    };
}

ApplyThermalFaceProcess.title = "ThermalFace Process";
ApplyThermalFaceProcess.desc = "Define ThermalFace";

LiteGraph.registerNodeType("Processes/ApplyThermalFaceProcess", ApplyThermalFaceProcess);

console.log("ApplyThermalFaceProcess created"); //helps to debug
