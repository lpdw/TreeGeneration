var point_input= 0;
var list_input = [1,1,1,1,1,1,1];
var tree_global;

var BranchePrincipal = [];
var BrancheSecondaire = [];

var branchetypeA = [{x:0,y:0}, {x:50,y:0}, {x:100,y:-10}, {x:150,y:10}, {x:200,y:15}, {x:250,y:-0}];
var branchetypeB = [{x:0,y:0}, {x:-50,y:0}, {x:-100,y:10}, {x:-150,y:30}, {x:-200,y:25}, {x:-250,y:30}, {x:-300,y:40}];
var branchetypeC = [{x:0,y:0}, {x:50,y:30}, {x:100,y:50}, {x:150, y:40}, {x:200,y:60}, {x:250,y:80}, {x:300,y:80}];
var branchetypeD = [{x:0,y:0}, {x:-50,y:25}, {x:-75,y:30}, {x:-80,y:40}, {x:-90,y:60}, {x:-100,y:80}, {x:-150,y:100}, {x:-200,y:150}];
var branchetypeE = [{x:0,y:0}, {x:5,y:-5}, {x:5,y:20}, {x:-5,y:30}, {x:5,y:50}, {x:-5,y:100}, {x:5,y:250}];

var SousbranchetypeA = [{x:0,y:0}, {x:10,y:10}];
var SousbranchetypeB = [{x:0,y:0}, {x:10,y:-10}];

var i =0;

var algo = function(tree) {
  tree_global = tree;
  return {
    generate: function(datas){
      point_input = traitementInput(datas);

      if(BranchePrincipal.find(trouverBranche("branche_principal_A"))){
        var branche_principal_A = BranchePrincipal.find(trouverBranche("branche_principal_A")).branche;
      }
      else{
        var branche_principal_A = initBranche(tree_global, branchetypeA, 89);
        BranchePrincipal.push({name:"branche_principal_A", branche:branche_principal_A});
      }


      if(BranchePrincipal.find(trouverBranche("branche_principal_B"))){
        var branche_principal_B = BranchePrincipal.find(trouverBranche("branche_principal_B")).branche;
      }
      else
      {
        var branche_principal_B = initBranche(tree_global, branchetypeB, 80);
        BranchePrincipal.push({name:"branche_principal_B", branche:branche_principal_B});
      }

      if(BranchePrincipal.find(trouverBranche("branche_principal_C"))){
        var branche_principal_C = BranchePrincipal.find(trouverBranche("branche_principal_C")).branche;
      }
      else
      {
        var branche_principal_C = initBranche(tree_global, branchetypeC, 90);
        BranchePrincipal.push({name:"branche_principal_C", branche:branche_principal_C});
      }

      if(BranchePrincipal.find(trouverBranche("branche_principal_D"))){
        var branche_principal_D = BranchePrincipal.find(trouverBranche("branche_principal_D")).branche;
      }
      else
      {
        var branche_principal_D = initBranche(tree_global, branchetypeD, 85);
        BranchePrincipal.push({name:"branche_principal_D", branche:branche_principal_D});
      }

      if(BranchePrincipal.find(trouverBranche("branche_principal_E"))){
        var branche_principal_E = BranchePrincipal.find(trouverBranche("branche_principal_E")).branche;
      }
      else
      {
        var branche_principal_E = initBranche(tree_global, branchetypeE, 88);
        BranchePrincipal.push({name:"branche_principal_E", branche:branche_principal_E});
      }

      if(i==0){
        BrancheSecondaire.push(initSecondaryBranch(tree_global, SousbranchetypeA, 100, "branche_principal_A", branche_principal_A));
        position=position-20;
        i++;
      }
      else{
        BrancheSecondaire.push(initSecondaryBranch(tree_global, SousbranchetypeB, 100, "branche_principal_A", branche_principal_A));
        i--;
      }
    },
  }
}

function trouverBranche(name) {
    return function(element) {
      if(element.name == name) {
        return element;
      }
    }
}




function initBranche(tree_global, branchetype, InitialPoint){
  var branche =  tree_global.display.branche({
    strokeWidth:2,
    strokeColor:"black",
    points: branchetype.slice(0,2),
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
