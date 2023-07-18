class OutputView {
    constructor() {
        this.addInput("json", 0)

        this.size = this.computeSize();
    }

    onExecute() {
    }

    onDrawForeground(ctx, graphcanvas) {
        ctx.font = "12px Arial";
        
        const text = JSON.stringify(this.getInputData(0), null, 4);

        $('#json-display').jsonViewer(this.getInputData(0), {collapsed: false, withLinks: true});
        
        // let max_size = this.size;
        // let line_pad = 0;
        
        // if(text) {
        //     line_pad += 50;
        //     for(const line of text.split("\n")) {
        //         max_size[0] = Math.max(max_size[0], 10 + ctx.measureText(line).width + 10);
        //         ctx.fillText(line, 10, line_pad)
        //         line_pad += 20;
        //     }

        //     max_size[1] = line_pad;
        //     this.size = max_size;
        // } else {
        //     this.size = this.computeSize();
        // }
    }
}

OutputView.title = "JSON Viewer";
OutputView.desc = "JSON Vienwer";

LiteGraph.registerNodeType("IO/JSONView", OutputView);
