//********************************************************************/
//********************************************************************/
//********************************************************************/
//********************************************************************/
function OutletProcess() {
    this.addInput("model_part","string");
    this.addOutput("Process","process");

    this.properties = {
        "variable_name"      : "PRESSURE",
        "constrained"        : true,
        "value"              : 0.0,
        "hydrostatic_outlet" : false,
        "h_top"              : 0.0
    }
    this.size = this.computeSize();
    this.serialize_widgets = true;
}

OutletProcess.title = "OutletProcess";
OutletProcess.desc = "Define outlet";

OutletProcess.prototype.onExecute = function() {
    output =     {
        "python_module" : "apply_outlet_process",
        "kratos_module" : "KratosMultiphysics.FluidDynamicsApplication"
    }
    output["Parameters"] = this.properties
    output["Parameters"]["model_part_name"] = this.getInputData(0)

    this.setOutputData(0, output);
};

LiteGraph.registerNodeType("processes/OutletProcess", OutletProcess);

console.log("OutletProcess created"); //helps to debug
