class KeyValue {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf1b3', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // Set inputs
        this.addInput("key", "");
        this.addInput("value", "");

        // Set outputs
        this.addOutput("pair", "");

        // Set widgets
    }

    onExecute() {
        this._pair = {}
        this._pair[this.getInputData(0)] = this.getInputData(1);
        this.setOutputData(0, this._pair);
    }
}

KeyValue.title = "Key Value Pair";
KeyValue.desc = "Assigns a value to a key";

LiteGraph.registerNodeType("IO/KeyValue", KeyValue);
