
/**
 * Draws a tooltip when hovering a widget to show the current value without trimming
 * @param {*} node 
 * @param {*} ctx 
 * @param {*} active_widget 
 */
LGraphCanvas.prototype.drawNodewidgetTooltip = function(node, ctx, widget, widget_pos_y, widget_height) {
    
    let box_x = node.size[0];
    let box_y = widget_pos_y + 0 + widget_height * 0.5;
    
    let tooltip_data = widget.tooltip(widget);
    let line_w = 14;

    let lines_title = tooltip_data["title"];
    let lines_value = tooltip_data["value"];
    
    ctx.old_font = ctx.font;
    
    let lines_descp = tooltip_data["descp"];

    let info = lines_descp.map((lines_descp)=>ctx.measureText(lines_descp).width).reduce((a,b)=>Math.max(a,b));
        info = Math.max(info, ctx.measureText(lines_title).width);
        info = Math.max(info, ctx.measureText(lines_value).width);

    let h = line_w * ( lines_descp.length + 1 + 5 ) + 8;
    let w = info + 20 + 30;
    
    // Draw box
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;
    ctx.fillStyle = "#444";
    ctx.beginPath();
    ctx.roundRect( box_x +15, box_y - h * 0.5, w, h, [3]);
    ctx.moveTo( box_x + 15, box_y - 10 );
    ctx.lineTo( box_x + 15, box_y + 10 );
    ctx.lineTo( box_x + 5, box_y );
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.textAlign = "left";
    ctx.fillStyle = "#AAA";

    // Draw the title
    ctx.font = node.glyph.font || LiteGraph.NODE_DEFAULT_TITLE_FONT;
    ctx.fillText(
        "\uf05a",
        15 + 12 + box_x, 
        box_y - h * 0.5 + 14 * 0 + 23
    );
    ctx.font = ctx.old_font;

    ctx.fillText(
        lines_title,
        30 + 20 + box_x, 
        box_y - h * 0.5 + 14 * 0 + 22
    );

    // Draw the value
    ctx.font = node.glyph.font || LiteGraph.NODE_DEFAULT_TITLE_FONT;
    ctx.fillText(
        "\uf02b",
        15 + 12 + box_x, 
        box_y - h * 0.5 + 14 * 2 + 22
    );
    ctx.font = ctx.old_font;

    ctx.font = "bold 14px Arial";
    ctx.fillText(
        lines_value,
        30 + 20 + box_x, 
        box_y - h * 0.5 + 14 * 2 + 22
    );
    ctx.font = ctx.old_font;

    // Draw the description
    ctx.font = node.glyph.font || LiteGraph.NODE_DEFAULT_TITLE_FONT;
    ctx.fillText(
        "\uf19c",
        15 + 12 + box_x, 
        box_y - h * 0.5 + 14 * 4 + 30
    );
    ctx.font = ctx.old_font;

    for(let l in lines_descp) {
        ctx.fillText(
            lines_descp[l], 
            30 + 20 + box_x, 
            box_y - h * 0.5 + 14 * 4 + (l*14) + 30
        );
    }
    ctx.font = ctx.old_font;
}

/**
 * draws the widgets stored inside a node
 * @method drawNodeWidgets
 **/
LGraphCanvas.prototype.drawNodeWidgets = function(
    node,
    posY,
    ctx,
    active_widget
) {
    if (!node.widgets || !node.widgets.length) {
        return 0;
    }
    var width = node.size[0];
    var widgets = node.widgets;
    posY += 2;
    var H = LiteGraph.NODE_WIDGET_HEIGHT;
    var show_text = this.ds.scale > 0.5;
    ctx.save();
    ctx.globalAlpha = this.editor_alpha;

    var outline_color = LiteGraph.WIDGET_OUTLINE_COLOR;
    var background_color = LiteGraph.WIDGET_BGCOLOR;
    var text_color = LiteGraph.WIDGET_TEXT_COLOR;
    var secondary_text_color = LiteGraph.WIDGET_SECONDARY_TEXT_COLOR;

    let label_trim = LiteGraph.WIDGET_LABEL_TRIM || 10;
    let value_trim = LiteGraph.WIDGET_VALUE_TRIM || 10;
        value_trim = Math.max(value_trim, value_trim + (node.size[0] - LiteGraph.NODE_WIDTH)/6);
    
    var margin = 18;

    for (var i = 0; i < widgets.length; ++i) {
        var w = widgets[i];
        var y = posY;
        if (w.y) {
            y = w.y;
        }
        w.last_y = y;
        ctx.strokeStyle = outline_color;
        ctx.fillStyle = "#222";
        ctx.textAlign = "left";
        //ctx.lineWidth = 2;
        if(w.disabled)
            ctx.globalAlpha *= 0.5;
        var widget_width = w.width || width;

        switch (w.type) {
            case "button":
                if (w.clicked) {
                    ctx.fillStyle = "#AAA";
                    w.clicked = false;
                    this.dirty_canvas = true;
                }
                ctx.fillRect(margin, y, widget_width - margin * 2, H);
                if(show_text && !w.disabled)
                    ctx.strokeRect( margin, y, widget_width - margin * 2, H );
                if (show_text) {
                    ctx.textAlign = "center";
                    ctx.fillStyle = text_color;
                    ctx.fillText(w.label || w.name, widget_width * 0.5, y + H * 0.7);
                }
                break;
            case "toggle":
                ctx.textAlign = "left";
                ctx.strokeStyle = outline_color;
                ctx.fillStyle = background_color;
                ctx.beginPath();
                if (show_text)
                    ctx.roundRect(margin, y, widget_width - margin * 2, H, [H * 0.5]);
                else
                    ctx.rect(margin, y, widget_width - margin * 2, H );
                ctx.fill();
                if(show_text && !w.disabled)
                    ctx.stroke();
                ctx.fillStyle = w.value ? "#89A" : "#333";
                ctx.beginPath();
                ctx.arc( widget_width - margin * 2, y + H * 0.5, H * 0.36, 0, Math.PI * 2 );
                ctx.fill();
                if (show_text) {
                    ctx.fillStyle = secondary_text_color;
                    const label = w.label || w.name;    
                    if (label != null) {
                        ctx.fillText(label, margin * 2, y + H * 0.7);
                    }
                    ctx.fillStyle = w.value ? text_color : secondary_text_color;
                    ctx.textAlign = "right";
                    ctx.fillText(
                        w.value
                            ? w.options.on || "true"
                            : w.options.off || "false",
                        widget_width - 40,
                        y + H * 0.7
                    );
                }
                break;
            case "slider":
                ctx.fillStyle = background_color;
                ctx.fillRect(margin, y, widget_width - margin * 2, H);
                var range = w.options.max - w.options.min;
                var nvalue = (w.value - w.options.min) / range;
                if(nvalue < 0.0) nvalue = 0.0;
                if(nvalue > 1.0) nvalue = 1.0;
                ctx.fillStyle = w.options.hasOwnProperty("slider_color") ? w.options.slider_color : (active_widget == w ? "#89A" : "#678");
                ctx.fillRect(margin, y, nvalue * (widget_width - margin * 2), H);
                if(show_text && !w.disabled)
                    ctx.strokeRect(margin, y, widget_width - margin * 2, H);
                if (w.marker) {
                    var marker_nvalue = (w.marker - w.options.min) / range;
                    if(marker_nvalue < 0.0) marker_nvalue = 0.0;
                    if(marker_nvalue > 1.0) marker_nvalue = 1.0;
                    ctx.fillStyle = w.options.hasOwnProperty("marker_color") ? w.options.marker_color : "#AA9";
                    ctx.fillRect( margin + marker_nvalue * (widget_width - margin * 2), y, 2, H );
                }
                if (show_text) {
                    ctx.textAlign = "center";
                    ctx.fillStyle = text_color;
                    ctx.fillText(
                        w.label || w.name + "  " + Number(w.value).toFixed(3),
                        widget_width * 0.5,
                        y + H * 0.7
                    );
                }
                break;
            case "number":
            case "combo":
                ctx.textAlign = "left";
                ctx.strokeStyle = outline_color;
                ctx.fillStyle = background_color;
                ctx.beginPath();
                if(show_text)
                    ctx.roundRect(margin, y, widget_width - margin * 2, H, [H * 0.5] );
                else
                    ctx.rect(margin, y, widget_width - margin * 2, H );
                ctx.fill();
                if (show_text) {
                    if(!w.disabled)
                        ctx.stroke();
                    ctx.fillStyle = text_color;
                    if(!w.disabled)
                    {
                        ctx.beginPath();
                        ctx.moveTo(margin + 16, y + 5);
                        ctx.lineTo(margin + 6, y + H * 0.5);
                        ctx.lineTo(margin + 16, y + H - 5);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(widget_width - margin - 16, y + 5);
                        ctx.lineTo(widget_width - margin - 6, y + H * 0.5);
                        ctx.lineTo(widget_width - margin - 16, y + H - 5);
                        ctx.fill();
                    }
                    ctx.fillStyle = secondary_text_color;
                    ctx.fillText(w.label || w.name, margin * 2 + 5, y + H * 0.7);
                    ctx.fillStyle = text_color;
                    ctx.textAlign = "right";
                    if (w.type == "number") {
                        ctx.fillText(
                            Number(w.value).toFixed(
                                w.options.precision !== undefined
                                    ? w.options.precision
                                    : 3
                            ),
                            widget_width - margin * 2 - 20,
                            y + H * 0.7
                        );
                    } else {
                        var v = w.value;
                        if( w.options.values )
                        {
                            var values = w.options.values;
                            if( values.constructor === Function )
                                values = values();
                            if(values && values.constructor !== Array)
                                v = values[ w.value ];
                            
                            // Charlie: If the value is not in the list of values, set it to the first value ( For dynamic lists )
                            if(values && values.indexOf(v) == -1) {
                                w.value = values[0];
                                v = w.value
                            }
                        }

                        let value_text = String(w.value).substring(0,value_trim) + (w.value.length < value_trim + 3 ? "" : "...");

                        ctx.fillText(
                            value_text,
                            widget_width - margin * 2 - 4,
                            y + H * 0.7
                        );
                    }
                }
                break;
            case "string":
            case "text":
                ctx.textAlign = "left";
                ctx.strokeStyle = outline_color;
                ctx.fillStyle = background_color;
                ctx.beginPath();
                if (show_text)
                    ctx.roundRect(margin, y, widget_width - margin * 2, H, [H * 0.5]);
                else
                    ctx.rect( margin, y, widget_width - margin * 2, H );
                ctx.fill();
                if (show_text) {
                    if(!w.disabled)
                        ctx.stroke();
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(margin, y, widget_width - margin * 2, H);
                    ctx.clip();

                    let lavel_text = String(w.name).substring(0,label_trim) + (w.name.length < label_trim + 3 ? "" : "...");

                    ctx.fillStyle = secondary_text_color;
                    const label = w.label || w.name;	
                    if (label != null) {
                        ctx.fillText(lavel_text, margin * 2, y + H * 0.7);
                    }
                    ctx.fillStyle = text_color;
                    ctx.textAlign = "right";

                    let value_text = String(w.value).substring(0,value_trim) + (w.value.length < value_trim + 3 ? "" : "...");

                    ctx.fillText(
                        value_text, 
                        widget_width - margin * 2, 
                        y + H * 0.7
                    ); //30 chars max

                    ctx.restore();
                }
                break;
            default:
                if (w.draw) {
                    w.draw(ctx, node, widget_width, y, H);
                }
                break;
        }

        posY += (w.computeSize ? w.computeSize(widget_width)[1] : H) + 4;
        ctx.globalAlpha = this.editor_alpha;

        //////////////////////////////////////////
        // FlowGraph Extension                  //
        //////////////////////////////////////////

        var mouse_pos = this.graph_mouse;
        var node_pos = node.pos;

        if (node.is_selected && w.tooltip 
                             && mouse_pos[0] > node_pos[0] + margin 
                             && mouse_pos[0] < node_pos[0] + widget_width - margin 
                             && mouse_pos[1] > node_pos[1] + y 
                             && mouse_pos[1] < node_pos[1] + y + H ) {
            this.drawNodewidgetTooltip(node, ctx, w, y, H);
        }

        //////////////////////////////////////////
        // FlowGraph Extension End              //
        //////////////////////////////////////////

    }
    ctx.restore();
    ctx.textAlign = "left";
};