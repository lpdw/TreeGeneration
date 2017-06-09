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
    var prevpoint = sousbranche.points[sousbranche.points.length - 1];
    sousbranche.addPoint({x:  prevpoint.x + 5 * Math.random(), y: prevpoint.y + 11 * Math.random()});
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
  var nleaf = tree.display.leaf({
    strokeWidth:2,
    strokeColor:"green",
    startPoint: 90,
    size:6,
    angle:270,
    shape: "circle",
    shapeFill: true
  });
  sousbranche.addChild(nleaf);

  var nleafsquare = tree.display.leaf({
    strokeWidth:2,
    strokeColor:"red",
    startPoint: 20,
    size:15,
    angle:70,
    shape: "square",
    shapeFill: true
  });
  sousbranche.addChild(nleafsquare);

  var nleaftriangle = tree.display.leaf({
    strokeWidth:2,
    strokeColor:"purple",
    startPoint: 40,
    size:15,
    angle:250,
    shape: "triangle",
    shapeFill: false
  });

  sousbranche.addChild(nleaftriangle);
  branche.points.push({x:tree.width/2 + 1,y:420})
  // soussousbranche.animate({
	// 	animationStade: 100
	// }, {
	// 	easing: "ease-out-elastic",
  //   duration: 2000
	// });
  console.log(branche);
  //branche.scalingX = 0.4;
  //branche.scalingY = 0.4;
  branche.dragAndDrop();
  tree.redraw();
 /*TODO: Socket.io : recevoir nouvelles données du serveur
 // Faire touner l'algo de génération avec les nouvelles données*/
 //  algo.init(tree);
  // algo.generate(tree);
  var i = 0;
  tree.setLoop(function () {
    nleaf.angle +=  Math.cos(i) - 0.5 ;
    nleafsquare.angle +=  Math.cos(i)- 0.5;
    nleaftriangle.angle += Math.cos(i)- 0.5;
    i += 0.01;
  });
  //tree.timeline.start();

});
