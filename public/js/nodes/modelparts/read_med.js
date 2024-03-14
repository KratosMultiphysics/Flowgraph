import h5wasm from "https://cdn.jsdelivr.net/npm/h5wasm@0.4.9/dist/esm/hdf5_hl.js";

const Module = await h5wasm.ready;
const { FS } = Module;

class ReadMed {
    constructor() {
        // Identifier Glyph
        this.glyph = {shape: '\uf6d1', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")

        /* 
            This section is intentionally left empty because the node
            outputs will get populated based on the loaded file. 
        */

        // File Manager
        this.input_manager = document.createElement('input');
        this.input_manager.type = 'file';
        this.input_manager.addEventListener('change', this.onSelection.bind(this));

        this.mp_select = this.addWidget("button", "Load Mdpa", "", function (value, widget, node) {
            node.input_manager.click();
        });

        this.filename = "";
        this._loaded = false;
        this._output_slector_map = [];
        this._submodelpart_names = [];
        this._selected_mdpa_vals = ["none"];

        this.size = this.computeSize();

        // We handle the serialization of this node manually
        this.serialize_widgets = true;
    }

    rebuildNode() {
        this.wipeNode();
        this.widgets_up = true;

        console.log("onAddedWp", this._selected_mdpa_vals)
        
        // Add back all widgets and outputs
        for(let i = 0; i < this._selected_mdpa_vals.length; i++) {
            console.log("Adding something...")
            // this.addOutput(null, "string");
            this._output_slector_map.push(this.addWidget("combo","ModelPart", this._selected_mdpa_vals[i], (v) => {}, { 
                values:this._submodelpart_names,
            }));
        }

        this.setDirtyCanvas(true, true);
    }

    onAdded() {
        console.log("onAdded", this._selected_mdpa_vals)
        
        // Wipe the node
        if (this._loaded) {
            this.rebuildNode();
        }
    }

    onConfigure(info) {
        console.log(" -- onConfigure -- ", info);
        
        this.rebuildNode();
    }

    onSerialize(serilized) {
        // We have to serialize the values of the widgets ourselves because
        // they will be destroyed during the serialization
        console.log(" -- onSerialize -- ");

        serilized["_loaded"] = this._loaded;
        serilized["_submodelpart_names"] = this._submodelpart_names;
        serilized["_output_slector_map"] = this._output_slector_map;
        serilized["_selected_mdpa_vals"] = [...this._output_slector_map.map(w => w.value)];

        console.log("_selected_mdpa_vals", serilized)
    }

    onExecute() {
        console.log(this._output_slector_map)
        if(this.outputs && this.outputs.length > 0) {
            for (let i = 0; i < this.outputs.length; i++) {
                console.log(this.isOutputConnected(i))
                if (this.isOutputConnected(i)) {
                    this.setOutputData(i, this._output_slector_map[i].value);   
                }
            }
        }
    }

    onSelection(e) {
        const [file] = e.target.files;
        this.readModelList(file);
    }

    onReaderLoad(file) {
        return ({ target: { result } }) => {
            FS.writeFile(`${file.name}`, new Uint8Array(result));
            let f = new h5wasm.File(`${file.name}`, "r");

            for(let mesh of f.get('FAS').keys()) {
                // Obtain the Groups
                for (const group of f.get(`FAS/${mesh}/ELEME`).keys()) {
                    this._submodelpart_names.push(`${group}`.slice(7));
                }
            }
            console.log(this._submodelpart_names)
            
            // Change the title to the filename
            this.title = file.name;
            
            // Wipe the node
            this.wipeNode();
            this.widgets_up = true;

            // Update the outputs to force the first slot to appear
            this.updateNodeOutputSlots(LiteGraph.OUTPUT);
        }
    }

    /**
     * Executed on connection change.
     * This function can get extended my ModelNode.
     * @param {*} type 
     * @param {*} slot 
     * @param {*} connected 
     * @param {*} link_info 
     * @param {*} input_info 
     */
    onConnectionsChange(type, slot, connected, link_info, input_info) {
        this.updateNodeOutputSlots(type);
    }

    /* Internal */

    /**
     * Wipes out node widgets, inputs and outputs.
     */
    wipeNode() {
        // Clean io/widgets
        // this.inputs = [];
        // this.outputs = [];
        this.widgets = [];

        // Clean internal data
        this._output_slector_map = [];

        // Redraw
        this.setDirtyCanvas(true, true);
    }

    /**
     * Read the node's model with the values from a file.
     * @param {*} source ModelPart file
     */
    readModelList(source) {
        if (!source) {
            return;
        }

        const reader = new FileReader();

        reader.onload = this.onReaderLoad(source);
        reader.readAsArrayBuffer(source);
    };

    /**
     * Updates the list outputs on the node
     * @param {connection type} type 
     */
    updateNodeOutputSlots(type) {
        console.log(" -- Rebuild output -- ");
        if (type == LiteGraph.OUTPUT) {
            // Remove unconnected nodes
            if(this.outputs) {
                for (let i = 1; i < this.outputs.length; i++) {
                    if (!this.isOutputConnected(i)) {
                        this.removeOutput(i);
                        this.removeWidget(i);

                        // Delete the internal reference that we have in the node.
                        this._output_slector_map.splice(i, 1);
                    }
                }
            }

            // If all nodes are connected, or there are no nodes, add one.
            if (!this.outputs || this.outputs.length < 1 || this.isOutputConnected(this.outputs.length - 1)) {
                this.addOutput(null, "string");
                this._output_slector_map.push(this.addWidget("combo","ModelPart", this._submodelpart_names[0], (v) => {}, { 
                    values:this._submodelpart_names,
                }));
            }

            this.setSize(1, this.outputs.length);
        }
        this.size = this.computeSize();
    }
}

ReadMed.title = "Read Med";
ReadMed.desc  = "This nodes reads a Mpda file and makes its modelparts avaliable";

LiteGraph.registerNodeType("ModelParts/Read Med", ReadMed);

console.log("ReadMed node created"); //helps to debug
