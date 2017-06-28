oCanvas.domReady(function () {
  var HTMLcanvas = document.getElementById("tree"),
  HTMLbuttonLots = document.getElementById("buttonLots"),
  HTMLbutton = document.getElementById("button"),
  HTMLzoombutton = document.getElementById("zoom"),
  HTMLdezoombutton = document.getElementById("dezoom");
  var branches = [];

  HTMLcanvas.height = window.innerHeight;
  HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;
  // Initier le zoom pour qu'il puisse être utiliser lors du dessin
  oCanvas.Zoom.Init(HTMLcanvas, 200);
  var oCanvasparams = {
  	canvas: "#tree",
  	background: black,
    drawEachFrame : true,
    clearEachFrame : true,
    fps: 20,
  };
  // console.log(HTMLcanvasAnims.getContext('2d'));
  // console.log(oCanvas.AnimContext);
  var tree = oCanvas.create(oCanvasparams);
  // Initier l'algo avec l'objet oCanvas;



  window.onresize = function(event) {
    HTMLcanvas.height = window.innerHeight;
    HTMLcanvas.width =  window.innerWidth <  ( window.innerHeight * 9 ) /16  ? window.innerWidth : ( window.innerHeight * 9 ) /16 ;
    tree = oCanvas.create(oCanvasparams);
    // initTree();
  };
  HTMLzoombutton.addEventListener("click",function(){
      oCanvas.Zoom.setLevel(oCanvas.Zoom.level - 50);
      tree.redraw();
  })
  HTMLdezoombutton.addEventListener("click",function(){
      oCanvas.Zoom.setLevel(oCanvas.Zoom.level + 50);
      tree.redraw();
  })
var leafs = [];
leafs["square"] = [];
leafs["circle"] = [];
function randomBranches(){
  for(var i = 0; i<2 ; i++){
    var invI = 1 - i/14;
    var points = [];
    if (i == 0){
      points[0] = {x: 250, y:0};
    }
    else{
      points[0] = {x:0, y:0};
    }
    var func = Math.random() > .5 ? Math.cos : Math.sin;
    var freq = Math.rand((20 * invI) + 10, (30 * invI) + 11);
    var amplitude  = Math.rand(1,4);
    var y = invI * 1 + 1;
    var f = i%2 == 0 ? 3 : -3;
    for (var j = 1; j< Math.floor(Math.rand(50*invI + 200, 150*invI+300)); j++){
      points[j] = {x: f * func(j/freq)/amplitude,
                        y: y + 1 };
    }
    var branche = tree.display.branche({
      strokeWidth:Math.rand(40*invI + 10,80*invI + 20),
      strokeColor: i == 0 ? white : colors[Math.arrayRand(colors.length)],
      points: points,
      startPoint: Math.rand(2,80),
      join:"round",
      cap:"round",
      trunk: i === 0 ? true :false,
    });
    if( i === 0 )
      tree.addChild(branche);
    else
      branches[Math.arrayRand(branches.length)].addChildcustom(branche);
    branches.push(branche);
    // tree.redraw();
  }
}

  function generateLeaf(){
    // for (var i = 0; i<200; i++){
      var leaf = tree.display.leaf({
        strokeWidth:Math.rand(1000,2000),
        strokeColor:colors[Math.arrayRand(colors.length)],
        startPoint: Math.rand(10,80),
        size:Math.rand(10,30),
        angle:Math.rand(0, 360),
        shape: shapes[Math.arrayRand(shapes.length)],
        shapeFill: Math.round(Math.random())
      });
    branches[Math.arrayRand(branches.length)].addChildcustom(leaf);
    leafs[leaf.shape].push(leaf);
    // tree.timeline.start();
    // }
  }
 // Faire touner l'algo de génération avec les nouvelles données*/
  // algo.init(tree);
  // algo.generate(tree);
  var i = 0;
  tree.setLoop(function () {

    for(var j = 0; j < algo.goldenLeaves.length; j++){
      algo.goldenLeaves[j].leafRotation = i;
    }
    i = i > 360 ? 0 : i+2;
  });

function initTree(){
  // Regarder si mots sur API et les générer ( peut être mettre un delai)
  $.ajax("https://api-tree.herokuapp.com/inputs/BeforeDate/"+(new Date())).done(function(data){

    for (var i=0; i<data.inputs.length; i++){
      algo.generate(data.inputs[i].words, false, true);
    }
    tree.redraw();
    $("#loader").fadeOut(500);
  // });
});
}

  var iteration;
  HTMLbutton.addEventListener("click", function(e){
        // generate();
        iteration = 1;
            generate(true);
  });
  HTMLbuttonLots.addEventListener("click", function(e){
        // generate();
          iteration = 2000;
            generateLocal(false);
  });
  function generateLocal(bool){
    iteration--;
    if(iteration>0){
            var myWords= {"words":[]};
            var keys = Object.keys(words);
            for(var j =Math.rand(4,6); j >= 0; j--){
              myWords["words"].push(words[keys[ keys.length * Math.random() << 0]]);
            }
            algo.generate(myWords.words, bool);
            generateLocal(bool);
        }
  }
    function generate(){
        // iteration--;
        if(iteration>0){
                var myWords= {"words":[]};
                var keys = Object.keys(words);
                for(var j =Math.rand(4,6); j >= 0; j--){
                  myWords["words"].push(words[keys[ keys.length * Math.random() << 0]]);
                }
                // algo.generate(myWords);
                console.log(JSON.stringify(myWords));

                //generate();

            $.ajax( {
                url:"https://api-tree.herokuapp.com/inputs",
                data:JSON.stringify(myWords),
                contentType: "application/json",
                type:"POST"
            }, function( data ) {
              console.log(data);
            });
        }
    }
        algo.init(tree);
initTree();
tree.timeline.start();
  // une foi générer se connecter à socket pour récupérer les suivants.
  var socket = io.connect('https://api-tree.herokuapp.com');
  socket.on('new_inputs', function (data) {
    // New Branch
    setTimeout(function(){
      algo.generate(data, true, false);
    }, 700);
    // console.log("socket data : ", data);

    //socket.emit('my other event', { my: 'data' });
    //algo(tree_global).generate(data);
  });
  // algo.generate({inputs: [21,14,23]});
});
