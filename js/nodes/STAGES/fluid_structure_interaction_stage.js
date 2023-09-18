class FsiStage extends AnalysisStage {
    constructor() {
        super();
        this._type = "KratosMultiphysics.FSIApplication.fsi_analysis"
    }
}

FsiStage.title = "Fluid Structure Interaction analysis stage";
FsiStage.desc = "Base FSIApplication stage";

LiteGraph.registerNodeType("Stages/FsiStage", FsiStage);

console.log("FsiStage node created");
