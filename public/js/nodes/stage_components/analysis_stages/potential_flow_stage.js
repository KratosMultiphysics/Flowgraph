class PotentialFlowStage extends AnalysisStage {
    constructor() {
        super();
        this._type = "KratosMultiphysics.CompressiblePotentialFlowApplication.potential_flow_analysis"
    }
}

PotentialFlowStage.title = "Potential Flow Stage";
PotentialFlowStage.desc = "Stage for Potential Flow problems";

LiteGraph.registerNodeType("Stage components/Analysis stages/PotentialFlowStage", PotentialFlowStage);

console.log("PotentialFlowStage node created");
