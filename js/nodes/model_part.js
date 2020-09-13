    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/    
    //********************************************************************/
    function ModelPart() {
        this.addOutput("Name","string");
        this.mp_name = this.addWidget("string","Name", "", function(v){});
        this.size = this.computeSize();
        this.serialize_widgets = true;
    }

    ModelPart.title = "ModelPart";
    ModelPart.desc = "view of an Output object";

    ModelPart.prototype.onExecute = function() {
        this.setOutputData(0,  this.mp_name.value);
    };

    LiteGraph.registerNodeType("model_part/ModelPart", ModelPart);

    console.log("ModelPart node created"); //helps to debug