import { DOMWidget } from "/js/widgets/dom.js";
import { VectorWidget } from "/js/widgets/vector.js";

class TestNode {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf1b3', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Set widgets
        // this.srt_wid = this.addWidget("text", "Paco", "Veinte y dos");
        this.addInput("Stage",              "stage_flow");          // 0
        // this.comp_wid_0 = this.addCustomWidget(new VectorWidget("Array Input Name", {"The name of this component is absurdly long": 1, "X": 2, "μ": 3, "在": 9.00}));
        this.comp_wid_1 = this.addCustomWidget(new VectorWidget("Array3D", {"X": 2, "Y": 3, "Z": 0.00}));
        this.comp_wid_2 = this.addCustomWidget(new VectorWidget("Array999D", {"X": 2, "Y": 3, "Z": 0, "A": 3, "B": 3, "C": 3, "D": 3, "E": 3, "F": 3 }));

        let inputDOM = document.createElement("p");
            inputDOM.setAttribute("contenteditable", true);
            inputDOM.innerHTML = "This is a test text";

        // this.comp_wid_2 = this.addCustomWidget(new DOMWidget("Test", inputDOM));

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute() {
        // this.setOutputData(0, this.condition_selector.value);
    }
}

TestNode.title = "TestNode";
TestNode.desc = "Select a condition from the available options";

LiteGraph.registerNodeType("Elem & Cond/Test", TestNode);