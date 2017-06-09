var point_input= 0;
var list_input = [1,1,1,1,1,1,1];
var tree_global;

var BrancheSecondaire = [];

var branchetypeA = [{x:0,y:0}, {x:50,y:0}, {x:100,y:-10}, {x:150,y:10}, {x:200,y:15}, {x:250,y:-20}];
var branchetypeB = [{x:0,y:0}, {x:-50,y:0}, {x:-100,y:10}, {x:-150,y:30}, {x:-200,y:25}, {x:-250,y:30}, {x:-300,y:40}];
var branchetypeC = [{x:0,y:0}, {x:50,y:30}, {x:100,y:50}, {x:150, y:40}, {x:200,y:60}, {x:250,y:80}, {x:300,y:80}];
var branchetypeD = [{x:0,y:0}, {x:-50,y:25}, {x:-75,y:30}, {x:-80,y:40}, {x:-90,y:60}, {x:-100,y:80}, {x:-150,y:100}, {x:-200,y:150}];
var branchetypeE = [{x:0,y:0}, {x:5,y:-5}, {x:5,y:20}, {x:-5,y:30}, {x:5,y:50}, {x:-5,y:100}, {x:5,y:250}];

var SousbranchetypeA = [{x:0,y:0}, {x:10,y:10}, {x:35,y:20}, {x:40,y:30}, {x:70,y:45}];


var algo = function(tree) {
  tree_global = tree;
  return {
    generate: function(datas){
      point_input = traitementInput(datas);

      //SWITCH
      var branche_principal_A = initBranche(tree_global, branchetypeA, 89);
      var branche_principal_B = initBranche(tree_global, branchetypeB, 80);
      var branche_principal_C = initBranche(tree_global, branchetypeC, 90);
      var branche_principal_D = initBranche(tree_global, branchetypeD, 85);
      var branche_principal_E = initBranche(tree_global, branchetypeE, 95);

      initSecondaryBranch(tree_global, SousbranchetypeA, 85, "branche_principal_A", branche_principal_A);
    },
  }
}

function initBranche(tree_global, branchetype, InitialPoint){
  var branche =  tree_global.display.branche({
    strokeWidth:2,
    strokeColor:"black",
    points: branchetype,
    join: "round",
    cap: "round",
    startPoint: InitialPoint,
  });

  tree_global.children[0].addChild(branche);
  return branche;
}

function initSecondaryBranch(tree_global, brancheType, InitialPoint, parent_name, parent){
    var sub_branch = tree_global.display.branche({
      strokeWidth:2,
      strokeColor:"red",
      points: brancheType,
      startPoint: InitialPoint,//%
      BranchParent: parent_name,
    });

    parent.addChild(sub_branch);

    console.log(sub_branch);
    return sub_branch;

}

function traitementInput(datas)
{
  let point_input = 0;
  for(let i=0; i<datas.inputs.length; i++)
  {
      point_input = point_input + Number(datas.inputs[i].value);
  }

  return point_input;
}
