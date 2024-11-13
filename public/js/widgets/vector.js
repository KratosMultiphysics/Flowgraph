let label_trim = LiteGraph.WIDGET_LABEL_TRIM || 10;
let value_trim = LiteGraph.WIDGET_VALUE_TRIM || 10;

let asClassName = (v) => {return v.replaceAll(' ', '_')};

export class VectorWidget {
    constructor(name, components, options) {
        this.type = "vector";
        this.name = name;
        this.comp = components  || { "X": 0.0, "Y": 1.0, "Z": 2.0 };
        this.options = options  || {};
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

    get value() {
        return options.getValue?.() ?? undefined;
    }

    set value(v) {
        options.setValue?.(v);
        widget.callback?.(widget.value);
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
        var num_components = Object.keys(this.comp).length;

        ctx.textAlign = "left";
        ctx.strokeStyle = outline_color;
        ctx.fillStyle = background_color;
        ctx.beginPath();

        if(show_text)
            ctx.roundRect(margin, y, widgetWidth - margin * 2, num_components * H, [H * 0.5] );
        else
            ctx.rect(margin, y, widgetWidth - margin * 2, num_components * H );

        ctx.fill();
        if (show_text) {
            if(!this.disabled) {
                ctx.stroke();
                
                for( let i = 0; i < num_components - 1; i++ ) {
                    ctx.beginPath();
                    ctx.moveTo(margin,y+H*(i+1));
                    ctx.lineTo(widgetWidth - margin,y+H*(i+1));
                    ctx.stroke();
                }
            }
            ctx.fillStyle = text_color;
            ctx.fillStyle = secondary_text_color;

            Object.entries(this.comp).forEach(([key,val],idx) => {
                let label_text = String(key).substring(0,label_trim) + (key.length < (label_trim + 3) ? "" : "...");
                ctx.fillText( label_text, margin * 2, y + H * 0.7 + H * (idx));
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
                Object.entries(this.comp).forEach(([key,val],idx) => {
                    let value      = this.elem.querySelector(`.component_${asClassName(key)}`).innerText;
                    let value_text = String(value).substring(0,value_trim) + (value.length < (value_trim + 3) ? "" : "...");
                    ctx.fillText(
                        value_text, widgetWidth - margin * 2, y + H * 0.7 + H * (idx)
                    );

                });
            }
        }
    }

    computeSize(x) {
        return [x, Object.keys(this.comp).length * LiteGraph.NODE_WIDGET_HEIGHT];
    }
}