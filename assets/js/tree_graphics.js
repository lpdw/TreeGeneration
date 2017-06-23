/********************** global functions *******/
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
Math.rand = function(min,max){
  return Math.random() * (max - min) + min;
}
Math.arrayRand = function(max){
  return Math.floor(Math.random() * max);
}
// var Zoom =
oCanvas.Zoom = {
  zoomed:false,
  offset:0,
  Init: function(canvas, level){
    this.canvas = canvas;
    this.setLevel(level);
  },
  setLevel: function(newLevel){
    this.x = newLevel * this.canvas.width / this.canvas.height;
    this.y = newLevel;
    this.level = newLevel;
    this.zoomed = true;
  },
  setOffset: function(x){
    this.offset = this.x/2 - x;
  },
  convert: function(value){
    return (value / this.level) * this.canvas.height;
  }

};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// var ZoomX = 500;
// var ZoomY = ZoomX * (document.getElementById("tree").width / document.getElementById("tree").height);
// oCanvas.domReady(function () {
//   var ZoomY = 500;
//   var ZoomX = ZoomX / (document.getElementById("tree").width / document.getElementById("tree").height);
// }
function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}
function drawPoly(ctx, start, sides, angle, size, rotation = 0){
  size /= 2;
  var center = new Point(start.x + (size * Math.cos(angle)), start.y + (size * Math.sin(angle)) );
  // size /= 2;
  var a = (Math.PI * 2) / sides;
  angle += rotation;
  ctx.moveTo(center.drawX(size * Math.cos(angle + Math.PI * 2)), center.drawY(size * Math.sin(angle + Math.PI * 2)));

  for (var i = 1; i <= sides; i++) {
    ctx.lineTo( center.drawX(size * Math.cos(angle + a*i)),center.drawY( size * Math.sin(angle + a*i)));
  }
}
function drawArrow(ctx, start, end, headlen){
  headlen /= 2;
  var angle = Math.atan2(start.y-end.y,start.x-end.x);
  ctx.moveTo(end.drawX(-(headlen*Math.cos(angle-Math.PI/7))),end.drawY(-(headlen*Math.sin(angle-Math.PI/7))));
  ctx.lineTo(end.drawX(), end.drawY());
  ctx.lineTo(end.drawX(-(headlen*Math.cos(angle+Math.PI/7))),end.drawY(-(headlen*Math.sin(angle+Math.PI/7))));
}
// Objet point à utiliser, méthodes drawX et drawY déssinent en pour 1000 sur canvas
function Point(x = 0, y = 0){
  this.x = x;
  this.y = y;
}
Point.prototype.drawX = function(xoffset = 0){
  return ((this.x + xoffset) / oCanvas.Zoom.x) * document.getElementById("tree").width;
}
Point.prototype.drawY = function(yoffset = 0){
  return document.getElementById("tree").height - (( (this.y + yoffset) / oCanvas.Zoom.y) * document.getElementById("tree").height );
  // return ((this.y + yoffset) / Zoom) * document.getElementById("tree").height ;
}
Point.prototype.set = function(point){
  this.x = point.x;
  this.y = point.y;
}

var cyan = 'hsl(187, 47%, 55%)',
blue = 'hsl(207, 82%, 66%)',
purple = 'hsl(286, 90%, 47%)',
green = 'hsl(95, 68%, 62%)',
red1 = 'hsl(355, 75%, 55%)',
red2 = 'hsl(5, 48%, 51%)',
orange1 = 'hsl(29, 84%, 61%)',
orange2 = 'hsl(39, 90%, 69%)',
white = 'hsl(255, 85%, 98%)',
black = 'hsl(220,13%,18%)';
var colors = [cyan, blue, purple, green, red1, red2, orange1, orange2, white];
var shapes = ["triangle", "square", "circle"];
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
    leafRotation:0,
    init: function(){
    },
    draw: function(){
      var canvas = this.core.canvas,
        origin = this.getOrigin(),
        size = this.size,
        angle = Math.radians(this.angle),
        leafRotation = Math.radians(this.leafRotation)
        strokeWidth = this.strokeWidth ;


        if (this.parent.points != undefined && settings.startPoint && !this.isInit){
          this.originPoint = this.parent.points[Math.round((settings.startPoint) / 100 * (this.parent.points.length - 1 ) )];
          this.isInit = true;
        }
        canvas.beginPath();
        canvas.lineWidth = strokeWidth;
        canvas.strokeStyle = this.strokeColor;
        canvas.fillStyle = this.strokeColor;
        canvas.lineJoin = this.join;
        canvas.lineCap = this.cap;
        var origin = new Point(this.originPoint.x,this.originPoint.y );
        canvas.moveTo(origin.drawX(), origin.drawY());
        var end_line = new Point(this.originPoint.x + (size *Math.cos(angle))
                                  ,this.originPoint.y + (size * Math.sin(angle))) ;
        canvas.lineTo(end_line.drawX(), end_line.drawY());
        canvas.stroke();
        canvas.closePath();
        canvas.beginPath();

        if(this.shape === "square"){
            //
            // var center = new Point(end_line.x + (size/10 * Math.cos(angle)),end_line.y + (size/10 * Math.sin(angle)) );


            drawPoly(canvas,end_line,4,angle,size, leafRotation);
            canvas.stroke();

            if(this.shapeFill) {
              canvas.stroke();
              canvas.closePath();
              canvas.beginPath();
              canvas.lineWidth = 0;
              end_line.x += size/3.5 * Math.cos(angle);
              end_line.y += size/3.5 * Math.sin(angle);
              drawPoly(canvas,end_line,4,angle,size/2, leafRotation);
              canvas.fill();

            }
            //canvas.setTransform(1, 0, 0, 1, 0, 0);
        }
        else if(this.shape === "circle") {
          // size = size/2;

          var center = new Point(end_line.x + (size * Math.cos(angle)), end_line.y + (size * Math.sin(angle)) );
          canvas.arc(center.drawX(), center.drawY(), oCanvas.Zoom.convert(size), 0, Math.PI * 2, false);
          if(this.shapeFill){
            canvas.stroke();
            canvas.closePath();
            canvas.beginPath();

            canvas.lineWidth = 0;

            canvas.arc(center.drawX(), center.drawY(), oCanvas.Zoom.convert(size / 4), 0, Math.PI * 2, false);
            canvas.fill();
          }

        }else if(this.shape === "triangle"){

          drawPoly(canvas,end_line,3,angle,size, leafRotation);

          canvas.stroke();

          if(this.shapeFill) {
            canvas.closePath();
            canvas.beginPath();
            canvas.lineWidth = 0;
            end_line.x += size/2.5 * Math.cos(angle);
            end_line.y += size/2.5 * Math.sin(angle);
            drawPoly(canvas,end_line,3,angle,size/5, leafRotation);
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
    trunk: false,
    init: function(){
      if(settings.points != undefined){
        for(var i = 1;i<settings.points.length;i++){
          settings.points[i].x = settings.points[i-1].x + settings.points[i].x;
          settings.points[i].y = settings.points[i-1].y + settings.points[i].y;
        }
      }
      this.strokeWidth = settings.strokeWidth / (oCanvas.Zoom.level/100);
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
        if(oCanvas.Zoom.zoomed){
          if(this.trunk){
            oCanvas.Zoom.setOffset(this.points[0].x);
          }
          var offset = oCanvas.Zoom.offset;
          for(var i = 0;i<this.points.length;i++){
            this.points[i].x = this.points[i].x + offset;
          }
        }

        if(this.points == null )
          return;
        points = this.points;

        var progress = this.animationStade / 100;
        var lastPoint = new Point(points[points.length - 1].x,points[points.length - 1].y) ;
        var currentPoint = new Point();
        var prevPoint = new Point();
        for(var i = 0; i < points.length; i++){
          if(i == points.length - 1 && progress != 1){
            // Anime la dernière partie du chemin, selon le paramètre progress
            lastPoint.x =  points[i - 1].x + ((points[i].x - points[i - 1].x) * progress);
            lastPoint.y =  points[i - 1].y + ((points[i].y - points[i - 1].y) * progress);
            canvas.lineTo(lastPoint.drawX(),lastPoint.drawY());
            continue;
          }
          currentPoint.set(points[i]);
          if(i%50 == 0 && i!=0){
            canvas.stroke();
            canvas.closePath();
            canvas.beginPath();
            canvas.lineWidth = canvas.lineWidth * 0.9;
            prevPoint.set(points[i-1]);
            canvas.moveTo(prevPoint.drawX(),prevPoint.drawY());
          }
          canvas.lineTo(currentPoint.drawX(), currentPoint.drawY());
        }
        canvas.stroke();
        canvas.closePath();
        if(progress != 1){
          var invProgress = 1 - progress;
          canvas.beginPath();
          var size = (Math.sin(invProgress*20) + 1) * (40*invProgress + 10);
          var grd = canvas.createRadialGradient(
                              lastPoint.drawX(),
                              lastPoint.drawY(),
                              oCanvas.Zoom.convert(size/10),
                              lastPoint.drawX(),
                              lastPoint.drawY(),
                              oCanvas.Zoom.convert(size));
          grd.addColorStop(0,"transparent");
          grd.addColorStop(1,"white");
          canvas.fillStyle = grd;
          canvas.arc(lastPoint.drawX(), lastPoint.drawY(), oCanvas.Zoom.convert(size), 0, Math.PI * 2, false);
          canvas.fill();
          canvas.closePath();
          canvas.beginPath();
          canvas.lineWidth = this.lineWidth * (1 - progress);
          canvas.strokeStyle = 'rgba(200,180,200,'+ 1 - progress +')';
          //progress = progress == 0 ? 0.0001 : progress;
          var max = Math.floor(150 * invProgress);
          var firstPoint = new Point();
          var start = max > 20 ? max - 20 : 0;

          for (i = start; i<= max; i++) {
            var angle =  0.1 * Math.pow(i,(1 - progress));
            //var angle =  Math.pow(i,i / 100);

             currentPoint.x=lastPoint.x + (.5*i+angle * invProgress)*Math.cos(angle);
             currentPoint.y=lastPoint.y + (.5*i+angle * invProgress)*Math.sin(angle);

            if(i === start ){
                firstPoint.set(currentPoint);
                continue;
            }
            else if(i == start+1){
              canvas.closePath();
              drawArrow(canvas,firstPoint,currentPoint,20*invProgress);
              canvas.stroke();
              canvas.beginPath();
              canvas.moveTo(currentPoint.drawX(), currentPoint.drawY());
            }
            canvas.lineTo(currentPoint.drawX(), currentPoint.drawY());
           }

           canvas.stroke();
           canvas.closePath();
        }
        //Pris de oCanvas directement
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
      if(!animate || this.animationStade != 100)
        return;
      this.animationStade = 0,
      this.animate({
    		animationStade: 100
    	   }, {
    		easing: "ease-out-quad",
        duration: 10000
    	});
    }
  },settings);
};

oCanvas.registerDisplayObject("branche", branche, "init");
