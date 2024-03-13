import { AnalysisStage } from "/js/nodes/analysis_stages/base/analysis_stage.js";

class PotentialFlowAnalysis extends AnalysisStage {
    constructor() {
        super();
        this._type = "KratosMultiphysics.CompressiblePotentialFlowApplication.potential_flow_analysis"
    }
}

PotentialFlowAnalysis.title = "Potential flow";
PotentialFlowAnalysis.desc = "Stage for Potential Flow problems";

LiteGraph.registerNodeType("Analysis stages/PotentialFlowAnalysis", PotentialFlowAnalysis);

console.log("PotentialFlowAnalysis node created");
