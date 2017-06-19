var words = {
1: "Tristesse",
2: "Peur",
3: "Ignorance",
4: "Joie" ,
5: "Plaisir",
6: "Connaissance",
7: "Toucher",
8: "Écouter",
9: "Voir",
10: "Sentir",
11: "Création",
12: "Virtuel",
13: "Curiosité",
14: "Entraide",
15: "Environnement",
16: "Savoir-faire",
17: "Nature",
18: "Ludique",
19: "Do It Yourself",
20: "Arts",
21: "Citoyen",
22: "Technique",
23: "Connecté",
24: "Ludique",
25: "Sensibilité",
26: "Expérience",
27: "Atelier",
28: "Narration",
29: "Savoir-être",
30: "Outil",
}


oCanvas.domReady(function () {
  var HTMLcanvas = document.getElementById("tree");
  var HTMLbutton = document.getElementById("button");
  HTMLcanvas.height = window.innerHeight;
  HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;


  var tree = oCanvas.create({
  	canvas: "#tree",
  	background: black
  });

  HTMLbutton.addEventListener("click", function(e){
    var newPoint = {
      x: 5 * (Math.random() + .5),
      y: 1 * (Math.random() + .5)
    };

    sousbranche.addPoint(newPoint);

    var ellipse = tree.display.ellipse({
      x: newPoint.x,
      y: trueY(newPoint.y),
      radius: 15,
      fill: "radial-gradient(#8ec2e2, rgba(255, 255, 255, 0))",
      opacity: 0.5
    });
    tree.addChild(ellipse);

    // ellipse.fadeIn("short", "ease-in-out-cubic", function () { });

    setTimeout(function(){
      ellipse.fadeOut("short", "ease-in-out-cubic", function () { });
    }, 500);

  });
  window.onresize = function(event) {
    HTMLcanvas.height = window.innerHeight;
    HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;
    tree.redraw();
  };
  //var title = tree.display.text({size: 40, x:HTMLcanvas.width/2,origin:{x:"center"},fill: "#222", text:"MotherF***ing Tree"}).add();


  // var points = [{x:tree.width/2,y:0}, {x:tree.width/2 + 2,y:50},
  //   {x:tree.width/2 - 4,y:70}, {x:tree.width/2 + 1,y:110},
  //   {x:tree.width/2 + 1,y:140} ,{x:tree.width/2 - 10,y:170},
  //       {x:tree.width/2 - 4,y:220}, {x:tree.width/2 + 1,y:250},
  //   {x:tree.width/2 + 1,y:280}];
    var rel_points = [];
    var sous_points = [];
    var sous_sous_points = [];

    for(var i= 0; i<70; i++){
      rel_points[i] = {x: .5 + Math.cos(i) * 1.1,
                        y: .5 + Math.cos(i) * 1.1 };
    }
    for(var i= 0; i<40; i++){
      sous_points[i] = {x: 1 + Math.sin(i),
                        y: 1 + Math.sin(i) };
    }
    for(var i= 0; i<30; i++){
      sous_points[i] = {x: 0.5 + Math.cos(i),
                        y: .4 + Math.sin(i) };
    }
  // var sous_points = [{x:0,y:0}, {x:5,y:0}, {x:7,y:0}, {x:9,y:2}, {x:11,y:2}, {x:15,y:2}, {x:17,y:4}, {x:19,y:4}, {x:21,y:4}, {x:24,y:4}, {x:25,y:4}, {x:28,y:4}];
  // var sous_sous_points = [{x:0,y:0}, {x:10,y:0}, {x:35,y:0}, {x:40,y:20}, {x:70,y:25}];

  var branche = tree.display.branche({
                            points: rel_points,
                            strokeWidth: 15,
                            strokeColor: "white",
                            join: "round",
                            cap: "round",
                            animationStade: 100}).add();
  var sousbranche = tree.display.branche({
    strokeWidth:15,
    strokeColor: orange1,
    points: sous_points,
    startPoint: 90,
    join:"round",
    cap:"round"
  });
  branche.addChild(sousbranche);
  var soussousbranche = tree.display.branche({
    strokeWidth:15,
    strokeColor:orange2,
    points: sous_sous_points,
    startPoint: 100
  });

  var nleaf = tree.display.leaf({
    strokeWidth:2,
    strokeColor:green,
    startPoint: 90,
    size:10,
    angle:270,
    shape: "circle",
    shapeFill: true
  });
  sousbranche.addChild(nleaf);

  var nleafsquare = tree.display.leaf({
    strokeWidth:2,
    strokeColor:red1,
    startPoint: 20,
    size:10,
    angle:60,
    shape: "square",
    shapeFill: true
  });
  branche.addChild(nleafsquare);

  var nleaftriangle = tree.display.leaf({
    strokeWidth:2,
    strokeColor:purple,
    startPoint: 40,
    size:10,
    angle:210,
    shape: "triangle",
    shapeFill: true
  });

  branche.addChild(nleaftriangle);
  branche.addPoint({x:0 + 1,y:2});

  //sousbranche.addChild(soussousbranche);
  //branche.points.push({x:tree.width/2 + 1,y:420})

  // soussousbranche.animate({
	// 	animationStade: 100
	// }, {
	// 	easing: "ease-out-elastic",
  //   duration: 2000
	// });
  //console.log(branche);
  //branche.scalingX = 0.4;
  //branche.scalingY = 0.4;
  //tree.redraw();
 // Faire touner l'algo de génération avec les nouvelles données*/
 //  algo.init(tree);
  // algo.generate(tree);
  // var i = 0;
  // tree.setLoop(function () {
  //   nleaf.angle = nleaf.angle > 180 ? nleaf.angle + ( (Math.cos(i)- 0.5) * 5) : nleaf.angle - ( (Math.cos(i)- 0.5) * 5);
  //   nleafsquare.angle = nleafsquare.angle > 180 ? nleafsquare.angle + ( (Math.cos(i)- 0.5) * 5) : nleafsquare.angle - ( (Math.cos(i)- 0.5) * 5);
  //   nleaftriangle.angle = nleaftriangle.angle > 180 ? nleaftriangle.angle + ( (Math.cos(i)- 0.5) * 5) : nleaftriangle.angle - ( (Math.cos(i)- 0.5) * 5);
  //   i = i > 10 ? 0 : i +0.01 ;
  // });
  //tree.timeline.start();
  // var algo_tree = algo(tree);

});
