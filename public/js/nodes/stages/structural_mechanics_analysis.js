class StructuralMechanicsStage extends AnalysisStage {
    constructor() {
        super();
        this._type = "KratosMultiphysics.StructuralMechanicsApplication.structural_mechanics_analysis";
    }
}

StructuralMechanicsStage.title = "Structural Mechanics Analysis Stage";
StructuralMechanicsStage.desc = "Structural mechanics analysis stage";

LiteGraph.registerNodeType("Stages/StructuralMechanicsStage", StructuralMechanicsStage);

console.log("StructuralMechanicsStage node created");