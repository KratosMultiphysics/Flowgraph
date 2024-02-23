// LGraphCanvas.prototype.createPanel = function(title, options) {
//     options = options || {};

//     var ref_window = options.window || window;
//     var root = document.createElement("div");
//     root.className = "litegraph dialog";
//     root.innerHTML = "<div class='dialog-header'><span class='dialog-title'></span></div><div class='dialog-content'></div><div style='display:none;' class='dialog-alt-content'></div><div class='dialog-footer'></div>";
//     root.header = root.querySelector(".dialog-header");

//     if(options.width)
//         root.style.width = options.width + (options.width.constructor === Number ? "px" : "");
//     if(options.height)
//         root.style.height = options.height + (options.height.constructor === Number ? "px" : "");
//     if(options.closable)
//     {
//         var close = document.createElement("span");
//         close.innerHTML = "&#10005;";
//         close.classList.add("close");
//         close.addEventListener("click",function(){
//             root.close();
//         });
//         root.header.appendChild(close);
//     }
//     root.title_element = root.querySelector(".dialog-title");
//     root.title_element.innerText = title;
//     root.content = root.querySelector(".dialog-content");
//     root.alt_content = root.querySelector(".dialog-alt-content");
//     root.footer = root.querySelector(".dialog-footer");

//     root.close = function()
//     {
//         if (root.onClose && typeof root.onClose == "function"){
//             root.onClose();
//         }
//         if(root.parentNode)
//             root.parentNode.removeChild(root);
//         /* XXX CHECK THIS */
//         if(this.parentNode){
//             this.parentNode.removeChild(this);
//         }
//         /* XXX this was not working, was fixed with an IF, check this */
//     }

//     // function to swap panel content
//     root.toggleAltContent = function(force){
//         if (typeof force != "undefined"){
//             var vTo = force ? "block" : "none";
//             var vAlt = force ? "none" : "block";
//         }else{
//             var vTo = root.alt_content.style.display != "block" ? "block" : "none";
//             var vAlt = root.alt_content.style.display != "block" ? "none" : "block";
//         }
//         root.alt_content.style.display = vTo;
//         root.content.style.display = vAlt;
//     }
    
//     root.toggleFooterVisibility = function(force){
//         if (typeof force != "undefined"){
//             var vTo = force ? "block" : "none";
//         }else{
//             var vTo = root.footer.style.display != "block" ? "block" : "none";
//         }
//         root.footer.style.display = vTo;
//     }
    
//     root.clear = function()
//     {
//         this.content.innerHTML = "";
//     }

//     root.addHTML = function(code, classname, on_footer)
//     {
//         var elem = document.createElement("div");
//         if(classname)
//             elem.className = classname;
//         elem.innerHTML = code;
//         if(on_footer)
//             root.footer.appendChild(elem);
//         else
//             root.content.appendChild(elem);
//         return elem;
//     }

//     root.addButton = function( name, callback, options )
//     {
//         var elem = document.createElement("button");
//         elem.innerText = name;
//         elem.options = options;
//         elem.classList.add("btn");
//         elem.addEventListener("click",callback);
//         root.footer.appendChild(elem);
//         return elem;
//     }

//     root.addSeparator = function()
//     {
//         var elem = document.createElement("div");
//         elem.className = "separator";
//         root.content.appendChild(elem);
//     }

//     root.addWidget = function( type, name, value, options, callback )
//     {
//         options = options || {};
//         var str_value = String(value);
//         type = type.toLowerCase();
//         if(type == "number")
//             str_value = value.toFixed(3);

//         var elem = document.createElement("div");
//         elem.className = "property";
//         elem.innerHTML = "<span class='property_name'></span><span class='property_value'></span>";
//         elem.querySelector(".property_name").innerText = options.label || name;
//         var value_element = elem.querySelector(".property_value");
//         value_element.innerText = str_value;
//         elem.dataset["property"] = name;
//         elem.dataset["type"] = options.type || type;
//         elem.options = options;
//         elem.value = value;

//         if( type == "code" )
//             elem.addEventListener("click", function(e){ root.inner_showCodePad( this.dataset["property"] ); });
//         else if (type == "boolean")
//         {
//             elem.classList.add("boolean");
//             if(value)
//                 elem.classList.add("bool-on");
//             elem.addEventListener("click", function(){ 
//                 var propname = this.dataset["property"];
//                 this.value = !this.value;
//                 this.classList.toggle("bool-on");
//                 this.querySelector(".property_value").innerText = this.value ? "true" : "false";
//                 innerChange(propname, this.value );
//             });
//         }
//         else if (type == "string" || type == "number")
//         {
//             value_element.setAttribute("contenteditable",true);
//             value_element.addEventListener("keydown", function(e){ 
//                 if(e.code == "Enter" && (type != "string" || !e.shiftKey)) // allow for multiline
//                 {
//                     e.preventDefault();
//                     this.blur();
//                 }
//             });
//             value_element.addEventListener("blur", function(){ 
//                 var v = this.innerText;
//                 var propname = this.parentNode.dataset["property"];
//                 var proptype = this.parentNode.dataset["type"];
//                 if( proptype == "number")
//                     v = Number(v);
//                 innerChange(propname, v);
//             });
//         }
//         else if (type == "cstring")
//         {
//             value_element.addEventListener("keydown", function(e){ 
//                 if(e.code == "Enter" && (type != "string" || !e.shiftKey)) // allow for multiline
//                 {
//                     e.preventDefault();
//                     this.blur();
//                 }
//             });
//             value_element.addEventListener("blur", function(){ 
//                 var v = this.innerText;
//                 var propname = this.parentNode.dataset["property"];
//                 var proptype = this.parentNode.dataset["type"];
//                 if( proptype == "number")
//                     v = Number(v);
//                 innerChange(propname, v);
//             });
//         }
//         else if (type == "enum" || type == "combo") {
//             var str_value = LGraphCanvas.getPropertyPrintableValue( value, options.values );
//             value_element.innerText = str_value;

//             value_element.addEventListener("click", function(event){ 
//                 var values = options.values || [];
//                 var propname = this.parentNode.dataset["property"];
//                 var elem_that = this;
//                 var menu = new LiteGraph.ContextMenu(values,{
//                         event: event,
//                         className: "dark",
//                         callback: inner_clicked
//                     },
//                     ref_window);
//                 function inner_clicked(v, option, event) {
//                     //node.setProperty(propname,v); 
//                     //graphcanvas.dirty_canvas = true;
//                     elem_that.innerText = v;
//                     innerChange(propname,v);
//                     return false;
//                 }
//             });
//         }

//         root.content.appendChild(elem);

//         function innerChange(name, value)
//         {
//             //console.log("change",name,value);
//             //that.dirty_canvas = true;
//             if(options.callback)
//                 options.callback(name,value,options);
//             if(callback)
//                 callback(name,value,options);
//         }

//         return elem;
//     }

//     if (root.onOpen && typeof root.onOpen == "function") root.onOpen();
    
//     return root;
// };

LGraphCanvas.prototype.showShowNodePanel = function( node )
{
    this.SELECTED_NODE = node;
    this.closePanels();
    var ref_window = this.getCanvasWindow();
    var that = this;
    var graphcanvas = this;
    var panel = this.createPanel(node.title || "",{
                                                closable: true
                                                ,window: ref_window
                                                ,onOpen: function(){
                                                    graphcanvas.NODEPANEL_IS_OPEN = true;
                                                }
                                                ,onClose: function(){
                                                    graphcanvas.NODEPANEL_IS_OPEN = false;
                                                    graphcanvas.node_panel = null;
                                                }
                                            });
    graphcanvas.node_panel = panel;
    panel.id = "node-panel";
    panel.node = node;
    panel.classList.add("settings");

    function inner_refresh()
    {
        panel.content.innerHTML = ""; //clear
        panel.addHTML("<span class='node_type'>"+node.type+"</span>")
        panel.addHTML("<span class='node_desc'>"+(node.constructor.desc || "")+"</span>")
        panel.addHTML("<span class='separator'></span>");
        panel.addHTML("<span class='node_type'>Related Doc</span>")
        panel.addHTML("<span class='node_desc'>"+(node.constructor.doc || "")+"</span>")
        panel.addHTML("<span class='separator'></span>");

        panel.addHTML("<h3>Properties</h3>");

        var fUpdate = function(name,value){
            graphcanvas.graph.beforeChange(node);
            switch(name){
                case "Title":
                    node.title = value;
                    break;
                case "Mode":
                    var kV = Object.values(LiteGraph.NODE_MODES).indexOf(value);
                    if (kV>=0 && LiteGraph.NODE_MODES[kV]){
                        node.changeMode(kV);
                    }else{
                        console.warn("unexpected mode: "+value);
                    }
                    break;
                case "Color":
                    if (LGraphCanvas.node_colors[value]){
                        node.color = LGraphCanvas.node_colors[value].color;
                        node.bgcolor = LGraphCanvas.node_colors[value].bgcolor;
                    }else{
                        console.warn("unexpected color: "+value);
                    }
                    break;
                default:
                    node.setProperty(name,value);
                    break;
            }
            graphcanvas.graph.afterChange();
            graphcanvas.dirty_canvas = true;
        };
        
        // panel.addWidget( "cstring", "Title", node.title, {}, fUpdate);
        
        // panel.addWidget( "combo", "Mode", LiteGraph.NODE_MODES[node.mode], {values: LiteGraph.NODE_MODES}, fUpdate);
        
        // var nodeCol = "";
        // if (node.color !== undefined){
        //     nodeCol = Object.keys(LGraphCanvas.node_colors).filter(function(nK){ return LGraphCanvas.node_colors[nK].color == node.color; });
        // }
        
        // panel.addWidget( "combo", "Color", nodeCol, {values: Object.keys(LGraphCanvas.node_colors)}, fUpdate);
        
        for(var pName in node.properties)
        {
            var value = node.properties[pName];
            var info = node.getPropertyInfo(pName);
            var type = info.type || "string";

            //in case the user wants control over the side panel widget
            if( node.onAddPropertyToPanel && node.onAddPropertyToPanel(pName,panel) )
                continue;

            panel.addWidget( info.widget || info.type, pName, value, info, fUpdate);
        }

        panel.addSeparator();

        if(node.onShowCustomPanelInfo)
            node.onShowCustomPanelInfo(panel);

        panel.footer.innerHTML = ""; // clear
        panel.addButton("Delete",function(){
            if(node.block_delete)
                return;
            node.graph.remove(node);
            panel.close();
        }).classList.add("delete");
    }

    panel.inner_showCodePad = function( propname )
    {
        panel.classList.remove("settings");
        panel.classList.add("centered");

        panel.alt_content.innerHTML = "<textarea class='code'></textarea>";
        var textarea = panel.alt_content.querySelector("textarea");
        var fDoneWith = function(){
            panel.toggleAltContent(false); //if(node_prop_div) node_prop_div.style.display = "block"; // panel.close();
            panel.toggleFooterVisibility(true);
            textarea.parentNode.removeChild(textarea);
            panel.classList.add("settings");
            panel.classList.remove("centered");
            inner_refresh();
        }
        textarea.value = node.properties[propname];
        textarea.addEventListener("keydown", function(e){
            if(e.code == "Enter" && e.ctrlKey )
            {
                node.setProperty(propname, textarea.value);
                fDoneWith();
            }
        });
        panel.toggleAltContent(true);
        panel.toggleFooterVisibility(false);
        textarea.style.height = "calc(100% - 40px)";

        var assign = panel.addButton( "Assign", function(){
            node.setProperty(propname, textarea.value);
            fDoneWith();
        });
        panel.alt_content.appendChild(assign);
        var button = panel.addButton( "Close", fDoneWith);
        button.style.float = "right";
        panel.alt_content.appendChild(button);
    }

    inner_refresh();

    this.canvas.parentNode.appendChild( panel );
}
