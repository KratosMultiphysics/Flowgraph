// Overrides the default drawLinkTooltip function
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
		text = "[" + data.constructor.name + "]";

	if(text == null)
		return;

	// Get only the first 10 lines
	text_split = text.split("\n");
	if (text_split.length > 10) {
		text_split = text_split.slice(0,10);
		text_split.push('...');
	}

	let line_pad = 0;
	let max_w = 0;

	ctx.font = "14px Courier New";

	for(const line of text_split) {
		max_w = Math.max(max_w, ctx.measureText(line).width);
	}

	var w = max_w + 20;
	var h = 20 * text_split.length + 10;
	ctx.shadowColor = "black";
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.shadowBlur = 3;
	ctx.fillStyle = "#454";
	ctx.beginPath();
	ctx.roundRect( pos[0] - w*0.5, pos[1] - 15 - h, w, h, 3, 3);
	ctx.moveTo( pos[0] - 10, pos[1] - 15 );
	ctx.lineTo( pos[0] + 10, pos[1] - 15 );
	ctx.lineTo( pos[0], pos[1] - 5 );
	ctx.fill();
	ctx.shadowColor = "transparent";
	// ctx.textAlign = "center";
	ctx.fillStyle = "#CEC";

	if(text) {
		line_pad += 20;
		for(const line of text_split) {
			let x = pos[0] - w*0.5 + 10;
			if(!line.localeCompare('...')) {
				x = pos[0];
				ctx.textAlign = "center";
			}
			ctx.fillText(line, x, pos[1] - 15 - h + line_pad);
			line_pad += 20;
		}
	}
}