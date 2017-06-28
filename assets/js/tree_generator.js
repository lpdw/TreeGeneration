

var words = {
Tristesse: 1,
Peur:2,
Ignorance: 3,
Joie: 4,
Plaisir: 5,
Connaissance: 6,
Toucher:7,
Ecouter:8,
Voir:9,
Sentir:10,
Creation:11,
Virtuel:12,
Curiosite:13,
Entraide:14,
Savoir_faire:15,
Nature:16,
Ludique:17,
Do_It_Yourself:18,
Arts:19,
Citoyen:20,
Technique:21,
Experience:22,
Narration:23,
Outil:24,
}
var value_input= 0;
var list_input = [1,1,1,1,1,1,1];
var tree_global;

var BranchePrincipal = [];
var BrancheSecondaire = [];

var i =0;

var algo =  {
  treeGlobal: null,
  nbInput:0,
  currentBranche: null,
  inputList: [],
  inputValue: 0,
  nbBranches:0,
  avgValue:0,
  maxValue:0,
  minValue:0,
  params:{width:5,color:white, size:20, freq:10,amplitude:5},
  animate:true,
  goldenLeaves:[],
  isPresent:[],
  init: function(tree){
    this.treeGlobal = tree;
    var keys = Object.keys(words);
    for(var i=0; i<keys.length; i++){
      this.isPresent[words[keys[i]]] = false;
    }
  },
  generate: function(datas, animate=true, init = true){
    // console.log("======START GEN====");
    this.nbInput ++;
    this.animate = animate;
    if(this.nbInput%100 === 0)
      this.enlarge(this.treeGlobal.children[0]);
    this.parseInput(datas);
    if(this.nbInput == 1){
      if (!init) {
        // S'il n'y a pas de données de base alors c'est le premier input donc on lance l'animation
        this.startAnimation(this);
      } else {
        // Sinon on initialise le tronc et les points

        this.initTrunk();
        this.addPoints();
      }
    }else{
      $('.startAnimation').css("display", "none");
      var action = this.getBrancheAndAction(this.treeGlobal.children[0]);
      this.getParams(action);
      this[action]();
      // console.log(action);
    }

    // console.log("======END GEN====");
  },
  startAnimation: function(thisParent){
    $('.startAnimation').css("display", "flex");
    setTimeout(function(){

      // $('.startAnimation').css("display", "none");
      // Une fois l'animation terminée, on peut initialiser le tronc et les points
      thisParent.initTrunk();
      thisParent.getParams("addPoints");
      thisParent.addPoints();
      $(".startAnimation").fadeOut(500);
    }, 5000);
  },
  addPoints: function(){
    var points = [];
    var nbpoints = this.currentBranche.points.length;
    var tot = 2+ Math.round(this.avgValue/2 * (1-(nbpoints/this.currentBranche.maxPoints)));

    var func = this.containOneofWords(words.Tristesse,
                                                  words.Ecouter,
                                                  words.Creation,
                                                  words.Nature
                                                ) ? Math.cos : Math.sin;

    if(this.currentBranche.points.length < 50) {
        var x = this.currentBranche.direction * (3 + this.avgValue%5);
    } else {
        var x = this.currentBranche.direction * (-0.5 + this.avgValue%3);
    }
    var y = 1;
    // console.log("freq:",this.params.freq,"ampli:",this.params.amplitude, 'tot:', tot);
    for(var i = 0; i< tot; i++){
      points.push({x: x +(func(((nbpoints + i) * this.params.freq)) * this.params.amplitude),
                   y: y *  Math.abs(this.params.amplitude) + 2});
    }
    // console.log(points);
    this.currentBranche.addPoints(points, this.animate);
  },
  addLeaf: function(){
    var shape = "circle";
    var shapeFill = false
    if (this.nbInput%150===0){
      shape = "square";
      shapeFill = true;
      this.params.size *= 1.5;
    }else{
      if(this.avgValue>10)
        shape = "square";
      if(this.inputValue%2===0)
        shapeFill = true;
    }
      var leaf = this.treeGlobal.display.leaf({
        strokeWidth:this.params.width/2,
        strokeColor:this.params.color,
        startPoint:((this.inputValue/40)*100)%100 ,
        size:this.params.size,
        angle:-((this.inputValue/101) * 360),
        shape: shape,
        shapeFill: shapeFill,
        animationStade: this.animate ? 0:100,
      });
      if(this.nbInput%150===0)
        this.goldenLeaves.push(leaf);
    this.currentBranche.addChildcustom(leaf);
  },
  createBranche: function(){
    // if(40 + (this.avgValue/20)*59 > 100){
    //   console.log(this.avgValue);
    // }
    var branche =  this.treeGlobal.display.branche({
      strokeWidth:this.params.width,
      strokeColor:this.params.color,
      points: [{x:0,y:0}],
      startPoint: this.avgValue >= 20 ? 100 : 40 + (this.avgValue/20)*60 ,
      maxBranches: 25,
      maxLeafs: 10,
      direction: this.nbBranches%2 === 0 ? 1 : -1,
      maxPoints: 800 - (this.nbBranches),
    });
    this.currentBranche.addChildcustom(branche);
        // console.log('new branch', branche);
    this.nbBranches++;
    this.currentBranche = branche;
    this.getParams("addPoints");
    this.addPoints();
  },
  initTrunk: function(){
    // console.log("initTrunk");
    var branche = this.treeGlobal.display.branche({
      strokeWidth: 15,
      strokeColor:white,
      points: [{x:oCanvas.Zoom.canvas.width/2, y:0}],
      startPoint: 0,
      trunk: true,
      maxBranches: 5,
      maxLeafs: 0,
      direction: 0,
      maxPoints: 400,
    });
    this.treeGlobal.addChild(branche);
    this.currentBranche = branche;
    this.nbBranches++;
  },
  getParams: function(type){
    if(type === "addLeaf" || type === "createBranche"){
      if(this.containOneofWords(words.Peur))
        this.params.width=5;
      else if(this.containOneofWords(words.Tristesse, words.Ignorance))
        this.params.width=9;
      else if(this.containOneofWords(words.Plaisir, words.Connaissance, words.Creation,words.Nature))
        this.params.width=11;
      else if(this.containOneofWords(words.Nature, words.Ludique, words.Do_It_Yourself,words.Arts))
        this.params.width=12;
      else if(this.containOneofWords(words.Sentir, words.Citoyen, words.Experience))
        this.params.width=13;
      else
        this.params.width=12;
      if(this.nbInput%150 === 0){
        this.params.color = gold;
      }
      else if(this.containAllWords(words.Peur, words.Tristesse))
        this.params.color = colors[2];
      else if(this.containOneofWords(words.Connaissance, words.Toucher, words.Nature) && this.avgValue < 11 )
        this.params.color = colors[3];
      else if(this.containOneofWords(words.Ignorance)
            &&this.containOneofWords(words.Savoir_faire, words.Entraide ,words.Citoyen))
        this.params.color = colors[4];
      else if(this.containOneofWords(words.Voir, words.Virtuel, words.Curiosite))
        this.params.color = colors[5];
      else if(this.containAllWords(words.Technique,words.Toucher))
        this.params.color = colors[0];
      else if(this.containOneofWords(words.Joie, words.Ludique,words.Creation))
        this.params.color = colors[1];
      else if(this.containOneofWords(words.Outil) && this.avgValue > 10)
        this.params.color = colors[8];
      else
        this.params.color = colors[6];
      }
    if(type==="addLeaf"){
      if(this.containAllWords(words.Tristesse, words.Joie))
        this.params.size = 60;
      else if(this.containOneofWords(words.Connaissance, words.Voir) && this.avgValue < 8 )
        this.params.size = 70;
      else if(this.containOneofWords(words.Savoir_faire, words.Entraide) && this.inputValue < 50)
        this.params.size = 80;
      else if(this.containAllWords(words.Do_It_Yourself,words.Citoyen))
        this.params.size = 90;
      else if(this.containOneofWords(words.Toucher, words.Citoyen))
        this.params.size = 110;
      else if(this.containOneofWords(words.Narration, words.Ecouter, words.Ludique,words.Creation))
        this.params.size = 120;
      else if(this.containOneofWords(words.Narration) && this.avgValue > 20)
        this.params.size = 130;
      else
        this.params.size = 100;
      }
      this.params.size *= 1 + (this.nbInput/500);
      if(type === "addPoints" || type === "createBranche"){
        if(this.currentBranche.trunk){
          this.params.freq = 50;
          this.params.amplitude =5;
          return;
        }
        else if(this.containAllWords(words.Connaissance, words.Peur))
          this.params.freq = 5;
        else if(this.containOneofWords(words.Tristesse, words.Voir) && this.avgValue < 8 )
          this.params.freq = 10;
        else if(this.containOneofWords(words.Savoir_faire, words.Entraide) && this.inputValue < 50)
          this.params.freq = 20;
        else if(this.containAllWords(words.Do_It_Yourself,words.Citoyen))
          this.params.freq = 40;
        else if(this.containOneofWords(words.Toucher, words.Citoyen))
          this.params.freq = 45;
        else if(this.containOneofWords(words.Ecouter, words.Ludique,words.Creation))
          this.params.freq = 80;
        else if(this.containOneofWords(words.Narration) && this.avgValue > 20)
          this.params.freq = 100;
        else
          this.params.freq = 25;
        if(this.containAllWords(words.Tristesse, words.Citoyen))
          this.params.amplitude = -3;
        else if(this.containOneofWords(words.Connaissance, words.Voir) && this.avgValue < 8 )
          this.params.amplitude = 2;
        else if(this.containOneofWords(words.Savoir_faire, words.Entraide) && this.inputValue < 50)
          this.params.amplitude = 1;
        else if(this.containOneofWords(words.Do_It_Yourself,words.Citoyen))
          this.params.amplitude = 2;
        else if(this.containOneofWords(words.Toucher, words.Joie))
          this.params.amplitude = -2;
        else if(this.containOneofWords(words.Narration, words.Ecouter, words.Ludique,words.Creation))
          this.params.amplitude = 3;
        else if(this.containOneofWords(words.Narration) && this.avgValue > 20)
          this.params.amplitude = 2;
        else
          this.params.amplitude = 1;
      }

  },
  getBrancheAndAction: function(base){
    this.currentBranche = base;
    if(this.nbInput%150 === 0){
      if((base.nbLeafs < base.maxLeafs && base.points.length < base.maxPoints/5) || base.branches.length === 0){
        return "addLeaf";
      }else{
        return this.getBrancheAndAction(base.branches[(this.nbInput/150)%base.branches.length]);
      }
    }

    if(base.points.length < base.maxPoints/15 || (base.points.length < base.maxPoints/2 && this.containOneofWords(words.Outil,
                                                                      words.Do_It_Yourself,
                                                                      words.Virtuel,
                                                                      words.Nature))){
      // this.currentBranche = base;
      return "addPoints";
    }

    if (base ===this.treeGlobal.children[0] && base.points.length < base.maxPoints){
      if(this.containOneofWords(words.Tristesse, words.Ignorance))
      {
        if(base.branches[0])
        {
          // console.log("Branche 0");
          return this.getBrancheAndAction(base.branches[0]);
        }
        else{
          // this.currentBranche = base;
          // console.log("Action: Creating branch on trunk (0)");
          return "createBranche";
        }
      }
      else if(this.containOneofWords(words.Peur, words.Voir))
      {
        if(base.branches[1] != undefined)
          {// console.log("Branche 1");
          return this.getBrancheAndAction(base.branches[1]);}
        else{
          // this.currentBranche = base;
          // console.log("Action: Creating branch on trunk (1)");
          return "createBranche";
        }
      }
      else if(this.containOneofWords(words.Joie, words.Plaisir))
      {
        if(base.branches[2] != undefined)
          {// console.log("Branche 2");
          return this.getBrancheAndAction(base.branches[2]);}
        else{
          // this.currentBranche = base;
          // console.log("Action: Creating branch on trunk (2)");
          return "createBranche";
        }
      }
      else if(this.containOneofWords(words.Connaissance))
      {
        if(base.branches[3] != undefined)
          {// console.log("Branche 3");
          return this.getBrancheAndAction(base.branches[3]);}
        else{
          // this.currentBranche = base;
          // console.log("Action: Creating branch on trunk (3)");
          return "createBranche";
        }
      }
      else if(this.containOneofWords(words.Technique, words.Virtuel))
      {
        if(base.branches[4] != undefined)
          {// console.log("Branche 4");
          return this.getBrancheAndAction(base.branches[4]);
        }
        else{
          // this.currentBranche = base;
          // console.log("Action: Creating branch on trunk (4)");
          return "createBranche";
        }
      }
    }

      if (base.maxBranches > base.branches.length
        && this.avgValue > 10
        && this.containOneofWords(words.Do_It_Yourself)
        && base.branches.length/base.maxBranches < base.points.length/base.maxPoints)
      {
        return "createBranche";
      }
      else if(base.points.length < base.maxPoints
              && this.containOneofWords(words.Entraide, words.Toucher))
        {
          this.currentBranche = base;
          // console.log("adding points presence of words");
          return "addPoints";
        }
    else if (base.maxLeafs > base.nbLeafs && this.containOneofWords(words.Joie,
                                                    words.Connaissance,
                                                    words.Toucher,
                                                    words.Voir,
                                                    words.Sentir,
                                                    words.Creation,
                                                    words.Curiosite,
                                                    words.Savoir_faire,
                                                    words.Narration
                                                     ))
      {
        // this.currentBranche = base;
        // console.log("adding leaf presence of words");
        return "addLeaf";
      }
    else{
      if(base.branches.length > 0){
          if(base.branches[Math.floor((this.avgValue / 21) * base.branches.length)])
            return this.getBrancheAndAction(base.branches[Math.floor((this.avgValue / 21) * base.branches.length)]);
        else
            return this.getBrancheAndAction(base.branches[base.branches.length - 1]);
      }

      // this.currentBranche = base;
      // console.log("create Branche default");
      return "createBranche";
    }
  },
  containOneofWords: function(){
    for(var i = arguments.length - 1; i >= 0 ; i--){
        if(this.isPresent[arguments[i]] === true)
          return true;
    }
    return false;
  },
  containAllWords: function(){
    for(var i = arguments.length - 1; i >= 0 ; i--){
        if(this.isPresent[arguments[i]] === false)
          return false;
    }
    return true;
  },
  enlarge: function(branche){

    // branche.strokeWidth += 2.5;
    branche.strokeWidth += 3.5;
    for(var i = branche.branches.length - 1; i>=0; i--){
      for(var j = branche.branches[i].leaves.length -1; j >=0 ; j--) {
        // branche.branches[i].leaves[j].size = oCanvas.Zoom.level / 15;
        branche.branches[i].leaves[j].strokeWidth +=  0.2;
          branche.branches[i].leaves[j].size +=  11;
      }
      this.enlarge(branche.branches[i]);
    }
},
parseInput: function(words){
    this.inputValue = 0;
    this.maxValue = 0;
    this.minValue = 0;
    for(let j=(this.isPresent.length - 1);j>0;j--){
      this.isPresent[j]=false;
    }
    for(let i=0; i<words.length; i++)
    {
        var value = Number(words[i]);
        this.isPresent[value]=true;
        if (this.maxValue < value)
          this.maxValue = value;
        if (this.minValue > value)
          this.minValue = value;
        this.inputValue += value;
    }
    this.inputList = words;
    this.avgValue = this.inputValue/this.inputList.length;
  }

}
// function trouverBranche(name) {
//     return function(element) {
//       if(element.name == name) {
//         return element;
//       }
//     }
// }


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

}
