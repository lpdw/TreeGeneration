/******************************************** Extend exemple ***************************************/

var orbite = function (settings, core){
  return oCanvas.extend({
    core: core,
    shapeType: "radial",
    minorAxis:0,
    omega:0,
    offset:{x:0,y:0},
    init: function(){
    },
    draw: function(){
      var canvas = this.core.canvas,
        origin = this.getOrigin();
        majorAxis = this.majorAxis,
        inclinaison = this.inclinaison,
        eccentricity = this.eccentricity,
        omega = Math.radians(this.omega),
        excDist = majorAxis - ( ( 1 - eccentricity ) * majorAxis);
        // Mm = Math.sqrt(Math.pow(majorAxis,3)/GM),
        this.offset = {
          x: excDist * Math.cos(omega),
          y: excDist * Math.sin(omega)
        };
        this.minorAxis = Math.sqrt((1 - Math.pow(eccentricity,2)) * Math.pow(majorAxis, 2));

      canvas.beginPath();
			if (this.strokeWidth > 0) {
				canvas.strokeStyle = this.strokeColor;
				canvas.lineWidth = this.strokeWidth;
        // for(var i = 0; i < 200; i++){
        //    var point = calculPosition(Math.radians(i), majorAxis, 90, eccentricity, Mm );
        //    canvas.lineTo(point.x, point.y);
        // }
        canvas.ellipse(origin.x + this.offset.x, origin.y + this.offset.y, majorAxis, this.minorAxis, omega, 0, 2 * Math.PI);
			}
      canvas.stroke();
			canvas.closePath();
    }
  },settings);
};
oCanvas.registerDisplayObject("orbite", orbite, "init");
