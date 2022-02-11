class ImportMdpaModeler {
    constructor() {
        // Model
        this.MODEL_INPUT  = 0;
        this.MODEL_OUTPUT = 0;

        this._model = [];
        this._model_operations = [];

        // Identifier Glyph
        this.glyph = {shape: '\uf6cf', font:'900 14px "Font Awesome 5 Free"', width: 16, height: 9};

        // List of inputs and outputs ("name", "type")
        this.addInput("Stage", "stage_flow");

        // List Manager
        this.input_manager = document.createElement('input');
        this.input_manager.type = 'file';
        this.input_manager.addEventListener('change', this.onSelection.bind(this));

        this.mp_name = this.addWidget("text","Name", "", function(v){}, {} );
        this.mp_select = this.addWidget("button", "Load Mdpa", "", function (value, widget, node) {
            node.input_manager.click();
        });

        this.addOutput("Modeler", "stage_flow");

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute() {
        this._value = {"model": this._model};

        this.setOutputData(0, this._value);
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

            // Remove existing model operations.
            this._model_operations = [];

            // Obtain the name of the ModelPart to get complete routes.
            let sub_mdpa_namepath = ""
            this.mp_name.value = file.name.slice(0, -5);

            // Obtain the Submodelparts
            for (const match of sub_mdpa) {
                if (match[0].includes("Begin")) {
                    sub_mdpa_namepath = `${sub_mdpa_namepath}.${match[3]}`;
                    this._model_operations.push({code:"add", data:sub_mdpa_namepath});
                }

                if (match[0].includes("End")) {
                    sub_mdpa_namepath = sub_mdpa_namepath.split(".");
                    sub_mdpa_namepath.pop();
                    sub_mdpa_namepath = sub_mdpa_namepath.join(".");
                }
            }

            // If there are nodes upstream, trigger the execution of onUpdateModel
            // I can call this because I will extend the class.
            this.onUpdateModel();
        }
    }
}

ImportMdpaModeler.title = "Import Mdpa Modeler";
ImportMdpaModeler.desc  = "This modeler loads a Mpda file and makes its modelparts avaliable";

LiteGraph.registerNodeType("Stages/Modelers/Import Mdpa", ModelManager.registerNodeType(ImportMdpaModeler));

console.log("ImportMdpaModeler node created"); //helps to debug