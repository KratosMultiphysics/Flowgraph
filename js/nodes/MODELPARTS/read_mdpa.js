class ReadMdpa {
    constructor() {
        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        // Identifier Glyph
        this.glyph = {shape: '\uf6d1', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")

        /* This section is intentionally left empty because the node
           outputs will get populated based on the loaded file. */

        // File Manager
        this.input_manager = document.createElement('input');
        this.input_manager.type = 'file';
        this.input_manager.addEventListener('change', this.onSelection.bind(this));

        this.mp_select = this.addWidget("button", "Load Mdpa", "", function (value, widget, node) {
            node.input_manager.click();
        });

        this.filename = "";
        this._output_slector_map = [];
        this._submodelpart_names = [];

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute() {
        if(this.outputs && this.outputs.length > 0) {
            this.setOutputData(0, `${this.filename}.mdpa`);

            for (let i = 0; i < this.outputs.length; i++) {
                if (this.isOutputConnected(i)) {
                    this.setOutputData(i, this._output_slector_map[i].value);   
                }
            }
        }
    }

    onSelection(e) {
        const [file] = event.target.files;
        this.readModelList(file);
    }

    /**
     * Read the node's model with the values from a file.
     */
    readModelList(source) {
        if (!source) {
            return;
        }

        const reader = new FileReader();

        reader.onload = this.onReaderLoad(source);
        reader.readAsText(source);
    };

    onReaderLoad(file) {
        return ({ target: { result } }) => {
            const mdpa_subs_re = /.*((Begin SubModelPart) ([a-zA-Z0-9_]+))|(End SubModelPart$)/gm;
            const sub_mdpa = result.matchAll(mdpa_subs_re);

            // Obtain the name of the ModelPart to get complete routes.
            let sub_mdpa_namepath = ""
            this.filename = file.name.slice(0, -5);
            
            // Add the filename and the main modelpart names to the list
            this._submodelpart_names.push(`${this.filename}.mdpa`);
            this._submodelpart_names.push(this.filename);

            // Obtain the Submodelparts
            for (const match of sub_mdpa) {
                if (match[0].includes("Begin")) {
                    sub_mdpa_namepath = `${sub_mdpa_namepath}.${match[3]}`;
                    this._submodelpart_names.push(`${this.filename}${sub_mdpa_namepath}`)
                }

                if (match[0].includes("End")) {
                    sub_mdpa_namepath = sub_mdpa_namepath.split(".");
                    sub_mdpa_namepath.pop();
                    sub_mdpa_namepath = sub_mdpa_namepath.join(".");
                }
            }
            
            // Trigger an update which will convert the node
            this.wipeNode();
            this.widgets_up = true;

            // Update the node
            this.title = file.name;
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
        this.inputs = [];
        this.outputs = [];
        this.widgets = [];
        this.setDirtyCanvas(true, true);
    }

    /**
     * Updates the list outputs on the node
     * @param {connection type} type 
     */
    updateNodeOutputSlots(type) {
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
            if (!this.outputs || this.outputs.length <= 1 || this.isOutputConnected(this.outputs.length - 1)) {
                this.addOutput(null, "string");
                this._output_slector_map.push(this.addWidget("combo","ModelPart", this._submodelpart_names[0], null, { 
                    values:this._submodelpart_names,
                }));
            }

            this.setSize(1, this.outputs.length);
            this.size = this.computeSize();
        }
        this.size = this.computeSize();
    }
}

ReadMdpa.title = "Read Mdpa";
ReadMdpa.desc  = "This nodes reads a Mpda file and makes its modelparts avaliable";

LiteGraph.registerNodeType("MODELPARTS/Read Mdpa", ReadMdpa);

console.log("ReadMdpa node created"); //helps to debug
