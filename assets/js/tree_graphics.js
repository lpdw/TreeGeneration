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
  overflow:0,
  offset:0,
  margin:0,
  Init: function(canvas, level){
    this.canvas = canvas;
    this.margin = 10;
    this.setLevel(level);
  },
  setLevel: function(newLevel){
    this.x = newLevel * this.canvas.width / this.canvas.height;
    this.y = newLevel;
    this.level = newLevel;
    this.overflow = 0;
  },
  setOffset: function(x){
    this.offset = this.x/2 - x;
  },
  convert: function(value){
    return (value / this.level) * this.canvas.height;
  }

};


// var ZoomX = 500;
// var ZoomY = ZoomX * (document.getElementById("tree").width / document.getElementById("tree").height);
// oCanvas.domReady(function () {
//   var ZoomY = 500;
//   var ZoomX = ZoomX / (document.getElementById("tree").width / document.getElementById("tree").height);
// }
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
orange2 = 'hsl(31, 90%, 69%)',
white = 'hsl(255, 85%, 98%)',
black = 'hsl(220,13%,18%)',
gold = 'hsl(43, 100%, 57%)';
var colors = [cyan, blue, purple, green, red1, red2, orange1, orange2, white, gold];
var shapes = ["square", "circle"];
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
    animationStade:0,
    isInit: false,
    join: "round",
    leafOriginPoint:undefined,
    shape: "round",
    shapeFill: false,
    size:1,
    angle:90,
    leafRotation:0,
    type: "leaf",
    animationStade:0,
    init: function(){
        if(settings.animationStade!=100){
        this.animate({
              animationStade: 100
             }, {
              easing: "ease-out-quad",
          duration: 6000
          });
        }
    },
    draw: function(){
      var canvas = this.core.canvas,
        origin = this.getOrigin(),
        angle = Math.radians(this.angle),
        leafRotation = Math.radians(this.leafRotation)
        strokeWidth = this.strokeWidth / (oCanvas.Zoom.level/100),
        zoomOffset = oCanvas.Zoom.offset,
        progress = this.animationStade / 100,
        invProgress = 1 - progress,
        size = this.size * progress/ (oCanvas.Zoom.level/1000);

        if (this.parent.points != undefined && this.startPoint && !this.isInit){
          this.leafOriginPoint = this.parent.points[Math.round((settings.startPoint) / 100 * (this.parent.points.length - 1 ) )];
          //console.log("new leaf");
          this.isInit = true;
        }
        if(this.leafOriginPoint  === undefined)
          {
            return;
          }

        // console.log(this.parent);
        // console.log(this.originPoint);
        canvas.beginPath();
        canvas.lineWidth = strokeWidth;
        canvas.strokeStyle = this.strokeColor;
        canvas.fillStyle = this.strokeColor;
        canvas.lineJoin = this.join;
        canvas.lineCap = this.cap;
        var origin = new Point(this.leafOriginPoint.x + zoomOffset,this.leafOriginPoint.y);
        canvas.moveTo(origin.drawX(), origin.drawY());
        var end_line = new Point(origin.x + (size * Math.cos(angle))
                                  ,origin.y + (size * Math.sin(angle))) ;
        canvas.lineTo(end_line.drawX(), end_line.drawY());
        canvas.stroke();
        canvas.closePath();
        if(progress != 1){
          canvas.beginPath();
          var dist = size;
          if (this.shape === "square")
            dist /= 2;
          var center = new Point(end_line.x + (dist *Math.cos(angle))
                                    ,end_line.y + (dist * Math.sin(angle))) ;
          var ellipsesize = (Math.sin(progress*6 ) +1) * (5*invProgress + 10) + dist;
          var grd = canvas.createRadialGradient(
                              center.drawX(),
                              center.drawY(),
                              oCanvas.Zoom.convert(ellipsesize/3),
                              center.drawX(),
                              center.drawY(),
                              oCanvas.Zoom.convert(ellipsesize));
          grd.addColorStop(1,this.strokeColor === gold ? gold: "white");
          grd.addColorStop(0,"transparent");
          canvas.fillStyle = grd;
          canvas.arc(center.drawX(), center.drawY(), oCanvas.Zoom.convert(ellipsesize), 0, Math.PI * 2, false);
          canvas.fill();
          canvas.closePath();
          canvas.fillStyle = this.strokeColor;
        }



        canvas.beginPath();
        if(this.shape === "square"){
            drawPoly(canvas,end_line,4,angle,size, leafRotation);
            canvas.stroke();

            if(this.shapeFill) {
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
          size = size/1.2;

          var center = new Point(end_line.x + (size * Math.cos(angle)), end_line.y + (size * Math.sin(angle)) );
          canvas.arc(center.drawX(), center.drawY(), oCanvas.Zoom.convert(size), 0, Math.PI * 2, false);
            canvas.stroke();
          if(this.shapeFill){
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
    join: "round",
    cap: "round",
    originPoint:undefined,
    trunk: false,
    branches: [],
    leaves: [],
    nbLeafs:0,
    pointsAdded:0,
    type:"branche",
    init: function(){
      if(settings.points != undefined && settings.points.length > 1){
        for(var i = 1;i<settings.points.length;i++){
          settings.points[i].x = settings.points[i-1].x + settings.points[i].x;
          settings.points[i].y = settings.points[i-1].y + settings.points[i].y;
        }
      }
    },
    draw: function(){
      var canvas = this.core.canvas;
      if (this.parent.points != undefined && settings.startPoint && !this.isInit){
          this.originPoint = this.parent.points[Math.round((settings.startPoint / 100) * this.parent.points.length - 1)];
          var origin = this.originPoint;
          // console.log(settings.points);
          if(origin == undefined || settings.points == undefined){
            console.log("this:",this);
            console.log("SP:",settings.startPoint);
            (function () { console.log(new Error().stack); })();
          }
          this.points = settings.points.map(function(point){
            return {x: (origin.x + point.x), y: (origin.y + point.y)};
          });
          this.isInit = true;
        }
        if(this.points == null )
          return;
        points = this.points;

        if(this.trunk){
          if(oCanvas.Zoom.overflow > 0){
            oCanvas.Zoom.setLevel(oCanvas.Zoom.level *( 1 + oCanvas.Zoom.overflow));
          }
          oCanvas.Zoom.setOffset(points[0].x);
        }
        var zoomOffset = oCanvas.Zoom.offset;

        canvas.beginPath();
        canvas.lineWidth = this.strokeWidth / (oCanvas.Zoom.level/100);
        canvas.strokeStyle = this.strokeColor;
        canvas.lineJoin = this.join;
        canvas.lineCap = this.cap;


        var progress = this.animationStade / 100;
        var invProgress = 1 - progress;
        var lastPoint = new Point(points[points.length - 1].x,points[points.length - 1].y);
        lastPoint.x += zoomOffset;
        var currentPoint = new Point();
        var prevPoint = new Point();
        // console.log(points);
        for(var i = 0; i < points.length; i++){
          if(progress != 1 && i == points.length - (1 + (Math.floor(invProgress * this.pointsAdded))) ){
            // Anime la dernière partie du chemin, selon le paramètre progress
            var point = points[i];
            // console.log(point);
            var prevPoint = points[i-1] === undefined ? points[i] : points[i-1];
            // console.log(prevPoint);
            lastPoint.x =  prevPoint.x + ((point.x - prevPoint.x) * ((progress % (1/this.pointsAdded)) * this.pointsAdded)) + zoomOffset;
            lastPoint.y =  prevPoint.y + ((point.y - prevPoint.y) * ((progress % (1/this.pointsAdded)) * this.pointsAdded));
            canvas.lineTo(lastPoint.drawX(),lastPoint.drawY());
            break;
          }
          currentPoint.set(points[i]);
          currentPoint.x += zoomOffset;
          if(i%50 == 0 && i!=0){
            canvas.stroke();
            canvas.closePath();
            canvas.beginPath();
            canvas.lineWidth *= 0.9;
            prevPoint.set(points[i-1]);
            prevPoint.x += zoomOffset;
            canvas.moveTo(prevPoint.drawX(),prevPoint.drawY());
          }
          canvas.lineTo(currentPoint.drawX(), currentPoint.drawY());

        }
        canvas.stroke();
        canvas.closePath();
        var animeCanvas = oCanvas.AnimContext;
        animeCanvas.clearRect(0,0,oCanvas.Zoom.canvas.width,oCanvas.Zoom.canvas.height);

        if(progress != 1){
          animeCanvas.beginPath();
          animeCanvas.lineWidth = canvas.lineWidth * oCanvas.Zoom.level / 500;
          animeCanvas.strokeStyle = canvas.strokeStyle;
          animeCanvas.lineJoin = canvas.lineJoin;
          animeCanvas.lineCap = canvas.lineCap;
          var size = (Math.sin(invProgress*20) + 2) * (20*invProgress + 10);
          console.log(animeCanvas);
          console.log(size);
          var grd = animeCanvas.createRadialGradient(
                              lastPoint.drawX(),
                              lastPoint.drawY(),
                              oCanvas.Zoom.convert(size/12),
                              lastPoint.drawX(),
                              lastPoint.drawY(),
                              oCanvas.Zoom.convert(size/4));
          grd.addColorStop(0,"transparent");
          grd.addColorStop(1,"white");
          animeCanvas.fillStyle = grd;
          animeCanvas.arc(lastPoint.drawX(), lastPoint.drawY(), oCanvas.Zoom.convert(size/4), 0, Math.PI * 2, false);
          animeCanvas.fill();
          animeCanvas.closePath();
          animeCanvas.beginPath();
          animeCanvas.lineWidth = (this.lineWidth * (1 - progress))/2;
          animeCanvas.strokeStyle = 'rgba(200,180,200,'+ 1 - progress +')';
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
              animeCanvas.closePath();
              drawArrow(animeCanvas,firstPoint,currentPoint,20*invProgress);
              animeCanvas.stroke();
              animeCanvas.beginPath();
              animeCanvas.moveTo(currentPoint.drawX(), currentPoint.drawY());
            }
            animeCanvas.lineTo(currentPoint.drawX(), currentPoint.drawY());
           }

           animeCanvas.stroke();
           animeCanvas.closePath();
        }

          var overflow = 0;
          var margin = oCanvas.Zoom.margin;
          // console.log(lastPoint.drawX(), LastPoint.drawX());
          if(lastPoint.drawX() > oCanvas.Zoom.canvas.width - margin){
            // console.log("Too on the right", lastPoint.drawX(), oCanvas.Zoom.canvas.width - margin);
            overflow = (lastPoint.drawX() - (oCanvas.Zoom.canvas.width - margin)) / (oCanvas.Zoom.canvas.width - margin);
          }
          else if(lastPoint.drawX() < margin){
            // console.log("Too on the left",lastPoint.drawX(), margin );
            overflow = (margin - lastPoint.drawX()) / (oCanvas.Zoom.canvas.width - margin);
          }
          else if(lastPoint.drawY() < margin){
            // console.log("Too High", lastPoint.drawY() )
            overflow = (margin - lastPoint.drawY())  / (oCanvas.Zoom.canvas.height - margin);
          }

          if( overflow > 0.01  && overflow > oCanvas.Zoom.overflow){
            oCanvas.Zoom.overflow = overflow ;
          }
        //Pris de oCanvas directement
        // if(this.clipChildren) {
        //   canvas.clip();
        // }

        return this;
    },
    addPoints(points, animate = true){
        points[0].x += this.points[this.points.length - 1].x;
        points[0].y += this.points[this.points.length - 1].y;
        for (var i = 1; i < points.length; i++){
          points[i].x += points[i-1].x;
          points[i].y += points[i-1].y ;
        }

        //push the new point to array
      this.pointsAdded = points.length;
      this.points.push.apply(this.points, points);
      // set animation stade to zéro
      if(!animate || this.animationStade != 100){
        this.animation
        return;
      }

      this.animationStade = 0,
      this.animate({
    		animationStade: 100
    	   }, {
    		easing: "ease-out-quad",
        duration: 6000
    	});
      this.redraw();
    },
    addChildcustom(object){
      if(this === this.core){
        return;
      }
        this.addChild(object);
      if (object.type === "branche")
        this.branches.push(object);
      else {
        this.leaves.push(object);
        this.nbLeafs++;
      }
    }
  },settings);
};

oCanvas.registerDisplayObject("branche", branche, "init");
