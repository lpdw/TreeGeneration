
/********************** global functions *******/
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}
function trueY(y){
  return document.getElementById("tree").height - y;
}

function drawPoly(ctx, start, sides, angle, size){
  var center = {x: start.x + (size/2 * Math.cos(angle)), y: start.y + (size/2 * Math.sin(angle)) };
  var a = (Math.PI * 2) / sides;
  ctx.moveTo(center.x + (size * Math.cos(angle + Math.PI * 2)), trueY(center.y + ( size * Math.sin(angle + Math.PI * 2))));

  for (var i = 1; i <= sides; i++) {
    ctx.lineTo( center.x + ( size * Math.cos(angle + a*i)), trueY(center.y + ( size * Math.sin(angle + a*i))));
  }
}
function drawArrow(ctx, start, end, headlen){
  var angle = Math.atan2(start.y-end.y,start.x-end.x);
  ctx.moveTo(end.x-headlen*Math.cos(angle-Math.PI/7),trueY(end.y-headlen*Math.sin(angle-Math.PI/7)));
  ctx.lineTo(end.x, trueY(end.y));
  ctx.lineTo(end.x-headlen*Math.cos(angle+Math.PI/7),trueY(end.y-headlen*Math.sin(angle+Math.PI/7)));
}

var cyan = 'hsl(187, 47%, 55%)',
blue = 'hsl(207, 82%, 66%)',
purple = 'hsl(286, 90%, 47%)',
green = 'hsl(95, 68%, 62%)',
red1 = 'hsl(355, 75%, 55%)',
red2 = 'hsl(5, 48%, 51%)',
orange1 = 'hsl(29, 84%, 61%)',
orange2 = 'hsl(39, 67%, 69%)',
black = 'hsl(220,13%,18%)';
/* Parametres :
Feuilles : origin,
        : couleur
        :taille
        : rotation
        : rotationFeuille
Branche:
      :origin
      :épaisseur
      :couleur
      :
/******************************************** Extend exemple ***************************************/
/* TODO: Objets de base Leaf et Branche */
var leaf = function (settings, core){
  return oCanvas.extend({
    core: core,
    animationStade:100,
    isInit: false,
    join: "square",
    originPoint:undefined,
    shape: "square",
    shapeFill: false,
    size:1,
    angle:90,
    init: function(){
    },
    draw: function(){
      var canvas = this.core.canvas,
        origin = this.getOrigin(),
        size = this.size,
        angle = Math.radians(this.angle);


        if (this.parent.points != undefined && settings.startPoint && !this.isInit){

          this.originPoint = this.parent.points[Math.round((settings.startPoint) / 100 * (this.parent.points.length - 1 ) )];
          this.isInit = true;
        }
        canvas.beginPath();
        canvas.lineWidth = this.strokeWidth;
        canvas.strokeStyle = this.strokeColor;
        canvas.fillStyle = this.strokeColor;
        canvas.lineJoin = this.join;
        canvas.lineCap = this.cap;

        canvas.moveTo(this.originPoint.x, trueY(this.originPoint.y));
        var end_line = {x: this.originPoint.x + (size * 2 * Math.cos(angle)), y: this.originPoint.y + (size * 2 * Math.sin(angle)) };
        canvas.lineTo(end_line.x, trueY(end_line.y));
        canvas.stroke();
        canvas.closePath();
        canvas.beginPath();

        if(this.shape === "square"){
            //
            var center = {x: end_line.x + (size/2 * Math.cos(angle)), y: end_line.y + (size/2 * Math.sin(angle)) };
            //canvas.rect(center.x- (size), trueY(center.y)- (size), size*2, size*2);


            drawPoly(canvas,center,4,angle,size);
            canvas.stroke();

            if(this.shapeFill) {
              canvas.stroke();
              canvas.closePath();
              canvas.beginPath();
              canvas.lineWidth = 0;
              center.x += size/3.5 * Math.cos(angle);
              center.y += size/3.5 * Math.sin(angle);
              drawPoly(canvas,center,4,angle,size/2);
              canvas.fill();

            }
            //canvas.setTransform(1, 0, 0, 1, 0, 0);
        }
        else if(this.shape === "circle") {
          // size = size/2;
          var center = {x: end_line.x + (size * Math.cos(angle)), y: end_line.y + (size * Math.sin(angle)) };
          canvas.arc(center.x, trueY(center.y), size, 0, Math.PI * 2, false);
          if(this.shapeFill){
            canvas.stroke();
            canvas.closePath();
            canvas.beginPath();

            canvas.lineWidth = 0;

            canvas.arc(center.x, trueY(center.y), size/4, 0, Math.PI * 2, false);
            canvas.fill();
          }

        }else if(this.shape === "triangle"){

          drawPoly(canvas,end_line,3,angle,size);

          canvas.stroke();

          if(this.shapeFill) {
            canvas.closePath();
            canvas.beginPath();
            canvas.lineWidth = 0;
            end_line.x += size/2.5 * Math.cos(angle);
            end_line.y += size/2.5 * Math.sin(angle);
            drawPoly(canvas,end_line,3,angle,size/5);
            canvas.fill();


          }
        }
        canvas.stroke();
        canvas.closePath();

    }
  },settings);
};
oCanvas.registerDisplayObject("leaf", leaf, "init");

// format d'un nouveau point pour la branche {size, angle}
var branche = function (settings, core){
  return oCanvas.extend({
    core: core,
    animationStade:100,
    points:[],
    isInit: false,
    join: "square",
    originPoint:undefined,
    init: function(){
    },
    draw: function(){
      var canvas = this.core.canvas;
        canvas.beginPath();
        canvas.lineWidth = this.strokeWidth;
        canvas.strokeStyle = this.strokeColor;
        canvas.lineJoin = this.join;
        canvas.lineCap = this.cap;

        if (this.parent.points != undefined && settings.startPoint && !this.isInit){
          this.originPoint = this.parent.points[Math.round((settings.startPoint) / 100 * (this.parent.points.length - 1 ) )];
          var origin = this.originPoint;
          this.points = settings.points.map(function(point){
            return {x: (origin.x + point.x), y: (origin.y + point.y)};
          });

          this.isInit = true;
        }

        if(this.points == null )
          return;
        points = this.points;
        var progress = this.animationStade / 100;
        var lastpoint = points[points.length - 1];
        for(var i = 0; i < points.length; i++){
          if(i == points.length - 1 && progress != 1){
            // Anime la dernière partie du chemin, selon le paramètre animationStade
            lastpoint = {x: points[i - 1].x + ((points[i].x - points[i - 1].x) * progress) ,
                        y: points[i - 1].y + ((points[i].y - points[i - 1].y) * progress)}
            canvas.lineTo(lastpoint.x,trueY(lastpoint.y));
            continue;
          }
          if(i%5 == 0 && i!=0){
            canvas.stroke();
            canvas.closePath();
            canvas.beginPath();
            canvas.lineWidth = canvas.lineWidth * 0.7;
            canvas.moveTo(points[i-1].x, trueY(points[i-1].y))
          }
          canvas.lineTo(points[i].x, trueY(points[i].y));
        }
        canvas.stroke();
        canvas.closePath();
        if(progress != 1){

          canvas.lineWidth = this.strokeWidth * (1 - progress);
          canvas.strokeStyle = 'rgba(200,180,200,'+ 1 - progress +')';
          //canvas.moveTo(lastpoint.x, trueY(lastpoint.y));
          var invProgress = 1 - progress;
          //progress = progress == 0 ? 0.0001 : progress;
          var max = Math.floor(280 * invProgress);
          var first_point;
          var start = max > 40 ? max - 40 : 0;
          canvas.beginPath();
          for (i = start; i<= max; i++) {
            var angle =  0.1 * Math.pow(i,(1 - progress));
            //var angle =  Math.pow(i,i / 100);

             x=lastpoint.x + (1*i+angle + ( invProgress * 5))*Math.cos(angle);
             y=lastpoint.y + (1*i+angle + ( invProgress * 5))*Math.sin(angle);
            if(i == start ){
                //canvas.moveTo(x, trueY(y));
                first_point = {x:x,y:y};
                continue;
            }
            else if(i == start+1){

              drawArrow(canvas,first_point,{x:x,y:y},30*invProgress);
              canvas.stroke();
              canvas.closePath();
              canvas.beginPath();
              canvas.moveTo(x, trueY(y));
              continue;
              // canvas.lineTo(first_point.x,trueY(first_point.y));
              // canvas.lineTo(x,trueY(y));
            }
            canvas.lineTo(x,trueY(y));
           }

           canvas.stroke();
           canvas.closePath();
        }
        //Pris de OCanvas directement
        if(this.clipChildren) {
          canvas.clip();
        }

        return this;
    },
    addPoint(point, animate = true){
      // check if the origin point was previously use and use it to compute the absolute path
      if (this.points != undefined){
        point.x += this.points[this.points.length - 1].x;
        point.y += this.points[this.points.length - 1].y;
      }
      // this.points.push(ellipse);
      //push the new point to array
      this.points.push(point);
      // set animation stade to zéro
      if(!animate)
        return;
      this.animationStade = 0,
      this.animate({
    		animationStade: 100
    	   }, {
    		easing: "ease-in-quad",
        duration: 10000
    	});
    }
  },settings);
};

oCanvas.registerDisplayObject("branche", branche, "init");
