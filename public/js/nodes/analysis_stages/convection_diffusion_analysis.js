class ConvectionDiffusionAnalysis extends AnalysisStage {
    constructor() {
        super();
        this._type = "KratosMultiphysics.ConvectionDiffusionApplication.convection_diffusion_analysis"
    }
}

ConvectionDiffusionAnalysis.title = "Convection-diffusion";
ConvectionDiffusionAnalysis.desc = "Base ConvectionDiffusionApplication stage";

LiteGraph.registerNodeType("Analysis stages/ConvectionDiffusionAnalysis", ConvectionDiffusionAnalysis);

console.log("ConvectionDiffusionAnalysis node created");
