    // refactor: there are different dialogs, some uses createDialog some dont
    LGraphCanvas.prototype.vector_prompt = function(title, values, callback, event, multiline) {
        var that = this;
        var input_html = "";
        title = title || "";

        var dialog = document.createElement("div");
        dialog.is_modified = false;
        dialog.className = "graphdialog rounded";

        var dialog_title = document.createElement("div");

        dialog_title.className = " displayinput";
        dialog_title.innerHTML = "<span class='name'></span></div>";

        var dialog_form = document.createElement("form");

        dialog_form.setAttribute("id", "dialog-vector");

        Object.keys(values).forEach(function(key) {
            var form_input = document.createElement("div");
            
            form_input.className = "displayinput";
            form_input.innerHTML = "<span class='label'>"+key+"</span><input autofocus type='text' class='value'/ name='"+key+"' value='"+values[key]+"'>";

            dialog_form.appendChild(form_input);
        });

        var dialog_button = document.createElement("div");

        dialog_button.className = "displayinput";
        dialog_button.innerHTML = "<div class='displayinput'><button class='rounded'>OK</button>";

        dialog.appendChild(dialog_title);
        dialog.appendChild(dialog_form);
        dialog.appendChild(dialog_button);

        dialog.close = function() {
            that.prompt_box = null;
            if (dialog.parentNode) {
                dialog.parentNode.removeChild(dialog);
            }
        };

        var graphcanvas = LGraphCanvas.active_canvas;
        var canvas = graphcanvas.canvas;
        canvas.parentNode.appendChild(dialog);
        
        // if (this.ds.scale > 1) {
        //     dialog.style.transform = "scale(" + this.ds.scale + ")";
        // }

        var dialogCloseTimer = null;
        var prevent_timeout = false;
        LiteGraph.pointerListenerAdd(dialog,"leave", function(e) {
            if (prevent_timeout)
                return;
            if(LiteGraph.dialog_close_on_mouse_leave)
                if (!dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave)
                    dialogCloseTimer = setTimeout(dialog.close, LiteGraph.dialog_close_on_mouse_leave_delay); //dialog.close();
        });
        LiteGraph.pointerListenerAdd(dialog,"enter", function(e) {
            if(LiteGraph.dialog_close_on_mouse_leave)
                if(dialogCloseTimer) clearTimeout(dialogCloseTimer);
        });
        var selInDia = dialog.querySelectorAll("select");
        if (selInDia){
            // if filtering, check focus changed to comboboxes and prevent closing
            selInDia.forEach(function(selIn) {
                selIn.addEventListener("click", function(e) {
                    prevent_timeout++;
                });
                selIn.addEventListener("blur", function(e) {
                   prevent_timeout = 0;
                });
                selIn.addEventListener("change", function(e) {
                    prevent_timeout = -1;
                });
            });
        }

        if (that.prompt_box) {
            that.prompt_box.close();
        }
        that.prompt_box = dialog;

        var first = null;
        var timeout = null;
        var selected = null;

        var name_element = dialog.querySelector(".name");
        var value_element = dialog.querySelector("#dialog-vector");

        name_element.innerText = title;

        var input = value_element;
        input.addEventListener("keydown", function(e) {
            dialog.is_modified = true;
            if (e.keyCode == 27) {
                //ESC
                dialog.close();
            } else if (e.keyCode == 13 && e.target.localName != "textarea") {
                if (callback) {
                    callback(this.value);
                }
                dialog.close();
            } else {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
        });

        var button = dialog.querySelector("button");
        button.addEventListener("click", function(e) {
            if (callback) {
                callback(new FormData(input));
            }
            that.setDirty(true);
            dialog.close();
        });

        var rect = canvas.getBoundingClientRect();
        var offsetx = -20;
        var offsety = -20;
        if (rect) {
            offsetx -= rect.left;
            offsety -= rect.top;
        }

        // if (event) {
        //     dialog.style.left = event.clientX + offsetx + "px";
        //     dialog.style.top = event.clientY + offsety + "px";
        // } else {
        //     dialog.style.left = canvas.width * 0.5 + offsetx + "px";
        //     dialog.style.top = canvas.height * 0.5 + offsety + "px";
        // }

        setTimeout(function() {
            input.focus();
        }, 10);

        return dialog;
    };