class ParsedModelPart {
    constructor() {
        this.input_manager = document.createElement('input');
        this.input_manager.type = 'file';
        this.input_manager.addEventListener('change', this.onSelection.bind(this));

        this.mp_select = this.addWidget("button", "Load Mdpa", "", function (value, widget, node) {
            console.log(node.input_manager.value);
            node.input_manager.click();
        });

        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    onExecute() {
        // Currently does nothing
    }

    onSelection(e) {
        const fileList = event.target.files;
        this.readSingleFile(fileList[0]);
    }

    readSingleFile(file) {
        if (!file) {
            return;
        }

        var reader = new FileReader();

        reader.onload = this.onReaderLoad(file);
        reader.readAsText(file);
    };

    onReaderLoad(file) {
        return (e) => {
            let contents = e.target.result;
            let mdpa_subs_re = /.*((Begin SubModelPart) ([a-zA-Z0-9_]+))|(End SubModelPart$)/gm;
            let sub_mdpa = contents.matchAll(mdpa_subs_re);
            console.log(sub_mdpa);
            // Remove existing outputs
            while (this.outputs != undefined && this.outputs.length != 0) {
                this.removeOutput(0);
            }
            // Obtain the name of the ModelPart to get complete routes
            var sub_mdpa_namepath = file.name.slice(0, -5);
            for (var match of sub_mdpa) {
                console.log(match);
                if (match[0].includes("Begin")) {
                    sub_mdpa_namepath = sub_mdpa_namepath + "." + match[3];
                    this.addOutput(sub_mdpa_namepath, "string");
                }
                else {
                    sub_mdpa_namepath = sub_mdpa_namepath.split(".").slice(0, -1).join(".");
                }
            }
        }
    }
}

ParsedModelPart.title = "ParsedModelPart";
ParsedModelPart.desc = "view of an Output object";

LiteGraph.registerNodeType("model_part/ParsedModelPart", ParsedModelPart);

console.log("ParsedModelPart node created"); //helps to debug