let enableDomClipping = true;

export class DOMWidget {
    constructor(name, element, options) {
        this.type = "DOM";
        this.name = name;
        this.options = options || {};
        this.elem = element;

        this.elem.options = this.options;
        Object.assign(this.elem.style, {
            display: "none",
        });
    }

    get value() {
        return this.options.getValue?.() ?? undefined;
    }

    set value(v) {
        options.setValue?.(v);
        this.callback?.(this.value);
    }

    onAdded() {
        // If the element is not appended to the document, append it
        if(!this.elem.parentElement) {
            document.body.append(this.elem);
        }
    }

    onRemoved() {
        // If the element is appended to the document, remove it
        if(this.elem.parentElement) {
            this.elem.parentElement.remove(this.elem);
        }

        this.elem.remove();
    }

    draw(ctx, node, widgetWidth, y, widgetHeight) { 
        // TODO: Handle hidden 

        const margin = 10;
        const elAabb = ctx.canvas.getBoundingClientRect();
        const transform = new DOMMatrix()
            .scaleSelf(elAabb.width / ctx.canvas.width, elAabb.height / ctx.canvas.height)
            .multiplySelf(ctx.getTransform())
            .translateSelf(margin, margin + y);

        const scale = new DOMMatrix().scaleSelf(transform.a, transform.d);

        Object.assign(this.elem.style, {
            transformOrigin:    "0 0",
            transform:          scale,
            left:               `${transform.a + transform.e}px`,
            top:                `${transform.d + transform.f}px`,
            width:              `${widgetWidth - margin * 2}px`,
            height:             `${(this.computedHeight ?? 50) - margin * 2}px`,
            position:           "absolute",
            display:            "block",
            zIndex:             0, // app.graph._nodes.indexOf(node),
        });

        if (enableDomClipping) {
            // this.elem.style.clipPath = getClipPath(node, this.elem);
            // this.elem.style.willChange = "clip-path";
        }

        this.options.onDraw?.(this)
    }
}

// LGraphNode.prototype.addDOMWidget = function (name, type, element, options) {
// 	options = { hideOnZoom: true, selectOn: ["focus", "click"], ...options };

// 	if (!element.parentElement) {
// 		document.body.append(element);
// 	}

// 	let mouseDownHandler;
// 	if (element.blur) {
// 		mouseDownHandler = (event) => {
// 			if (!element.contains(event.target)) {
// 				element.blur();
// 			}
// 		};
// 		document.addEventListener("mousedown", mouseDownHandler);
// 	}

// 	const widget = {
// 		type,
// 		name,
// 		get value() {
// 			return options.getValue?.() ?? undefined;
// 		},
// 		set value(v) {
// 			options.setValue?.(v);
// 			widget.callback?.(widget.value);
// 		},
// 		draw: function (ctx, node, widgetWidth, y, widgetHeight) {
// 			if (widget.computedHeight == null) {
// 				computeSize.call(node, node.size);
// 			}

// 			const hidden =
// 				node.flags?.collapsed ||
// 				(!!options.hideOnZoom && app.canvas.ds.scale < 0.5) ||
// 				widget.computedHeight <= 0 ||
// 				widget.type === "converted-widget"||
// 				widget.type === "hidden";
// 			element.hidden = hidden;
// 			element.style.display = hidden ? "none" : null;
// 			if (hidden) {
// 				widget.options.onHide?.(widget);
// 				return;
// 			}

// 			const margin = 10;
// 			const elRect = ctx.canvas.getBoundingClientRect();
// 			const transform = new DOMMatrix()
// 				.scaleSelf(elRect.width / ctx.canvas.width, elRect.height / ctx.canvas.height)
// 				.multiplySelf(ctx.getTransform())
// 				.translateSelf(margin, margin + y);

// 			const scale = new DOMMatrix().scaleSelf(transform.a, transform.d);

// 			Object.assign(element.style, {
// 				transformOrigin: "0 0",
// 				transform: scale,
// 				left: `${transform.a + transform.e}px`,
// 				top: `${transform.d + transform.f}px`,
// 				width: `${widgetWidth - margin * 2}px`,
// 				height: `${(widget.computedHeight ?? 50) - margin * 2}px`,
// 				position: "absolute",
// 				zIndex: 10,
// 			});

// 			if (enableDomClipping) {
// 				element.style.clipPath = getClipPath(node, element);
// 				element.style.willChange = "clip-path";
// 			}

// 			this.options.onDraw?.(widget);
// 		},
// 		element,
// 		options,
// 		onRemove() {
// 			if (mouseDownHandler) {
// 				document.removeEventListener("mousedown", mouseDownHandler);
// 			}
// 			element.remove();
// 		},
// 	};

// 	for (const evt of options.selectOn) {
// 		element.addEventListener(evt, () => {
// 			app.canvas.selectNode(this);
// 			app.canvas.bringToFront(this);
// 		});
// 	}

// 	this.addCustomWidget(widget);
// 	elementWidgets.add(this);

// 	const collapse = this.collapse;
// 	this.collapse = function() {
// 		collapse.apply(this, arguments);
// 		if(this.flags?.collapsed) {
// 			element.hidden = true;
// 			element.style.display = "none";
// 		}
// 	}

// 	const onRemoved = this.onRemoved;
// 	this.onRemoved = function () {
// 		element.remove();
// 		elementWidgets.delete(this);
// 		onRemoved?.apply(this, arguments);
// 	};

// 	if (!this[SIZE]) {
// 		this[SIZE] = true;
// 		const onResize = this.onResize;
// 		this.onResize = function (size) {
// 			options.beforeResize?.call(widget, this);
// 			computeSize.call(this, size);
// 			onResize?.apply(this, arguments);
// 			options.afterResize?.call(widget, this);
// 		};
// 	}

// 	return widget;
// };