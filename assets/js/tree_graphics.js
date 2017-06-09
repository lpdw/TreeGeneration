
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
            //var center = {x: end_line.x + (size * Math.cos(angle)), y: end_line.y + (size * Math.sin(angle)) };
            //canvas.rect(center.x- (size), trueY(center.y)- (size), size*2, size*2);
            drawPoly(canvas,end_line,4,angle,size);
            canvas.stroke();

            if(this.shapeFill) {
              canvas.stroke();
              canvas.closePath();
              canvas.beginPath();
              canvas.lineWidth = 0;
              // canvas.fillRect(center.x-(size/2), trueY(center.y)-(size/2), size, size);
              drawPoly(canvas,end_line,4,angle,size);
              // canvas.fill();

            }
            //canvas.setTransform(1, 0, 0, 1, 0, 0);
        }
        else if(this.shape === "circle") {
          //var radius = size * 2;
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
          // var center = {x: end_line.x + (size/2 * Math.cos(angle)), y: end_line.y + (size/2 * Math.sin(angle)) };
          // console.log(angle);
          //
          // var a = (Math.PI * 2) / 3;
          // canvas.moveTo(center.x + (size * Math.cos(angle + Math.PI * 2)), trueY(center.y + ( size * Math.sin(angle + Math.PI * 2))));
          //
          // for (var i = 1; i <= 3; i++) {
          //   canvas.lineTo( center.x + ( size * Math.cos(angle + a*i)), trueY(center.y + ( size * Math.sin(angle + a*i))));
          // }
          drawPoly(canvas,end_line,3,angle,size);
          // sceneSatellites[i].x = (x * Math.cos(a) - y * Math.sin(a));
          // sceneSatellites[i].y = (y * Math.cos(a) + x * Math.sin(a));

          canvas.stroke();

          if(this.shapeFill) {
            canvas.stroke();
            canvas.closePath();
            canvas.beginPath();
            canvas.lineWidth = 0;
            canvas.fillRect(center.x-2.5, trueY(center.y)-2.5, 5, 5);
            // canvas.fill();


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
            //console.log(point);
            return {x: (origin.x + point.x), y: (origin.y + point.y)};
          });

          this.isInit = true;
        }

        if(this.points == null )
          return;
        points = this.points;
        var progress = this.animationStade / 100;
        for(var i = 0; i < points.length; i++){
          if(i == points.length - 1 && progress != 1){
            // Anime la dernière partie du chemin, selon le paramètre animationStade
            canvas.lineTo(points[i - 1].x + ((points[i].x - points[i - 1].x) * progress) ,trueY(points[i - 1].y + ((points[i].y - points[i - 1].y) * progress)));
            continue;
          }
          canvas.lineTo(points[i].x, trueY(points[i].y));
        }

        canvas.stroke();
        canvas.closePath();

        //Pris de OCanvas directement
        if(this.clipChildren) {
          canvas.clip();
        }

        return this;
    },
    addPoint(point){
      // if (this.originPoint != undefined){
      //   point.x += this.originPoint.x;
      //   point.y += this.originPoint.y;
      // }
      // this.points.push(ellipse);
      this.points.push(point);
      this.animationStade = 0,
      this.animate({
    		animationStade: 100
    	   }, {
    		easing: "ease-out-elastic",
        duration: 200
    	});
    }
  },settings);
};

oCanvas.registerDisplayObject("branche", branche, "init");
