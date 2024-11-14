let label_trim = LiteGraph.WIDGET_LABEL_TRIM || 10;
let value_trim = LiteGraph.WIDGET_VALUE_TRIM || 10;

let asClassName = (v) => {return v.replaceAll(' ', '_')};

export class VectorWidget {
    constructor(name, components, options) {
        this.type = "vector";
        this.name = name;

        // Important: This variable needs to be called value so the serialization works
        this.options = options || {};
        this.value = components || { "X": 0.0, "Y": 0.0, "Z": 0.0 };
        this.elem = document.createElement("div");
    
        // Not sure why are we using a DOM element to store the values.
        this.elem.className = "property";
        this.elem.innerHTML = "<span class='property_name'></span>"
    
        // Add values for every component
        this.elem.innerHTML += "<span class='property_value'>";
        Object.entries(components).forEach(([key,val],idx) => {
            this.elem.innerHTML += `<span class='component_${asClassName(key)}'></span>`;
        });
        this.elem.innerHTML += "</span>";
    
        Object.entries(components).forEach(([key,val],idx) => {
            let value_comp = this.elem.querySelector(`.component_${asClassName(key)}`);
            value_comp.innerText = String(val);
        });
    
        let value_element = this.elem.querySelector(`.property_value`);
        value_element.innerText = Object.entries(components).map(([key,val]) => {
            let value_comp = this.elem.querySelector(`.component_${asClassName(key)}`);
            return value_comp.innerText;
        });
    
        this.elem.dataset["property"] = this.name;
        this.elem.dataset["type"] = this.options.type || this.type;
    
        this.elem.options = this.options;
    }

    draw(ctx, node, widgetWidth, y, widgetHeight) {
        var H = LiteGraph.NODE_WIDGET_HEIGHT;
        var show_text = true;
        ctx.globalAlpha = 0.9;
        var outline_color = LiteGraph.WIDGET_OUTLINE_COLOR;
        var background_color = LiteGraph.WIDGET_BGCOLOR;
        var text_color = LiteGraph.WIDGET_TEXT_COLOR;
        var secondary_text_color = LiteGraph.WIDGET_SECONDARY_TEXT_COLOR;
        var margin = 18;
        var num_components = Object.keys(this.value).length;

        ctx.textAlign = "left";
        ctx.fillStyle = text_color;
        ctx.fillText( this.name, margin * 2, y + H * 0.7 + H * (0));

        ctx.strokeStyle = outline_color;
        ctx.fillStyle = background_color;

        ctx.beginPath();

        if(show_text)
            ctx.roundRect(margin, y+H*(1), widgetWidth - margin * 2, num_components * H, [H * 0.5] );
        else
            ctx.rect(margin, y+H*(1), widgetWidth - margin * 2, num_components * H );

        ctx.fill();
        if (show_text) {
            if(!this.disabled) {
                ctx.stroke();
                
                for( let i = 0; i < num_components - 1; i++ ) {
                    ctx.beginPath();
                    ctx.moveTo(margin,y+H*(i+2));
                    ctx.lineTo(widgetWidth - margin,y+H*(i+2));
                    ctx.stroke();
                }
            }
            ctx.fillStyle = secondary_text_color;

            Object.entries(this.value).forEach(([key,val],idx) => {
                let label_text = String(key).substring(0,label_trim) + (key.length < (label_trim + 3) ? "" : "...");
                ctx.fillText( label_text, margin * 2, y + H * 0.7 + H * (idx+1));
            });
            
            ctx.fillStyle = text_color;
            ctx.textAlign = "right";
            if (this.type == "number") {
                ctx.fillText(
                    Number(w.value).toFixed(
                        w.options.precision !== undefined
                            ? w.options.precision
                            : 3
                    ),
                    widgetWidth - margin * 2 - 20,
                    y + H * 0.7
                );
            } else {
                Object.entries(this.value).forEach(([key,val],idx) => {
                    let value      = this.elem.querySelector(`.component_${asClassName(key)}`).innerText;
                    let value_text = String(value).substring(0,value_trim) + (value.length < (value_trim + 3) ? "" : "...");
                    ctx.fillText(
                        value_text, widgetWidth - margin * 2, y + H * 0.7 + H * (idx+1)
                    );

                });
            }
        }
    }

    computeSize(x) {
        return [x, (Object.keys(this.value).length + 1) * LiteGraph.NODE_WIDGET_HEIGHT];
    }

    mouse(event, [x, y], node) {
        let w = this;
        if (event.type == LiteGraph.pointerevents_method+"down") {
            event.target.data.vector_prompt(node.title + ": " + this.name,w.value,function(v) {
                this.inner_value_change(this, v);
            }.bind(w),
            event,w.options ? w.options.multiline : false );
        }
    }

    inner_value_change(widget, values) {
        Object.entries(this.value).forEach(([key,val],idx) => {
            let value_comp = widget.elem.querySelector(`.component_${asClassName(key)}`);
            value_comp.innerText = values.get(key);
            widget.value[key] = values.get(key);
        });
    }
}