oCanvas.domReady(function () {
  var HTMLcanvas = document.getElementById("tree");
  HTMLcanvas.height = window.innerHeight;
  HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;
  var tree = oCanvas.create({
  	canvas: "#tree",
  	background: "#ddd"
  });
  window.onresize = function(event) {
    HTMLcanvas.height = window.innerHeight;
    HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;
    tree.redraw();
  };
  var title = tree.display.text({size: 40, x:HTMLcanvas.width/2,origin:{x:"center"},fill: "#222", text:"MotherF***ing Tree"}).add();
  console.log(title);
  var points = [{x:10, y:20},{x:100,y:200},{x:300,y:400},{x:350,y:400},{x:400,y:400},{x:500,y:500},{x:600,y:800}];
  console.log(points);
  var leaf = tree.display.leaf({points: points, animationStade:0}).add();
  leaf.animate({
		animationStade: 100
	}, {
		easing: "ease"
	});
  title.dragAndDrop();
 /*TODO: Socket.io : recevoir nouvelles données du serveur
 Faire touner l'algo de génération avec les nouvelles données*/
});
