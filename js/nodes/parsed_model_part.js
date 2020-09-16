function ParsedModelPart() {
    var self = this; // Not sure if this is clean :S

    this.input_manager = document.createElement('input');
    this.input_manager.type = 'file';

    this.input_manager.addEventListener('change', (event) => {
        const fileList = event.target.files;

        function readSingleFile(file) {                
            if (!file) {
                console.log("Not a file?");
                return;
            }

            var reader = new FileReader();

            reader.onload = function(e) {
                var contents = e.target.result;

                let mdpa_subs_re = /.*((Begin SubModelPart) ([a-zA-Z0-9_]+))|(End SubModelPart$)/gm

                let sub_mdpa = contents.matchAll(mdpa_subs_re);

                console.log(sub_mdpa);

                // Remove existing outputs
                while (self.outputs != undefined && self.outputs.length != 0) {
                    self.removeOutput(0);
                }
                
                // Obtain the name of the ModelPart to get complete routes
                var sub_mdpa_namepath = file.name.slice(0,-5);

                for(var match of sub_mdpa) {
                    console.log(match);
                    if(match[0].includes("Begin")) {
                        sub_mdpa_namepath = sub_mdpa_namepath + "." + match[3]
                        self.addOutput(sub_mdpa_namepath,"string");
                    } else {
                        sub_mdpa_namepath = sub_mdpa_namepath.split(".").slice(0,-1).join(".");
                    }
                }
            };

            reader.readAsText(file);
        };

        readSingleFile(fileList[0]);
    });

    this.mp_select = this.addWidget("button", "Load Mdpa", "", function(value, widget, node) {
        console.log(node.input_manager.value)
        node.input_manager.click();
    });

    // this.addOutput("Name","string");
    this.size = this.computeSize();
    this.serialize_widgets = true;
}

ParsedModelPart.title = "ParsedModelPart";
ParsedModelPart.desc = "view of an Output object";

ParsedModelPart.prototype.onExecute = function() {
    // this.setOutputData(0,  this.mp_name.value);
};

LiteGraph.registerNodeType("model_part/ParsedModelPart", ParsedModelPart);

console.log("ParsedModelPart node created"); //helps to debug