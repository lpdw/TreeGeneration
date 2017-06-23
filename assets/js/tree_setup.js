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
  var HTMLcanvas = document.getElementById("tree"),
  HTMLbutton = document.getElementById("button"),
  HTMLzoombutton = document.getElementById("zoom"),
  HTMLdezoombutton = document.getElementById("dezoom"),
  HTMLleafbutton = document.getElementById("leaf");
  var branches = [];

  HTMLcanvas.height = window.innerHeight;
  HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;
  oCanvas.Zoom.Init(HTMLcanvas, 1000);

  var tree = oCanvas.create({
  	canvas: "#tree",
  	background: black
  });

  HTMLbutton.addEventListener("click", function(e){
    var branche = branches[Math.arrayRand(branches.length)];
    var newPoint = {
      x: Math.cos(branche.points.length/80)/4,
      y: 5
    };
    branche.addPoint(newPoint);

    // var ellipse = tree.display.ellipse({
    //   x: newPoint.x,
    //   y: trueY(newPoint.y),
    //   radius: 15,
    //   fill: "radial-gradient(#8ec2e2, rgba(255, 255, 255, 0))",
    //   opacity: 0.5
    // });
    //tree.addChild(ellipse);

    // ellipse.fadeIn("short", "ease-in-out-cubic", function () { });

    // setTimeout(function(){
    //   ellipse.fadeOut("short", "ease-in-out-cubic", function () { });
    // }, 500);

  });
  window.onresize = function(event) {
    HTMLcanvas.height = window.innerHeight;
    HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;
    tree.redraw();
  };
  HTMLzoombutton.addEventListener("click",function(){
      oCanvas.Zoom.setLevel(oCanvas.Zoom.level - 50);
      tree.redraw();
  })
  HTMLdezoombutton.addEventListener("click",function(){
      oCanvas.Zoom.setLevel(oCanvas.Zoom.level + 50);
      tree.redraw();
  })
  HTMLleafbutton.addEventListener("click", function(){
    generateLeaf();
  })
  //var title = tree.display.text({size: 40, x:HTMLcanvas.width/2,origin:{x:"center"},fill: "#222", text:"MotherF***ing Tree"}).add();
  // var points = [{x:tree.width/2,y:0}, {x:tree.width/2 + 2,y:50},
  //   {x:tree.width/2 - 4,y:70}, {x:tree.width/2 + 1,y:110},
  //   {x:tree.width/2 + 1,y:140} ,{x:tree.width/2 - 10,y:170},
  //       {x:tree.width/2 - 4,y:220}, {x:tree.width/2 + 1,y:250},
  //   {x:tree.width/2 + 1,y:280}];
    // var points = [];
    // points[0] = {x: 250, y:0};
    // for(var i= 1; i<1000; i++){
    //   var tot = Math.random() * (150 - 80) + 80;
    //   points[i] = {x: Math.cos(i/tot)/5,
    //                     y: .4 };
    // }
    //
    // branches[0] = tree.display.branche({
    //                           trunk: true,
    //                           points: points,
    //                           strokeWidth: 100,
    //                           strokeColor: "white",
    //                           join: "round",
    //                           cap: "round",
    //                           animationStade: 100}).add();
    // //branches.push(branche);
    // points = [];
    // points[0] = {x:0, y:0};
    // for(var i= 1; i<600; i++){
    //   var tot = Math.random() * (100 - 30) + 30;
    //   points[i] = {x: Math.sin(i/tot),
    //                     y: 1 };
    // }
    //
    // branches[1] = tree.display.branche({
    //   strokeWidth:100,
    //   strokeColor: orange1,
    //   points: points,
    //   startPoint: 20,
    //   join:"round",
    //   cap:"round"
    // });
    // branches[0].addChild(branches[1]);
    //
    //
    // points = [];
    // points[0] = {x:0, y:0};
    // for(var i= 1; i<400; i++){
    //   var tot = Math.random() * (20 - 10) + 10;
    //
    //   points[i] = {x: -Math.sin(i/tot)/2 - 0.5,
    //                     y: 0.1 };
    // }
    //
    // branches[2] = tree.display.branche({
    //   strokeWidth:100,
    //   strokeColor: purple,
    //   points: points,
    //   startPoint: 70,
    //   join:"round",
    //   cap:"round"
    // });
    // branches[1].addChild(branches[2]);

    for(var i = 0; i<20 ; i++){
      var invI = 1 - i/19;
      var points = [];
      if (i == 0){
        points[0] = {x: 250, y:0};
      }
      else{
        points[0] = {x:0, y:0};
      }
      var func = Math.random() > .5 ? Math.cos : Math.sin;
      var freq = Math.rand((100 * invI) + 10, (200 * invI) + 11);
      var amplitude  = Math.rand(1,4);
      var y = invI * 1 + 1;
      var f = i%2 == 0 ? 3 : -3;
      for (var j = 1; j< Math.floor(Math.rand(50*invI + 200, 150*invI+500)); j++){
        points[j] = {x: f * func(j/freq)/amplitude,
                          y: y + Math.rand(-0.2, 0.2) };
      }
      var branche = tree.display.branche({
        strokeWidth:Math.rand(40*invI + 20,80*invI + 40),
        strokeColor: i == 0 ? white : colors[Math.arrayRand(colors.length)],
        points: points,
        startPoint: Math.rand(2,80),
        join:"round",
        cap:"round",
        trunk: i === 0 ? true :false,
      });
      if( i === 0 )
        branche.add();
      else
        branches[Math.arrayRand(branches.length)].addChild(branche);
      branches.push(branche);
      tree.redraw();
      // console.log(branches);
    }

    // sous_sous_points[0] = {x:0, y:0};
    // for(var i= 1; i<400; i++){
    //   var tot = Math.random() * (20 - 10) + 10;
    //
    //   sous_sous_points[i] = {x: -Math.sin(i/tot)/2 - 0.5,
    //                     y: 0.1 };
    // }
  // var sous_points = [{x:0,y:0}, {x:5,y:0}, {x:7,y:0}, {x:9,y:2}, {x:11,y:2}, {x:15,y:2}, {x:17,y:4}, {x:19,y:4}, {x:21,y:4}, {x:24,y:4}, {x:25,y:4}, {x:28,y:4}];
  // var sous_sous_points = [{x:0,y:0}, {x:10,y:0}, {x:35,y:0}, {x:40,y:20}, {x:70,y:25}];


  // var sousbranche = tree.display.branche({
  //   strokeWidth:100,
  //   strokeColor: orange1,
  //   points: sous_points,
  //   startPoint: 20,
  //   join:"round",
  //   cap:"round"
  // });
  // var sssousbranche = tree.display.branche({
  //   strokeWidth:100,
  //   strokeColor: purple,
  //   points: sous_sous_points,
  //   startPoint: 70,
  //   join:"round",
  //   cap:"round"
  // });
  // branche.addChild(sousbranche);
  // sousbranche.addChild(sssousbranche);


  // var nleaf = tree.display.leaf({
  //   strokeWidth:5,
  //   strokeColor:green,
  //   startPoint: 90,
  //   size:30,
  //   angle:90,
  //   shape: "circle",
  //   shapeFill: true
  // });
  // sssousbranche.addChild(nleaf);
  //
  // var nleafsquare = tree.display.leaf({
  //   strokeWidth:4,
  //   strokeColor:red1,
  //   startPoint: 20,
  //   size:50,
  //   angle:0,
  //   shape: "square",
  //   shapeFill: true
  // });
  // sousbranche.addChild(nleafsquare);
  //
  // var nleaftriangle = tree.display.leaf({
  //   strokeWidth:5,
  //   strokeColor:purple,
  //   startPoint: 40,
  //   size:120,
  //   angle:180,
  //   shape: "triangle",
  //   shapeFill: true
  // });
  // sousbranche.addChild(nleaftriangle);
  function generateLeaf(){

    for (var i = 0; i<50; i++){
      var leaf = tree.display.leaf({
        strokeWidth:Math.rand(1,4),
        strokeColor:colors[Math.arrayRand(colors.length)],
        startPoint: Math.rand(10,80),
        size:Math.rand(10,30),
        angle:Math.rand(0, 360),
        shape: shapes[Math.arrayRand(shapes.length)],
        shapeFill: Math.round(Math.random())
      });
    branches[Math.arrayRand(branches.length)].addChild(leaf);
    }

  }


  // sousbranche.addChild(nleaftriangle);
  //branche.addPoint({x:0 + 1,y:2});

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
  //   nleaf.leafRotation = i;
  //   nleaf.angle = i;
  //   nleafsquare.leafRotation =  i;
  //   nleafsquare.angle =  i;
  //   nleaftriangle.leafRotation = i;
  //   nleaftriangle.angle = i;
  //   i = i > 360 ? 0 : i+1;
  //   console.log(i);
  // });
  // tree.timeline.start();
  // var algo_tree = algo(tree);

});
