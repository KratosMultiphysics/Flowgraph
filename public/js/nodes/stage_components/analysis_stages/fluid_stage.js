class FluidAnalysisStage extends AnalysisStage {
    constructor() {
        super();
        this._type = "KratosMultiphysics.FluidDynamicsApplication.fluid_dynamics_analysis"
    }
}

FluidAnalysisStage.title = "Fluid analysis stage";
FluidAnalysisStage.desc = "Base FluidDynamicsApplication stage";

LiteGraph.registerNodeType("Stage components/Analysis stages/FluidAnalysisStage", FluidAnalysisStage);

console.log("FluidAnalysisStage node created");
