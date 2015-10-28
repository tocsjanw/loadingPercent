;(function(window,document,undefined){
	function LoadingPercent(o){
		var _ = this;
		_.option_custom = o;
		_.option_default = {
			canvas_width_height:60,
			circle_bar_width:5,
			canvas_color:"#e74c3c",
			canvas_font:"bold 8pt Arial",
			canvas_font_text:"loading",
			canvas_inner_circle_color:"#fff",
			canvas_wrap_circle_color:"#ddd",
			canvas_id:"loadingProgress",
			loadingPercent_id:"loadingPercent",
			loadingPercent_bg:"#ccc",
			bar_speed:60
		};
		
		_.interval = null;
		_.deepcopy = function(p,c){
			var c = c || {};
	　　　　for (var i in p) {
	　　　　　　if (typeof p[i] === 'object') {
	　　　　　　　　c[i] = (p[i].constructor === Array) ? [] : {};
	　　　　　　　　deepCopy(p[i], c[i]);
	　　　　　　} else {
	　　　　　　　　　c[i] = p[i];
	　　　　　　}
	　　　　}
	　　　　return c;
		};
		_.option = _.deepcopy( _.option_custom, _.option_default );

		if (!_.option)
			return false;

		this.createElements(_.option.loadingPercent_id,_.option.canvas_id);
		this.setStyle(_.option.loadingPercent_id,_.option.loadingPercent_bg);
		this.drawCanvas(_.option.canvas_id);
		this.completed(_.option.loadingPercent_id);
		
		
	}
	LoadingPercent.prototype.drawCanvas = function(canvas_id, beginArc, endArc){
		var beginArc = beginArc || 10,
			endArc = endArc|| 30;
		var _ = this;

		var drawing = function(){
			var canvas = document.getElementById(canvas_id),
				context = canvas.getContext('2d');

			var canvas_width_height = _.option.canvas_width_height,
				circle_diameter = canvas_width_height/2,
				circle_bar_width = circle_diameter - _.option.circle_bar_width,
				canvas_color = _.option.canvas_color,
				canvas_font = _.option.canvas_font,
				canvas_inner_circle_color = _.option.canvas_inner_circle_color,
				canvas_wrap_circle_color = _.option.canvas_wrap_circle_color,
				canvas_font_text = _.option.canvas_font_text;

			canvas.width = canvas.height = canvas_width_height;


			context.clearRect(0, 0, canvas_width_height, canvas_width_height); 
			context.beginPath();  
                // 坐标移动到圆心  
            context.moveTo(circle_diameter, circle_diameter);  
                // 画圆,圆心是24,24,半径24,从角度0开始,画到2PI结束,最后一个参数是方向顺时针还是逆时针  
            context.arc(circle_diameter, circle_diameter, circle_diameter, 0, Math.PI * 2, false);  
            context.closePath();  
                // 填充颜色  
            context.fillStyle = canvas_wrap_circle_color;  
            context.fill();  
                // ***灰色的圆画完  
                
            // 画进度  
            context.beginPath();  
                // 画扇形的时候这步很重要,画笔不在圆心画出来的不是扇形  
            context.moveTo(circle_diameter, circle_diameter);  
                // 跟上面的圆唯一的区别在这里,不画满圆,画个扇形  
            context.arc(circle_diameter, circle_diameter, circle_diameter, Math.PI * 2 * beginArc / 100, Math.PI * 2 * endArc / 100, false);
            
            context.closePath();  
            context.fillStyle = canvas_color;  
            context.fill(); 
      
            // 画内部空白  
            context.beginPath();  
            context.moveTo(circle_diameter, circle_diameter);  
            context.arc(circle_diameter, circle_diameter, circle_bar_width, 0, Math.PI * 2, true);  
            context.closePath();  
            context.fillStyle = canvas_inner_circle_color;  
            context.fill();  
              
        	
                //在中间写字  
            context.font = canvas_font;  
            context.fillStyle = canvas_color;  
            context.textAlign = 'center';  
            context.textBaseline = 'middle';  
            context.moveTo(circle_diameter, circle_diameter);  
            context.fillText(canvas_font_text, circle_diameter, circle_diameter);

            if(endArc==100){
           		beginArc = 0;
           		endArc = 20;
            }else{
           		beginArc += 10;
           		endArc += 10;
            }
		};
		_.interval = setInterval(function(){
			drawing();
		},_.option.bar_speed);

	};
	LoadingPercent.prototype.createElements = function(idName,canvas_id){
		var div = document.createElement("div");
		div.id = idName;
		div.innerHTML = '<canvas id="'+canvas_id+'" style="margin-top:120px">Loading...</canvas>';
		document.body.appendChild(div);
	};
	LoadingPercent.prototype.setStyle = function(idName,color){
		var body = document.body;
		body.style.margin = "0em";
		body.style.padding = "0em";

		var setElementsSize = function (element){
			element.style.height = document.documentElement.clientHeight+"px";
			element.style.width = document.documentElement.clientWidth+"px";
		};

		var loadingPercent = document.getElementById(idName);
		
		loadingPercent.style.background = color;
		loadingPercent.style.textAlign = "center";
		loadingPercent.style.zIndex = "9999";
		loadingPercent.style.position = "absolute";

		setElementsSize(loadingPercent);
		window.onresize = function(){
			setElementsSize(loadingPercent);
		};

	};
	LoadingPercent.prototype.completed = function(idName){
		var interval = this.interval;
		window.onload = function(){
			clearInterval(interval);
			document.getElementById(idName).style.display = "none";
			var body = document.body;
			if (body.style.margin == "0em"&&body.style.padding == "0em") {
				body.style.margin = body.style.padding = "";
			}
		};
		
	};
	
	
	
	
})(window,document);

new LoadingPercent({
	canvas_color:"#ff0000",
	loadingPercent_bg:"#ccc",
	bar_speed:40
});