oCanvas.domReady(function () {
  var HTMLcanvas = document.getElementById("tree");
  var HTMLbutton = document.getElementById("button");
  HTMLcanvas.height = window.innerHeight;
  HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;


  var tree = oCanvas.create({
  	canvas: "#tree",
  	background: "transparent"
  });

  HTMLbutton.addEventListener("click", function(e){
    var prevpoint = branche.points[branche.points.length - 1];
    branche.addPoint({x:  prevpoint.x + 5 * Math.random(), y: prevpoint.y + 11 * Math.random()});
  });
  window.onresize = function(event) {
    HTMLcanvas.height = window.innerHeight;
    HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;
    tree.redraw();
  };
  //var title = tree.display.text({size: 40, x:HTMLcanvas.width/2,origin:{x:"center"},fill: "#222", text:"MotherF***ing Tree"}).add();


  var points = [{x:tree.width/2,y:0}, {x:tree.width/2 + 2,y:50}, {x:tree.width/2 - 4,y:100}, {x:tree.width/2 - 10,y:150}, {x:tree.width/2 + 1,y:320}];
  var sous_points = [{x:0,y:0}, {x:10,y:0}, {x:35,y:0}, {x:40,y:20}, {x:70,y:25}];
  var sous_sous_points = [{x:0,y:0}, {x:10,y:0}, {x:35,y:0}, {x:40,y:20}, {x:70,y:25}];


  var branche = tree.display.branche({
                            points: points,
                            strokeWidth: 3,
                            strokeColor: "black",
                            animationStade: 100}).add();
  var sousbranche = tree.display.branche({
    strokeWidth:2,
    strokeColor:"black",
    points: sous_points,
    startPoint: 90
  });
  branche.addChild(sousbranche);
  var soussousbranche = tree.display.branche({
    strokeWidth:15,
    strokeColor:"black",
    points: sous_sous_points,
    startPoint: 100
  });

  sousbranche.addChild(soussousbranche);
  // soussousbranche.animate({
	// 	animationStade: 100
	// }, {
	// 	easing: "ease-out-elastic",
  //   duration: 2000
	// });
  console.log(branche);

  branche.dragAndDrop();
  tree.redraw();
 /*TODO: Socket.io : recevoir nouvelles données du serveur
 Faire touner l'algo de génération avec les nouvelles données*/
});