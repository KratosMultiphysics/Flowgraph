import { AnalysisStage } from "/js/nodes/analysis_stages/base/analysis_stage.js";

class StructuralMechanicsAnalysis extends AnalysisStage {
    constructor() {
        super();
        this._type = "KratosMultiphysics.StructuralMechanicsApplication.structural_mechanics_analysis";
    }
}

StructuralMechanicsAnalysis.title = "Structural mechanics";
StructuralMechanicsAnalysis.desc = "Structural mechanics analysis stage";

LiteGraph.registerNodeType("Analysis stages/StructuralMechanicsAnalysis", StructuralMechanicsAnalysis);

console.log("StructuralMechanicsAnalysis node created");