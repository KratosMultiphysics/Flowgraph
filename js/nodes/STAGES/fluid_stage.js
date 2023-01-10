class FluidAnalysisStage extends AnalysisStage {
    constructor() {
        super();
        this._type = "KratosMultiphysics.FluidDynamicsApplication.fluid_dynamics_analysis"
    }
}

FluidAnalysisStage.title = "Fluid analysis stage";
FluidAnalysisStage.desc = "Select different ModelParts and access their submodelparts directly";

LiteGraph.registerNodeType("STAGES/FluidAnalysisStage", FluidAnalysisStage);

console.log("FluidAnalysisStage node created");
