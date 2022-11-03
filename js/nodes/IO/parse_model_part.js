class ParseModelPart {

    constructor() {
        // Node settings
        this.glyph = {
            shape: '\uf6d1',
            font: '900 14px "Font Awesome 5 Free"',
            width: 16,
            height: 9
        };
        this.serialize_widgets = true;

        // Prepare for opening MDPA file
        this.input_manager = document.createElement('input');
        this.input_manager.type = 'file';
        this.input_manager.addEventListener('change', this.onSelection.bind(this));
        this.addWidget("button", "Open...", "", function(value, widget, node) {
            node.input_manager.click();
        });
    }

    onExecute() {
        const out = {
            "mp_settings": {
                "input_type": "mdpa",
                "input_file": this.filename.split('.')[0]
            },
            "dim": this.dim,
            "submodelparts": this.submodelparts
        };
        this.setOutputData(0, out);
    }

    onSelection(e) {

        // Nothing happens until file is opened and node is configured
        const [file] = event.target.files;
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = this.onReaderLoad(file);
        reader.readAsText(file);
    };

    onReaderLoad(file) {
        return ({
            target: {
                result
            }
        }) => {
            const re = /.*((Begin SubModelPart) ([a-zA-Z0-9_-]+))/gm;
            const sub_mdpa = result.matchAll(re);

            // Remove existing outputs
            this.submodelparts = [];
            while (this.outputs != undefined && this.outputs.length != 0) {
                this.removeOutput(0);
            }

            // Get required data: submodelparts, filename, dimension
            let smp_namepath = "";
            for (const match of sub_mdpa) {
                if (match[0].includes("Begin")) {
                    smp_namepath = `${match[3]}`;
                    this.submodelparts.push(smp_namepath);
                }
            }
            this.filename = file.name;
            this.dim = 3 // TODO: implement parsing to compute dimension of the points

            // Create output
            this.addOutput("Model properties", "model_properties");
        }
    }
}

ParseModelPart.title = "Parse MODELPARTS file";
ParseModelPart.desc = "Parses a ModelPart";
LiteGraph.registerNodeType("IO/Parse Model Part", ParseModelPart);
