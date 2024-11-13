LiteGraph.NODE_SLOT_MARGIN_TOP = 5;
LiteGraph.NODE_SLOT_MARGIN_BOT = 5;

/**
 * Computes the minimum size of a node according to its inputs and output slots
 * @method computeSize
 * @param {vec2} minHeight
 * @return {vec2} the total size
 */
LGraphNode.prototype.computeSize = function(out) {
    if (this.constructor.size) {
        return this.constructor.size.concat();
    }

    var rows = Math.max(
        this.inputs ? this.inputs.length : 1,
        this.outputs ? this.outputs.length : 1
    );
    var size = out || new Float32Array([0, 0]);
    rows = Math.max(rows, 1);
    var font_size = LiteGraph.NODE_TEXT_SIZE; // Although it should be graphcanvas.inner_text_font size

    var title_width = compute_text_size(this.title);
    var input_width = 0;
    var output_width = 0;

    if (this.inputs) {
        for (var i = 0, l = this.inputs.length; i < l; ++i) {
            var input = this.inputs[i];
            var text = input.label || input.name || "";
            var text_width = compute_text_size(text);
            if (input_width < text_width) {
                input_width = text_width;
            }
        }
    }

    if (this.outputs) {
        for (var i = 0, l = this.outputs.length; i < l; ++i) {
            var output = this.outputs[i];
            var text = output.label || output.name || "";
            var text_width = compute_text_size(text);
            if (output_width < text_width) {
                output_width = text_width;
            }
        }
    }

    size[0] = Math.max(input_width + output_width + 10, title_width);
    size[0] = Math.max(size[0], LiteGraph.NODE_WIDTH);

    //////////////////////////////////////////
    // FlowGraph Extension                  //
    //////////////////////////////////////////

    // This does not looks aesthetically pleasant

    // if (this.widgets && this.widgets.length) {
    //     size[0] = Math.max(size[0], LiteGraph.NODE_WIDTH * 1.5);
    // }

    //////////////////////////////////////////
    // FlowGraph Extension End              //
    //////////////////////////////////////////

    size[1] = (this.constructor.slot_start_y || 0) 
            + rows * LiteGraph.NODE_SLOT_HEIGHT
            + LiteGraph.NODE_SLOT_MARGIN_TOP
            + LiteGraph.NODE_SLOT_MARGIN_BOT;

    var widgets_height = 0;
    if (this.widgets && this.widgets.length) {
        for (var i = 0, l = this.widgets.length; i < l; ++i) {
            if (this.widgets[i].computeSize) {
                widgets_height += this.widgets[i].computeSize(size[0])[1];
            } else {
                widgets_height += LiteGraph.NODE_WIDGET_HEIGHT;
            }
            widgets_height += 4;
        }
    }

    // Compute height using widgets height
    if( this.widgets_up )
        size[1] = Math.max( size[1], widgets_height );
    else if( this.widgets_start_y != null )
        size[1] = Math.max( size[1], widgets_height + this.widgets_start_y );
    else
        size[1] += widgets_height;

    function compute_text_size(text) {
        if (!text) {
            return 0;
        }
        return font_size * text.length * 0.6;
    }

    if (
        this.constructor.min_height &&
        size[1] < this.constructor.min_height
    ) {
        size[1] = this.constructor.min_height;
    }

    size[1] += 6; //margin

    return size;
};