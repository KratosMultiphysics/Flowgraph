LiteGraph.NODE_DEFAULT_TITLE_FONT = "" + LiteGraph.NODE_TEXT_SIZE + "px Arial";
LiteGraph.NODE_SLOT_HEIGHT = 24;

LGraphCanvas.slot_type_colors = {};
LGraphCanvas.slot_type_colorsOff = {};

var temp_vec2 = new Float32Array(2);

const newShade = (hexColor, magnitude) => {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
        const decimalColor = parseInt(hexColor, 16);
        let r = (decimalColor >> 16) + magnitude;
        r > 255 && (r = 255);
        r < 0 && (r = 0);
        let g = (decimalColor & 0x0000ff) + magnitude;
        g > 255 && (g = 255);
        g < 0 && (g = 0);
        let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
        b > 255 && (b = 255);
        b < 0 && (b = 0);
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
        return hexColor;
    }
};
    
/**
 * draws the given node inside the canvas
 * @method drawNode
 **/
LGraphCanvas.prototype.drawNode = function(node, ctx) {
    var glow = false;
    this.current_node = node;

    var color = node.color || node.constructor.color || LiteGraph.NODE_DEFAULT_COLOR;
    var bgcolor = node.bgcolor || node.constructor.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;

    //shadow and glow
    if (node.mouseOver) {
        glow = true;
    }

    var low_quality = this.ds.scale < 0.6; //zoomed out

    //only render if it forces it to do it
    if (this.live_mode) {
        if (!node.flags.collapsed) {
            ctx.shadowColor = "transparent";
            if (node.onDrawForeground) {
                node.onDrawForeground(ctx, this, this.canvas);
            }
        }
        return;
    }

    var editor_alpha = this.editor_alpha;
    ctx.globalAlpha = editor_alpha;

    if (this.render_shadows && !low_quality) {
        ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
        ctx.shadowOffsetX = 2 * this.ds.scale;
        ctx.shadowOffsetY = 2 * this.ds.scale;
        ctx.shadowBlur = 3 * this.ds.scale;
    } else {
        ctx.shadowColor = "transparent";
    }

    //custom draw collapsed method (draw after shadows because they are affected)
    if (
        node.flags.collapsed &&
        node.onDrawCollapsed &&
        node.onDrawCollapsed(ctx, this) == true
    ) {
        return;
    }

    //clip if required (mask)
    var shape = node._shape || LiteGraph.BOX_SHAPE;
    var size = temp_vec2;
    temp_vec2.set(node.size);
    var horizontal = node.horizontal; // || node.flags.horizontal;

    if (node.flags.collapsed) {
        ctx.font = this.inner_text_font;
        var title = node.getTitle ? node.getTitle() : node.title;
        if (title != null) {
            node._collapsed_width = Math.min(
                node.size[0],
                ctx.measureText(title).width +
                    LiteGraph.NODE_TITLE_HEIGHT * 2
            ); //LiteGraph.NODE_COLLAPSED_WIDTH;
            size[0] = node._collapsed_width;
            size[1] = 0;
        }
    }

    if (node.clip_area) {
        //Start clipping
        ctx.save();
        ctx.beginPath();
        if (shape == LiteGraph.BOX_SHAPE) {
            ctx.rect(0, 0, size[0], size[1]);
        } else if (shape == LiteGraph.ROUND_SHAPE) {
            ctx.roundRect(0, 0, size[0], size[1], [10]);
        } else if (shape == LiteGraph.CIRCLE_SHAPE) {
            ctx.arc(
                size[0] * 0.5,
                size[1] * 0.5,
                size[0] * 0.5,
                0,
                Math.PI * 2
            );
        }
        ctx.clip();
    }

    //draw shape
    if (node.has_errors) {
        bgcolor = "red";
    }
    this.drawNodeShape(
        node,
        ctx,
        size,
        color,
        bgcolor,
        node.is_selected,
        node.mouseOver
    );
    ctx.shadowColor = "transparent";

    //draw foreground
    if (node.onDrawForeground) {
        node.onDrawForeground(ctx, this, this.canvas);
    }

    //connection slots
    ctx.textAlign = horizontal ? "center" : "left";
    ctx.font = this.inner_text_font;

    var render_text = !low_quality;

    var out_slot = this.connecting_output;
    var in_slot = this.connecting_input;
    ctx.lineWidth = 1;

    var max_y = 0;
    var slot_pos = new Float32Array(2); //to reuse

    //render inputs and outputs
    if (!node.flags.collapsed) {
        //input connection slots
        if (node.inputs) {
            for (var i = 0; i < node.inputs.length; i++) {
                var slot = node.inputs[i];
                
                var slot_type = slot.type;
                var slot_shape = slot.shape;
                
                ctx.globalAlpha = editor_alpha;
                //change opacity of incompatible slots when dragging a connection
                if ( this.connecting_output && !LiteGraph.isValidConnection( slot.type , out_slot.type) ) {
                    ctx.globalAlpha = 0.4 * editor_alpha;
                }

                ctx.fillStyle =
                    slot.link != null
                        ? slot.color_on ||
                            LGraphCanvas.slot_type_colors[slot_type] ||
                            this.default_connection_color_byType[slot_type] ||
                            this.default_connection_color.input_on
                        : slot.color_off ||
                            LGraphCanvas.slot_type_colorsOff[slot_type] ||
                            this.default_connection_color_byTypeOff[slot_type] ||
                            this.default_connection_color_byType[slot_type] ||
                            this.default_connection_color.input_off;

                var pos = node.getConnectionPos(true, i, slot_pos);

                pos[0] -= node.pos[0];
                pos[1] -= node.pos[1];
                
                if (max_y < pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5) {
                    max_y = pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5;
                }
                
                ctx.beginPath();

                if (slot_type == "array"){
                    slot_shape = LiteGraph.GRID_SHAPE; // place in addInput? addOutput instead?
                }
                
                var doStroke = true;
                
                if (
                    slot.type === LiteGraph.EVENT ||
                    slot.shape === LiteGraph.BOX_SHAPE
                ) {
                    if (horizontal) {
                        ctx.rect(
                            pos[0] - 5 + 0.5,
                            pos[1] - 8 + 0.5,
                            10,
                            14
                        );
                    } else {
                        ctx.rect(
                            pos[0] - 6 + 0.5,
                            pos[1] - 5 + 0.5,
                            14,
                            10
                        );
                    }
                } else if (slot_shape === LiteGraph.ARROW_SHAPE) {
                    ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
                    ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
                    ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
                    ctx.closePath();
                } else if (slot_shape === LiteGraph.GRID_SHAPE) {
                    ctx.rect(pos[0] - 4, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] - 4, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] - 4, pos[1] + 2, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] + 2, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] + 2, 2, 2);
                    doStroke = false;
                } else {
                    if(low_quality) // Faster
                        ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8 );
                    else // Custom shape based on font.
                        if (slot.glyph) {
                            ctx.font = slot.glyph.font || LiteGraph.NODE_DEFAULT_TITLE_FONT;
                            const offset_width = slot.glyph.width || 0;
                            const offset_height = slot.glyph.height || 0;
                            ctx.fillText(
                                slot.glyph.shape,
                                pos[0] - offset_width / 2,
                                pos[1] + offset_height / 2
                            );
                            ctx.font = LiteGraph.NODE_DEFAULT_TITLE_FONT;
                        } else {
                            ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                        }
                }
                ctx.fill();

                //render name
                if (render_text) {
                    var text = slot.label != null ? slot.label : slot.name;
                    if (text) {
                        ctx.fillStyle = LiteGraph.NODE_TEXT_COLOR;
                        if (horizontal || slot.dir == LiteGraph.UP) {
                            ctx.fillText(text, pos[0], pos[1] - 10);
                        } else {
                            ctx.fillText(text, pos[0] + 10, pos[1] + 4);
                        }
                    }
                }
            }
        }

        //output connection slots

        ctx.textAlign = horizontal ? "center" : "right";
        // ctx.strokeStyle = "black";
        
        if (node.outputs) {
            for (var i = 0; i < node.outputs.length; i++) {
                var slot = node.outputs[i];
                
                var slot_type = slot.type;
                var slot_shape = slot.shape;
                
                //change opacity of incompatible slots when dragging a connection
                if (this.connecting_input && !LiteGraph.isValidConnection( slot_type , in_slot.type) ) {
                    ctx.globalAlpha = 0.4 * editor_alpha;
                }
                
                var pos = node.getConnectionPos(false, i, slot_pos);
                pos[0] -= node.pos[0];
                pos[1] -= node.pos[1];
                if (max_y < pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5) {
                    max_y = pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5;
                }

                ctx.fillStyle =
                    slot.links && slot.links.length
                        ? slot.color_on ||
                            LGraphCanvas.slot_type_colors[slot_type] ||
                            this.default_connection_color_byType[slot_type] ||
                            this.default_connection_color.output_on
                        : slot.color_off ||
                            LGraphCanvas.slot_type_colors[slot_type] ||
                            this.default_connection_color_byTypeOff[slot_type] ||
                            this.default_connection_color_byType[slot_type] ||
                            this.default_connection_color.output_off;
                ctx.beginPath();
                //ctx.rect( node.size[0] - 14,i*14,10,10);

                if (slot_type == "array"){
                    slot_shape = LiteGraph.GRID_SHAPE;
                }
                
                var doStroke = true;
                
                if (
                    slot_type === LiteGraph.EVENT ||
                    slot_shape === LiteGraph.BOX_SHAPE
                ) {
                    if (horizontal) {
                        ctx.rect(
                            pos[0] - 5 + 0.5,
                            pos[1] - 8 + 0.5,
                            10,
                            14
                        );
                    } else {
                        ctx.rect(
                            pos[0] - 6 + 0.5,
                            pos[1] - 5 + 0.5,
                            14,
                            10
                        );
                    }
                } else if (slot_shape === LiteGraph.ARROW_SHAPE) {
                    ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
                    ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
                    ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
                    ctx.closePath();
                }  else if (slot_shape === LiteGraph.GRID_SHAPE) {
                    ctx.rect(pos[0] - 4, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] - 4, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] - 4, pos[1] + 2, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] + 2, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] + 2, 2, 2);
                    doStroke = false;
                } else {
                    if(low_quality)
                        ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8 );
                    else
                        ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                }

                //trigger
                //if(slot.node_id != null && slot.slot == -1)
                //	ctx.fillStyle = "#F85";

                //if(slot.links != null && slot.links.length)
                ctx.fill();
                // if(!low_quality && doStroke)
                //     ctx.stroke();

                //render output name
                if (render_text) {
                    var text = slot.label != null ? slot.label : slot.name;
                    if (text) {
                        ctx.fillStyle = LiteGraph.NODE_TEXT_COLOR;
                        if (horizontal || slot.dir == LiteGraph.DOWN) {
                            ctx.fillText(text, pos[0], pos[1] - 8);
                        } else {
                            ctx.fillText(text, pos[0] - 10, pos[1] + 4);
                        }
                    }
                }
            }
        }

        ctx.textAlign = "left";
        ctx.globalAlpha = 1;

        if (node.widgets) {
            var widgets_y = max_y;
            if (horizontal || node.widgets_up) {
                widgets_y = 4;
            }
            if( node.widgets_start_y != null )
                widgets_y = node.widgets_start_y;
            this.drawNodeWidgets(
                node,
                widgets_y,
                ctx,
                this.node_widget && this.node_widget[0] == node
                    ? this.node_widget[1]
                    : null
            );
        }
    } else if (this.render_collapsed_slots) {
        //if collapsed
        var input_slot = null;
        var output_slot = null;

        //get first connected slot to render
        if (node.inputs) {
            for (var i = 0; i < node.inputs.length; i++) {
                var slot = node.inputs[i];
                if (slot.link == null) {
                    continue;
                }
                input_slot = slot;
                break;
            }
        }
        if (node.outputs) {
            for (var i = 0; i < node.outputs.length; i++) {
                var slot = node.outputs[i];
                if (!slot.links || !slot.links.length) {
                    continue;
                }
                output_slot = slot;
            }
        }

        if (input_slot) {
            var x = 0;
            var y = LiteGraph.NODE_TITLE_HEIGHT * -0.5; //center
            if (horizontal) {
                x = node._collapsed_width * 0.5;
                y = -LiteGraph.NODE_TITLE_HEIGHT;
            }
            ctx.fillStyle = "#686";
            ctx.beginPath();
            if (
                slot.type === LiteGraph.EVENT ||
                slot.shape === LiteGraph.BOX_SHAPE
            ) {
                ctx.rect(x - 7 + 0.5, y - 4, 14, 8);
            } else if (slot.shape === LiteGraph.ARROW_SHAPE) {
                ctx.moveTo(x + 8, y);
                ctx.lineTo(x + -4, y - 4);
                ctx.lineTo(x + -4, y + 4);
                ctx.closePath();
            } else {
                ctx.arc(x, y, 4, 0, Math.PI * 2);
            }
            ctx.fill();
        }

        if (output_slot) {
            var x = node._collapsed_width;
            var y = LiteGraph.NODE_TITLE_HEIGHT * -0.5; //center
            if (horizontal) {
                x = node._collapsed_width * 0.5;
                y = 0;
            }
            ctx.fillStyle = "#686";
            ctx.strokeStyle = "black";
            ctx.beginPath();
            if (
                slot.type === LiteGraph.EVENT ||
                slot.shape === LiteGraph.BOX_SHAPE
            ) {
                ctx.rect(x - 7 + 0.5, y - 4, 14, 8);
            } else if (slot.shape === LiteGraph.ARROW_SHAPE) {
                ctx.moveTo(x + 6, y);
                ctx.lineTo(x - 6, y - 4);
                ctx.lineTo(x - 6, y + 4);
                ctx.closePath();
            } else {
                ctx.arc(x, y, 4, 0, Math.PI * 2);
            }
            ctx.fill();
            //ctx.stroke();
        }
    }

    if (node.clip_area) {
        ctx.restore();
    }

    ctx.globalAlpha = 1.0;
};

/**
 * draws the shape of the given node in the canvas
 * @method drawNodeShape
 **/
var tmp_area = new Float32Array(4);

LGraphCanvas.prototype.drawNodeShape = function(
    node,
    ctx,
    size,
    fgcolor,
    bgcolor,
    selected,
    mouse_over
) {
    //bg rect
    ctx.strokeStyle = fgcolor;
    ctx.fillStyle = bgcolor;

    var title_height = LiteGraph.NODE_TITLE_HEIGHT;
    var low_quality = this.ds.scale < 0.5;

    //render node area depending on shape
    var shape =
        node._shape || node.constructor.shape || LiteGraph.ROUND_SHAPE;

    var title_mode = node.constructor.title_mode;

    var render_title = true;
    if (title_mode == LiteGraph.TRANSPARENT_TITLE || title_mode == LiteGraph.NO_TITLE) {
        render_title = false;
    } else if (title_mode == LiteGraph.AUTOHIDE_TITLE && mouse_over) {
        render_title = true;
    }

    var area = tmp_area;
    area[0] = 0; //x
    area[1] = render_title ? -title_height : 0; //y
    area[2] = size[0] + 1; //w
    area[3] = render_title ? size[1] + title_height : size[1]; //h

    var old_alpha = ctx.globalAlpha;

    //full node shape
    //if(node.flags.collapsed)
    {
        ctx.beginPath();
        if (shape == LiteGraph.BOX_SHAPE || low_quality) {
            ctx.fillRect(area[0], area[1], area[2], area[3]);
        } else if (
            shape == LiteGraph.ROUND_SHAPE ||
            shape == LiteGraph.CARD_SHAPE
        ) {
            ctx.roundRect(
                area[0],
                area[1],
                area[2],
                area[3],
                shape == LiteGraph.CARD_SHAPE ? [this.round_radius,this.round_radius,0,0] : [this.round_radius] 
            );
        } else if (shape == LiteGraph.CIRCLE_SHAPE) {
            ctx.arc(
                size[0] * 0.5,
                size[1] * 0.5,
                size[0] * 0.5,
                0,
                Math.PI * 2
            );
        }
        ctx.fill();

        //separator
        if(!node.flags.collapsed && render_title)
        {
            ctx.shadowColor = "transparent";
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(0, -1, area[2], 2);
        }
    }
    ctx.shadowColor = "transparent";

    if (node.onDrawBackground) {
        node.onDrawBackground(ctx, this, this.canvas, this.graph_mouse );
    }

    //title bg (remember, it is rendered ABOVE the node)
    if (render_title || title_mode == LiteGraph.TRANSPARENT_TITLE) {
        //title bar
        if (node.onDrawTitleBar) {
            node.onDrawTitleBar( ctx, title_height, size, this.ds.scale, fgcolor );
        } else if (
            title_mode != LiteGraph.TRANSPARENT_TITLE &&
            (node.constructor.title_color || this.render_title_colored)
        ) {
            var title_color = node.constructor.title_color || fgcolor;

            if (node.flags.collapsed) {
                ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
            }

            //* gradient test
            if (this.use_gradients) {
                var grad = LGraphCanvas.gradients[title_color];
                if (!grad) {
                    grad = LGraphCanvas.gradients[ title_color ] = ctx.createLinearGradient(0, 0, 400, 0);
                    grad.addColorStop(0, title_color); // TODO refactor: validate color !! prevent DOMException
                    grad.addColorStop(1, "#000");
                }
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = title_color;
            }

            //ctx.globalAlpha = 0.5 * old_alpha;
            ctx.beginPath();
            if (shape == LiteGraph.BOX_SHAPE || low_quality) {
                ctx.rect(0, -title_height, size[0] + 1, title_height);
            } else if (  shape == LiteGraph.ROUND_SHAPE || shape == LiteGraph.CARD_SHAPE ) {
                ctx.roundRect(
                    0,
                    -title_height,
                    size[0] + 1,
                    title_height,
                    node.flags.collapsed ? [this.round_radius] : [this.round_radius,this.round_radius,0,0]
                );
            }
            ctx.fill();
            ctx.shadowColor = "transparent";
        }

        var colState = false;
        if (LiteGraph.node_box_coloured_by_mode){
            if(LiteGraph.NODE_MODES_COLORS[node.mode]){
                colState = LiteGraph.NODE_MODES_COLORS[node.mode];
            }
        }
        if (LiteGraph.node_box_coloured_when_on){
            colState = node.action_triggered ? "#FFF" : (node.execute_triggered ? "#AAA" : colState);
        }
        
        //title box
        var box_size = 10;
        if (node.onDrawTitleBox) {
            node.onDrawTitleBox(ctx, title_height, size, this.ds.scale);
        } else if (
            shape == LiteGraph.ROUND_SHAPE ||
            shape == LiteGraph.CIRCLE_SHAPE ||
            shape == LiteGraph.CARD_SHAPE
        ) {
            if (low_quality) {
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(
                    title_height * 0.5,
                    title_height * -0.5,
                    box_size * 0.5 + 1,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
            
            ctx.fillStyle = newShade(bgcolor, 80) || node.boxcolor || colState || LiteGraph.NODE_DEFAULT_BOXCOLOR;
            if(low_quality) {
                ctx.fillRect( title_height * 0.5 - box_size *0.5, title_height * -0.5 - box_size *0.5, box_size , box_size  );
            } else if (node.glyph) {
                ctx.font = node.glyph.font || LiteGraph.NODE_DEFAULT_TITLE_FONT;
                const offset_width = node.glyph.width || 0;
                const offset_height = node.glyph.height || 0;
                ctx.fillText(
                    node.glyph.shape,
                    title_height * 0.5 - offset_width / 2,
                    title_height * -0.5 + offset_height / 2
                );
            } else {
                ctx.beginPath();
                ctx.arc(
                    title_height * 0.5,
                    title_height * -0.5,
                    box_size * 0.5,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        } else {
            if (low_quality) {
                ctx.fillStyle = "black";
                ctx.fillRect(
                    (title_height - box_size) * 0.5 - 1,
                    (title_height + box_size) * -0.5 - 1,
                    box_size + 2,
                    box_size + 2
                );
            }
            ctx.fillStyle = node.boxcolor || colState || LiteGraph.NODE_DEFAULT_BOXCOLOR;
            ctx.fillRect(
                (title_height - box_size) * 0.5,
                (title_height + box_size) * -0.5,
                box_size,
                box_size
            );
        }
        ctx.globalAlpha = old_alpha;

        // Title text
        if (node.onDrawTitleText) {
            node.onDrawTitleText(
                ctx,
                title_height,
                size,
                this.ds.scale,
                this.title_text_font,
                selected
            );
        }
        if (!low_quality) {
            ctx.font = this.title_text_font;
            var title = String(node.getTitle());
            if (title) {
                if (selected) {
                    ctx.fillStyle = LiteGraph.NODE_SELECTED_TITLE_COLOR;
                } else {
                    ctx.fillStyle =
                        node.constructor.title_text_color ||
                        this.node_title_color;
                }
                if (node.flags.collapsed) {
                    ctx.textAlign = "left";
                    var measure = ctx.measureText(title);
                    ctx.fillText(
                        title.substr(0,20), //avoid urls too long
                        title_height,// + measure.width * 0.5,
                        LiteGraph.NODE_TITLE_TEXT_Y - title_height
                    );
                    ctx.textAlign = "left";
                } else {
                    ctx.textAlign = "left";
                    var title_to_render = title;
                    var measure = ctx.measureText(title_to_render);

                    if (measure.width > size[0]) {
                        let size_per_char = title_to_render.length / measure.width;
                        let chars_to_draw = size[0] * 0.8 * size_per_char - 3;
                        title_to_render = title_to_render.substring(0, chars_to_draw) + '...';
                    } 

                    ctx.fillText(
                        title_to_render, //avoid urls too long
                        title_height,// + measure.width * 0.5,
                        LiteGraph.NODE_TITLE_TEXT_Y - title_height
                    );
                    ctx.textAlign = "left";
                }
            }
        }

        //subgraph box
        if (!node.flags.collapsed && node.subgraph && !node.skip_subgraph_button) {
            var w = LiteGraph.NODE_TITLE_HEIGHT;
            var x = node.size[0] - w;
            var over = LiteGraph.isInsideRectangle( this.graph_mouse[0] - node.pos[0], this.graph_mouse[1] - node.pos[1], x+2, -w+2, w-4, w-4 );
            ctx.fillStyle = over ? "#888" : "#555";
            if( shape == LiteGraph.BOX_SHAPE || low_quality)
                ctx.fillRect(x+2, -w+2, w-4, w-4);
            else
            {
                ctx.beginPath();
                ctx.roundRect(x+2, -w+2, w-4, w-4,[4]);
                ctx.fill();
            }
            ctx.fillStyle = "#333";
            ctx.beginPath();
            ctx.moveTo(x + w * 0.2, -w * 0.6);
            ctx.lineTo(x + w * 0.8, -w * 0.6);
            ctx.lineTo(x + w * 0.5, -w * 0.3);
            ctx.fill();
        }

        //custom title render
        if (node.onDrawTitle) {
            node.onDrawTitle(ctx);
        }
    }

    //render selection marker
    if (selected) {
        if (node.onBounding) {
            node.onBounding(area);
        }

        if (title_mode == LiteGraph.TRANSPARENT_TITLE) {
            area[1] -= title_height;
            area[3] += title_height;
        }
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        if (shape == LiteGraph.BOX_SHAPE) {
            ctx.rect(
                -6 + area[0],
                -6 + area[1],
                12 + area[2],
                12 + area[3]
            );
        } else if (
            shape == LiteGraph.ROUND_SHAPE ||
            (shape == LiteGraph.CARD_SHAPE && node.flags.collapsed)
        ) {
            ctx.roundRect(
                -0 + area[0],
                -0 + area[1],
                0 + area[2],
                0 + area[3],
                [this.round_radius]
            );
        } else if (shape == LiteGraph.CARD_SHAPE) {
            ctx.roundRect(
                -6 + area[0],
                -6 + area[1],
                12 + area[2],
                12 + area[3],
                [this.round_radius * 2,2,this.round_radius * 2,2]
            );
        } else if (shape == LiteGraph.CIRCLE_SHAPE) {
            ctx.arc(
                size[0] * 0.5,
                size[1] * 0.5,
                size[0] * 0.5 + 6,
                0,
                Math.PI * 2
            );
        }
        ctx.strokeStyle = LiteGraph.NODE_BOX_OUTLINE_COLOR;
        ctx.stroke();
        ctx.strokeStyle = fgcolor;
        ctx.globalAlpha = 1;
    }
    
    // these counter helps in conditioning drawing based on if the node has been executed or an action occurred
    if (node.execute_triggered>0) node.execute_triggered--;
    if (node.action_triggered>0) node.action_triggered--;
};


//used by this.over_link_center
LGraphCanvas.prototype.drawLinkTooltip = function( ctx, link )
{
    var pos = link._pos;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc( pos[0], pos[1], 3, 0, Math.PI * 2 );
    ctx.fill();

    if(link.data == null)
        return;

    if(this.onDrawLinkTooltip)
        if( this.onDrawLinkTooltip(ctx,link,this) == true )
            return;

    var data = link.data;
    var text = null;

    if( data.constructor === Number )
        text = data.toFixed(2);
    else if( data.constructor === String )
        text = "\"" + data + "\"";
    else if( data.constructor === Boolean )
        text = String(data);
    else if (data.toToolTip)
        text = data.toToolTip();
    else
        text = JSON.stringify(data, null, 2); // "[" + data.constructor.name + "]";

    if(text == null)
        return;

    // text = text.substr(0,30); //avoid weird

    let lines = text.split('\n');
    let line_w = 14;
    
    ctx.font = "14px Courier New";
    let info = lines.map((line)=>ctx.measureText(line).width).reduce((a,b)=>Math.max(a,b));

    let h = line_w * ( lines.length + 1 ); // + 25 * 0.3;
    let w = info + 20;
    
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;
    ctx.fillStyle = "#454";
    ctx.beginPath();
    ctx.roundRect( pos[0] - w*0.5, pos[1] - 15 - h, w, h, [3]);
    ctx.moveTo( pos[0] - 10, pos[1] - 15 );
    ctx.lineTo( pos[0] + 10, pos[1] - 15 );
    ctx.lineTo( pos[0], pos[1] - 5 );
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.textAlign = "left";
    ctx.fillStyle = "#CEC";

    for(let l in lines) {
        ctx.fillText(lines[l], pos[0] - w * 0.5 + 8, pos[1] - h + line_w * l + 15 * 0.3);
    }
}