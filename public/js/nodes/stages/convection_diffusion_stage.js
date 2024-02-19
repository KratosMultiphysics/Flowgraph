class ConvectionDiffusionStage extends AnalysisStage {
    constructor() {
        super();
        this._type = "KratosMultiphysics.ConvectionDiffusionApplication.convection_diffusion_analysis"
    }
}

ConvectionDiffusionStage.title = "Convection Diffusion stage";
ConvectionDiffusionStage.desc = "Base ConvectionDiffusionApplication stage";

LiteGraph.registerNodeType("Stages/ConvectionDiffusionStage", ConvectionDiffusionStage);

console.log("ConvectionDiffusionStage node created");
