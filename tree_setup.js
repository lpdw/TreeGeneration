oCanvas.domReady(function () {
  var HTMLcanvas = document.getElementById("tree");
  HTMLcanvas.height = window.innerHeight;
  HTMLcanvas.width =  window.innerWidth;
  var tree = oCanvas.create({
  	canvas: "#tree",
  	background: "#ddd"
  });
  window.onresize = function(event) {
    tree.redraw();
  };

});
