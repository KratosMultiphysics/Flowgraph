function ParsedModelPart() {
    // this.mp_name = this.addWidget("string","Name", "", function(v){});

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
                console.log("Done:");
            
                let re = /^Begin SubModelPart ([a-zA-Z0-9_]+)/gm;
                let sub_mdpa = contents.matchAll(re);

                console.log(self);

                // Remove existing outputs
                while (self.outputs != undefined && self.outputs.length != 0) {
                    self.removeOutput(0);
                }
                
                for(var match of sub_mdpa) {
                    console.log(match[1]);
                    self.addOutput(match[1],"string");
                }
            };

            console.log("Reading as text...")
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

console.log("ModelPart node created"); //helps to debug