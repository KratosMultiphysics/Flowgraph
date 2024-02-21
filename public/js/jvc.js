/**
 * jQuery json-viewer-callback (JVC)
 * @author: andronick83 <andronick.mail@gmail.com>
 * @link: https://github.com/andronick83/jquery.json-viewer-callback
 */

"use strict";

var JVC={};

/* DEFAULTS */
JVC.defOptions={key:undefined,invertColors:false,withLinks:true,bigNumbers:false,withQuotes:false,withFunctions:true,
	collapsed:false,showConf:false,showJSON:false,debug:console.debug,error:console.error,callback:null,onChange:null};
JVC.defFontFamily='"Source Code Pro",monospace';
JVC.defStyle=`
.hljs{background-color:#293134;color:#e0e2e4}
.hljs-keyword{color:#93c763;font-style:normal}
.hljs-number{color:#ffcd22}
.hljs-string{color:#ec7600}
.hljs-title{color:#dcdcaa;font-style:normal}
.hljs-attr{color:#678cb1}
.hljs-comment{color:#818e96;font-style:italic}`;


/* SETTERS */
JVC.setProperty=(n,v)=>{document.querySelector(":root").style.setProperty('--jvc-'+n,v)};
JVC.setTabSize=(l=4)=>{JVC.setProperty('tab-size',l)};
JVC.setTabWidth=(w=33.6)=>{JVC.setProperty('tab-width',w+'px')};
JVC.setLineHeight=(h=18)=>{JVC.setProperty('line-height',Math.ceil(h/2)*2+'px')};
JVC.setFontSize=(s=14)=>{JVC.setProperty('font-size',s+'px')};
JVC.setFontFamily=(n=JVC.defFontFamily)=>{JVC.setProperty('font-family',n)};
JVC.setStyle=(n)=>{
	var u=n,h=document.querySelector('head'),o=document.querySelectorAll('.jvc-style');if(!n&&o.length)return;
	o.forEach((e)=>{e.classList.remove('jvc-style');e.classList.add('jvc-style-old')});
	var delOld=()=>{document.querySelectorAll('.jvc-style-old').forEach((e)=>{e.remove()})};
	var setStyle=(d='')=>{var s=document.createElement('style');s.className='jvc-style';s.append(d);h.append(s);delOld()}
	if(n=='no-style')return setStyle();if(n=='jvc-default')return setStyle(JVC.defStyle);
	if(!JVC.__isUrl(u))u='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/'+n+'.min.css';
	var l=document.createElement('link');l.setAttribute('rel','stylesheet');l.className='jvc-style';
	l.onload=delOld;l.setAttribute('href',u);h.append(l)};

/* GETTERS */
JVC.getJSON=(doc)=>{
	var dom=JVC.__nodeData(doc,'dom');
	if(!dom){console.error('JVC.getJSON','No JVC element');return false}
	return JVC.__getText(dom)};

/* JVC */
JVC.__isEventExists=(d,e)=>{var evs=$._data(d,'events');return evs&&(e in evs)};
JVC.__isUrl=(s)=>{try{let url=new URL(s);return url.protocol==="http:"||url.protocol==="https:"}catch(_){return false}};
JVC.__objDiff=(d,o)=>{var r={};for(const[k,v]of Object.entries(d))if((k in o)&&v!==o[k])r[k]=o[k];return r};
JVC.__objFix=(obj)=>{var t=typeof obj;if(t==='function'||t==='undefined')return obj+'';
	if(t==='object'){for(var k in obj)if(obj.hasOwnProperty(k))obj[k]=JVC.__objFix(obj[k])}return obj}
JVC.__nodeData=(d,n,v=null)=>{if(!('__jvc'in d))d.__jvc={};if(v===null)return d.__jvc[n];d.__jvc[n]=v;return v};
JVC.__getText=(dom)=>{
	dom.property.hidden=dom.colon.hidden=true;var text=dom.root.innerText;
	dom.property.hidden=dom.colon.hidden=false;return text};
JVC.__tabObserver=()=>{
	var tab=document.querySelector('.jvc-tab-observer'),c=10;if(tab)return;
	tab=document.createElement('span');tab.classList.add('jvc','jvc-tab-observer');tab.append("\t".repeat(c));
	document.querySelector('body').append(tab);
	var onResize=()=>{var w=tab.offsetWidth/c,h=tab.offsetHeight;if(w+h!=0){JVC.setTabWidth(w);JVC.setLineHeight(h)}}
	const resizeObserver=new ResizeObserver((entries)=>{entries.forEach(onResize)});
	resizeObserver.observe(tab);return onResize()};

JVC.nSpan=	document.createElement('span');
JVC.nRoot=	JVC.nSpan.cloneNode();		JVC.nRoot.className='jvc-root';
JVC.nItem=	JVC.nSpan.cloneNode();		JVC.nItem.className='jvc-item';
JVC.nSpace=	JVC.nSpan.cloneNode();		JVC.nSpace.className='jvc-space';	JVC.nSpace.innerText=' ';
JVC.nTabs=	JVC.nSpace.cloneNode();		JVC.nTabs.classList.add('jvc-tabs');
JVC.nQuote=	JVC.nSpan.cloneNode();		JVC.nQuote.className='jvc-quote';	JVC.nQuote.innerText='"';
JVC.nProperty=	JVC.nSpan.cloneNode();		JVC.nProperty.className='hljs-attr';
JVC.nPunct=	JVC.nSpan.cloneNode();		JVC.nPunct.className='hljs-punctuation';
JVC.nValue=	JVC.nSpan.cloneNode();		JVC.nValue.className='jvc-value';
JVC.nComma=	JVC.nPunct.cloneNode();		JVC.nComma.classList.add('jvc-comma');	JVC.nComma.innerHTML=',';
JVC.nComment=	JVC.nSpan.cloneNode();		JVC.nComment.className='hljs-comment';
JVC.nList=	JVC.nSpan.cloneNode();		JVC.nList.className='jvc-list';
JVC.nPrefix=	JVC.nSpan.cloneNode();		JVC.nPrefix.className='jvc-prefix';
JVC.nSuffix=	JVC.nSpan.cloneNode();		JVC.nSuffix.className='jvc-suffix';
JVC.nLink=	document.createElement('a');						JVC.nLink.setAttribute('target','_blank');
JVC.nLogs=	JVC.nSpan.cloneNode();		JVC.nLogs.classList.add('hljs-comment','jvc-logs');

(function($){
	function obj2dom(key,val,level,options){
		var dom={"level":level,_list:null};
		dom.root=	JVC.nItem.cloneNode();
		var tabs=	JVC.nTabs.cloneNode();		// tabs: "\t"
		dom.property=	JVC.nProperty.cloneNode();	// property name
		dom.colon=	JVC.nPunct.cloneNode();		// colon: ": "
		dom.value=	JVC.nValue.cloneNode();		// value: string, numeric, bool, null, callback, etc.
		dom.braceStart=	JVC.nPunct.cloneNode();		// start brace: "[", "{"
		var comma=	JVC.nComma.cloneNode(true);	// comma: ","
		dom.pholder=	JVC.nComment.cloneNode();	// comment: "/* .. */"
		dom.braceEnd=	JVC.nPunct.cloneNode();		// end brace: "]", "}"
		dom.list=	JVC.nList.cloneNode();		// elements of: array, dict, etc.
		var prefix=	JVC.nPrefix.cloneNode();
		var suffix=	JVC.nSuffix.cloneNode();
		//
		JVC.__nodeData(dom.root,'dom',dom);
		if(level)tabs.append("\t".repeat(level));
		if(typeof key!=='undefined'){
			if(level)dom.property.append(JVC.nQuote.cloneNode(true));
			dom.property.append(JSON.stringify(key).slice(1,-1));
			if(level){dom.property.append(JVC.nQuote.cloneNode(true));dom.colon.append(':',JVC.nSpace.cloneNode(true))}
			else dom.colon.append(JVC.nSpace.cloneNode(true),'=',JVC.nSpace.cloneNode(true));
			if(key==='jvc-fail')dom.value.classList.add('jvc-fail')}
		//
		prefix.append(tabs,dom.property,dom.colon,dom.value,dom.braceStart,comma,dom.pholder);
		suffix.append(tabs.cloneNode(true),dom.braceEnd,comma.cloneNode(true));
		dom.root.append(prefix,dom.list,suffix);
		return domSet(dom,val,level,options)}
	//
	function domReplaceWith(d,r,k){k=k;d[k].replaceWith(r[k]);d[k]=r[k];return d}
	function domSetValue(dom,val,type){dom.value.classList.add('hljs-'+type);dom.value.append(val);return dom}
	function domSetLink(dom,val,type){var link=JVC.nLink.cloneNode(true);link.setAttribute('href',val);link.innerText=val;
		dom.value.classList.add('hljs-'+type);dom.value.append('"',link,'"');return dom}
	function domSetBraces(dom,start,end=false){dom.braceStart.append(start);if(end!==false)dom.braceEnd.append(end);return dom}
	function domSetPlaceholder(dom,val,options){dom.pholder.setAttribute('data-pholder',' '+val+' ');return dom}
	//
	function domSetArr(dom,val,level,options){
		var count=val.length;
		var collapsed=(options.collapsed&&(typeof options.collapsed!=='number'||options.collapsed<=level));
		if(!count){domSetBraces(dom,'[]');return dom}
		dom.root.classList.add('jvc-toggle');
		if(collapsed)dom.root.classList.add('jvc-collapsed');
		domSetBraces(dom,'[',']');
		domSetPlaceholder(dom,count+(count>1?' items':' item'),options);
		dom._list=[];for(var i=0;i<count;++i)
			dom._list.push(obj2dom(undefined,val[i],level+1,options).root);
		if(!collapsed)dom.list.append.apply(dom.list,dom._list);
		return dom}
	function domSetObj(dom,val,level,options){
		var count=Object.keys(val).length;
		var collapsed=(options.collapsed&&(typeof options.collapsed!=='number'||options.collapsed<=level));
		if(!count){domSetBraces(dom,'{}');return dom}
		dom.root.classList.add('jvc-toggle');
		if(collapsed)dom.root.classList.add('jvc-collapsed');
		domSetBraces(dom,'{','}');
		if(('jvc-cb'in val)){
			dom.root.classList.add('jvc-collapsed', 'jvc-callback');dom.jvcCb=val['jvc-cb'];
			return domSetPlaceholder(dom,'jvc-cb: '+JSON.stringify(val['jvc-cb']),options)}
		domSetPlaceholder(dom,count+(count>1?' items':' item'),options);
		dom._list=[];for(var key in val){if(Object.prototype.hasOwnProperty.call(val,key))
			dom._list.push(obj2dom(key,val[key],level+1,options).root)}
		if(!collapsed)dom.list.append.apply(dom.list,dom._list);
		return dom}
	//
	function domSet(dom,val,level,options){
		if(typeof val==='string'){var _val=JSON.stringify(val);
			if(options.withLinks&&JVC.__isUrl(val))
				return domSetLink(dom,_val.slice(1,-1),'string');
			return domSetValue(dom,_val,'string')}
		if(val===null||typeof val==='boolean')
			return domSetValue(dom,val+'','keyword');
		if(typeof val==='number'||typeof val==='bigint')
			return domSetValue(dom,val,'number');
		if(val instanceof Array)
			return domSetArr(dom,val,level,options);
		if(typeof val==='object'&&options.bigNumbers&&(typeof val.toExponential==='function'||val.isLosslessNumber))
			return domSetValue(dom,val.toString(),'number');
		if(typeof val==='object')
			return domSetObj(dom,val,level,options);
		//
		return domSetValue(dom,val+'','string');
	}
	//
	function objCallback(dom,val,level,options){
		options.debug('JVC:callback',val);
		val=JVC.__objFix(val);
		var _dom=obj2dom(undefined,val,level,options);
		dom._list=_dom._list;
		domReplaceWith(dom,_dom,'value');
		domReplaceWith(dom,_dom,'braceStart');
		domReplaceWith(dom,_dom,'braceEnd');
		domReplaceWith(dom,_dom,'list');
		dom.root.classList.remove('jvc-loading');
		if(domIsToggle(_dom))return domExpand(dom,options);
		else dom.root.classList.add('jvc-no-obj');
		return domCollapse(dom,options)
	}
	//
	function domExpand(dom,options){
		if(dom._list!==null)dom.list.append.apply(dom.list,dom._list);
		dom.root.classList.remove('jvc-collapsed');return docChange(dom,options)}
	function domCollapse(dom,options){
		if(!typeof dom.jvcCb==='undefined'){
			if(!dom.braceEnd.childNodes.length)dom.root.classList.add('jvc-no-obj');
			else dom.root.classList.remove('jvc-no-obj')}
		dom.root.classList.add('jvc-collapsed');dom.list.innerHTML='';return docChange(dom,options)}
	function domIsCollapsed(dom){return dom.root.classList.contains('jvc-collapsed')}
	function domIsToggle(dom){return dom.root.classList.contains('jvc-toggle')}
	function domToggle(dom,options){if(domIsCollapsed(dom))return domExpand(dom,options);return domCollapse(dom,options)}
	//
	function docChange(dom,options){
		var doc=dom.root.closest('.jvc');
		var isTrig=JVC.__isEventExists(doc,'JVC:change');
		if(!options.showJSON&&!isTrig)return dom;
		if(options.showJSON){
			var log=doc.querySelector('.jvc-logs.jvc-json');log.innerHTML='';
			log.append("// JSON:\n"+JVC.getJSON(doc))}
		if(isTrig)$(doc).trigger('JVC:change',[doc]);
		return dom}
	//
	$.fn.JVC=function(obj,conf){
		JVC.setStyle();JVC.__tabObserver();
		//
		var options=Object.assign({},JVC.defOptions,conf);
		options.debug('JVC',{'obj':obj,'options':options});
		obj=JVC.__objFix(obj);
		return this.each(function(){var doc=this;
			doc.innerHTML='';doc.classList.add('jvc', 'hljs');
			if(options.invertColors)doc.classList.add('jvc-invert');
			if(!options.withQuotes)doc.classList.add('jvc-no-quotes');
			if(options.showConf){var logs=JVC.nLogs.cloneNode();logs.classList.add('jvc-conf');
				logs.append('// Conf: '+JSON.stringify(JVC.__objDiff(JVC.defOptions,conf)));doc.prepend(logs)}
			var dom=obj2dom(options.key,obj,0,options);
			var root=JVC.nRoot.cloneNode();root.append(dom.root);
			doc.append(root);
			if(options.showJSON){var logs=JVC.nLogs.cloneNode();logs.classList.add('jvc-json');doc.append(logs)}
			JVC.__nodeData(doc,'conf',options);
			JVC.__nodeData(doc,'dom',dom);
			docChange(dom,options);
			
			new CopyButtonPlugin({}, JSON.stringify(obj, null, 2));

			$(doc).off('click').on('click','.jvc-toggle>:not(.jvc-list)',function(){
				var dom=JVC.__nodeData(this.closest('.jvc-toggle'),'dom');
				console.log(this.closest('.jvc-toggle'),dom)
				if(typeof dom.jvcCb==='undefined')return domToggle(dom,options);
				if(!domIsCollapsed(dom))return domCollapse(dom,options);
				//
				var level=dom.level;
				if(!JVC.__isEventExists(doc,'JVC:callback')){
					options.error('JVC','Not set "JVC:callback" trigger');
					dom.list.append(obj2dom("jvc-fail",'Not set "JVC:callback" trigger',level,options).root);
					return docChange(dom,options)}
				//
				dom.root.classList.add('jvc-loading');
				$(doc).trigger('JVC:callback',[dom.root,dom.jvcCb,function(val){objCallback(dom,val,level,options)}]);
				return false;
			})
		})
	}
//
})(jQuery);