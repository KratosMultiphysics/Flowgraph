import { AnalysisStage } from "/js/nodes/analysis_stages/base/analysis_stage.js";

class FluidDynamicsAnalysis extends AnalysisStage {
    constructor() {
        super();
        this._type = "KratosMultiphysics.FluidDynamicsApplication.fluid_dynamics_analysis"
    }
}

FluidDynamicsAnalysis.title = "Fluid dynamics";
FluidDynamicsAnalysis.desc = "Base FluidDynamicsApplication stage";

LiteGraph.registerNodeType("Analysis stages/FluidDynamicsAnalysis", FluidDynamicsAnalysis);

console.log("FluidDynamicsAnalysis node created");
