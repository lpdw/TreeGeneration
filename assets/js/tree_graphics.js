function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}
function trueY(y){
  return document.getElementById("tree").height - y;
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
    // shapeType: "radial",
    // minorAxis:0,
    // omega:0,
    // offset:{x:0,y:0},
    animationStade:0,
    points:[],
    init: function(){
      var canvas = this.core.canvas;

      // canvas.beginPath();
      // canvas.lineWidth = 10;
      // canvas.strokeStyle = 'green';
      // for(var i = 0 ; i<7 ; i++){
      //     canvas.lineTo(50 + (50 *  (Math.cos(i) + 1) ), 50 + (50 * (Math.sin(i) + 1)) );
      //     sleep(200);
      //     console.log("hello init: " + i);
      //     canvas.redraw();
      // }
      // canvas.stroke();
      // canvas.closePath();

    },
    draw: function(){
      console.log("hello draw");
      console.log(this.animationStade);
      var canvas = this.core.canvas,
        origin = this.getOrigin();
        points = this.points;
        console.log(points);
        canvas.beginPath();
        canvas.lineWidth = 5;
        if(points == null )
          return
        canvas.lineJoin = "bevel";
        var length = points.length * (this.animationStade / 100);
        for(var i = 0; i < length; i++){
          canvas.lineTo(points[i].x, points[i].y);
        }
        canvas.stroke();
        canvas.closePath();
      //   majorAxis = this.majorAxis,
      //   inclinaison = this.inclinaison,
      //   eccentricity = this.eccentricity,
      //   omega = Math.radians(this.omega),
      //   excDist = majorAxis - ( ( 1 - eccentricity ) * majorAxis);
      //   // Mm = Math.sqrt(Math.pow(majorAxis,3)/GM),
      //   this.offset = {
      //     x: excDist * Math.cos(omega),
      //     y: excDist * Math.sin(omega)
      //   };
      //   this.minorAxis = Math.sqrt((1 - Math.pow(eccentricity,2)) * Math.pow(majorAxis, 2));
      //
      // canvas.beginPath();
			// if (this.strokeWidth > 0) {
			// 	canvas.strokeStyle = this.strokeColor;
			// 	canvas.lineWidth = this.strokeWidth;
      //   // for(var i = 0; i < 200; i++){
      //   //    var point = calculPosition(Math.radians(i), majorAxis, 90, eccentricity, Mm );
      //   //    canvas.lineTo(point.x, point.y);
      //   // }
      //   canvas.ellipse(origin.x + this.offset.x, origin.y + this.offset.y, majorAxis, this.minorAxis, omega, 0, 2 * Math.PI);
			// }
      // canvas.stroke();
			// canvas.closePath();
    }
  },settings);
};
oCanvas.registerDisplayObject("leaf", leaf, "init");


var branche = function (settings, core){
  return oCanvas.extend({
    core: core,
    animationStade:0,
    points:[],
    init: function(){
    },
    draw: function(){
      var canvas = this.core.canvas,
        points = this.points;
        if (this.parent.points != "undefined" && this.startPoint){
          var origin = this.parent.points[Math.round((this.startPoint) / 100 * (this.parent.points.length - 1 ) )];
          points = points.map(function(point){
            return {x: (origin.x + point.x), y: (origin.y + point.y)};
          })
        }
        canvas.beginPath();
        canvas.lineWidth = this.strokeWidth;
        canvas.strokeStyle = this.strokeColor;
        canvas.lineJoin = "round";
        canvas.lineCap = "round";

        if(points == null )
          return;
        var progress = this.animationStade / 100;
        console.log(progress);
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
    }
  },settings);
};
oCanvas.registerDisplayObject("branche", branche, "init");
