class ParseModelPartSubmodelparts {

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

        // List of submodelparts
        this.properties = {
            "submodelpart_list": []
        };
    }

    onExecute() {
        const out = {
            "mp_name": this.mpname.value,
            "mp_settings": {
                "input_type": "mdpa",
                "input_file": this.filename.split('.')[0]
            },
            "dim": this.dim,
            "submodelparts": this.properties["submodelpart_list"]
        }
        this.setOutputData(0, out);
        for (let i = 1; i < this.outputs.length; ++i) {
            const out = {
                "mp_name": this.mpname.value,
                "smp_name": this.outputs[i].name
            }
            this.setOutputData(i, out);
        }
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

        // Continue
        this.mpname = this.addWidget("text", "Modelpart", "UNSET", function(v) {}, {});

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
            this.properties["submodelpart_list"] = [];
            while (this.outputs != undefined && this.outputs.length != 0) {
                this.removeOutput(0);
            }

            // Obtain mdpa filename
            this.filename = file.name;

            // Parse and compute dimension of the points
            // TODO: implement parsing
            this.dim = 3


            // Obtain the Submodelparts
            let sub_mdpa_namepath = "";
            for (const match of sub_mdpa) {
                if (match[0].includes("Begin")) {
                    sub_mdpa_namepath = `${match[3]}`;
                    //sub_mdpa_namepath = `${sub_mdpa_namepath}.${match[3]}`;
                    this.properties["submodelpart_list"].push(sub_mdpa_namepath);
                }

                if (match[0].includes("End")) {
                    sub_mdpa_namepath = sub_mdpa_namepath.split(".");
                    sub_mdpa_namepath.pop();
                    sub_mdpa_namepath = sub_mdpa_namepath.join(".");
                }
            }



            // Create outputs
            this.addOutput("Modelpart Settings", "modelpart_settings");
            for (const submodelpart of this.properties["submodelpart_list"]) {
                this.addOutput(submodelpart, "modelpart");
            }
        }
    }
}

ParseModelPartSubmodelparts.title = "Parse MODELPARTS w SMP file";
ParseModelPartSubmodelparts.desc = "Parses a ModelPart";
LiteGraph.registerNodeType("IO/Parse Model Part with submodelparts", ParseModelPartSubmodelparts);
