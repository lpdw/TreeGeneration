oCanvas.domReady(function () {
  var HTMLcanvas = document.getElementById("tree");
  HTMLcanvas.height = window.innerHeight;
  HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;


  var tree = oCanvas.create({
  	canvas: "#tree",
  	background: "transparent"
  });


  window.onresize = function(event) {
    HTMLcanvas.height = window.innerHeight;
    HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;
    tree.redraw();
  };
  var title = tree.display.text({size: 40, x:HTMLcanvas.width/2,origin:{x:"center"},fill: "#222", text:"MotherF***ing Tree"}).add();


  var points = [{x:HTMLcanvas.width/2,y:0}, {x:HTMLcanvas.width/2 + 2,y:50}, {x:HTMLcanvas.width/2 - 4,y:100}, {x:HTMLcanvas.width/2 - 10,y:150}, {x:HTMLcanvas.width/2 + 1,y:320}];
  var sous_points = [{x:0,y:0}, {x:-10,y:0}, {x:-35,y:0}, {x:-40,y:20}, {x:-70,y:25}];


  var branche = tree.display.branche({
                            points: points,
                            strokeWidth: 10,
                            strokeColor: "green",
                            animationStade: 100}).add();
  var sousbranche = tree.display.branche({
    strokeWidth:7,
    strokeColor:"green",
    points: sous_points,
    startPoint: 80
  });
  branche.addChild(sousbranche);
  sousbranche.animate({
		animationStade: 100
	}, {
		easing: "ease-out-elastic",
    duration: 2000
	});
  console.log(sousbranche);

  title.dragAndDrop();
 /*TODO: Socket.io : recevoir nouvelles données du serveur
 Faire touner l'algo de génération avec les nouvelles données*/
});
