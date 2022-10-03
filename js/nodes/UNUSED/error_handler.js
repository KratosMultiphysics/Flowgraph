class ErrorHandler {
    constructor() {}

    static drawErrorMark(ctx, node) {
        ctx.font = '900 14px "Font Awesome 5 Free"';
        ctx.textAlign = "end";
        ctx.fillStyle = "#C44";
        ctx.fillText(
            "\uf06a",
            node.size[0]-10,
            LiteGraph.NODE_TITLE_TEXT_Y - LiteGraph.NODE_TITLE_HEIGHT
        );
        ctx.font = LiteGraph.NODE_DEFAULT_TITLE_FONT;
    }

    static drawErrorTooltip(ctx, node) {
        let box_x = node.size[0]-17;
        let box_y = LiteGraph.NODE_TITLE_TEXT_Y - LiteGraph.NODE_TITLE_HEIGHT - 12;
        let lines = ["Errors:", ...node.error_list];
        
        let info = lines.map((line)=>ctx.measureText(line).width).reduce((a,b)=>Math.max(a,b));
        
        let h = 24 * lines.length + 15 * 0.3;
        let w = info + 20;
        
        ctx.font = "14px Courier New";
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 3;
        ctx.fillStyle = "#544";
        ctx.beginPath();
        ctx.roundRect( box_x - w*0.5, box_y - 15 - h, w, h, [3]);
        ctx.moveTo( box_x - 10, box_y - 15 );
        ctx.lineTo( box_x + 10, box_y - 15 );
        ctx.lineTo( box_x, box_y - 5 );
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ECC";
        for(let l in lines) {
            ctx.fillText(lines[l], box_x, box_y - h + 24 * l + 15 * 0.3);
        }
    }
}

// export default InputList;