
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
  goldenLeafs:[],
  init: function(tree){
    this.treeGlobal = tree;
  },
  generate: function(datas, animate=true, init = false){
    // console.log("======START GEN====");
    this.nbInput ++;
    this.animate = animate;
    if(this.nbInput%70 === 0)
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
    }

    // console.log("======END GEN====");
  },
  startAnimation: function(thisParent){
    $('.startAnimation').css("display", "block");
    setTimeout(function(){
      $('.startAnimation').css("display", "none");
      // Une fois l'animation terminée, on peut initialiser le tronc et les points
      thisParent.initTrunk();
      thisParent.addPoints();
    }, 2800);
  },
  addPoints: function(){
    var points = [];
    var tot = Math.round(this.avgValue/2);
    var func = this.containOneofWords(words.Tristesse,
                                                  words.Ecouter,
                                                  words.Creation,
                                                  words.Nature
                                                ) ? Math.cos : Math.sin;

    if(this.nbInput < 100) {
        var x = this.currentBranche.direction * 0.2;
    } else {
        var x = this.currentBranche.direction * 0.03;
    }
    var y = 1;
    for(var i = 0; i< tot; i++){
      points.push({x: x * func(i / this.params.freq) / this.params.amplitude,
                   y: Math.abs(y *  this.params.amplitude )});
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
    }else{
      if(this.avgValue>6)
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
        this.goldenLeafs.push(leaf);
    this.currentBranche.addChildcustom(leaf);
  },
  createBranche: function(){
    // console.log((this.avgValue/20)*100);
    var branche =  this.treeGlobal.display.branche({
      strokeWidth:this.params.width,
      strokeColor:this.params.color,
      points: [{x:0,y:0}],
      startPoint: (this.avgValue/20)*100,
      maxBranches: 10,
      maxLeafs: 15,
      direction: this.nbBranches%2 === 0 ? 1 : -1,
      maxPoints: 1000 - (this.nbBranches),
    });
    this.currentBranche.addChildcustom(branche);
        // console.log('new branch', branche);
    this.nbBranches++;
    this.currentBranche = branche;
    this.addPoints();
  },
  getParams: function(type){
    if(type === "addPoints" || type === "addLeaf" || type === "createBranche"){
      if(this.containOneofWords(words.Peur))
        this.params.width=4;
      else if(this.containOneofWords(words.Tristesse, words.Ignorance))
        this.params.width=5;
      else if(this.containOneofWords(words.Plaisir, words.Connaissance, words.Creation,words.Nature))
        this.params.width=7;
      else if(this.containOneofWords(words.Nature, words.Ludique, words.Do_It_Yourself,words.Arts))
        this.params.width=8;
      else if(this.containOneofWords(words.Sentir, words.Citoyen, words.Experience))
        this.params.width=9;
      else
        this.params.width=8;
      if(this.nbInput%150 === 0){
        this.params.color = gold;
      }
      else if(this.containOneofWords(words.Peur, words.Tristesse))
        this.params.color = colors[2];
      else if(this.containOneofWords(words.Connaissance, words.Toucher, words.Nature) && this.avgValue < 15 )
        this.params.color = colors[3];
      else if(this.containOneofWords(words.Ignorance)
            &&this.containOneofWords(words.Savoir_faire, words.Entraide ,words.Citoyen))
        this.params.color = colors[4];
      else if(this.containOneofWords(words.Voir, words.Virtuel, words.Curiosite))
        this.params.color = colors[5];
      else if(this.containOneofWords(words.Plaisir, words.Technique, words.Entraide, words.Experience,words.Toucher))
        this.params.color = colors[0];
      else if(this.containOneofWords(words.Joie, words.Narration, words.Ecouter, words.Ludique,words.Creation))
        this.params.color = colors[1];
      else if(this.containOneofWords(words.Outil) && this.avgValue > 10)
        this.params.color = colors[8];
      else
        this.params.color = colors[6];
      }
    if(type==="addLeaf"){
      if(this.nbInput%150 === 0){
        this.params.size = 25;
      }
      else if(this.containOneofWords(words.Tristesse, words.Joie))
        this.params.size = 10;
      else if(this.containOneofWords(words.Connaissance, words.Voir) && this.avgValue < 8 )
        this.params.size = 12;
      else if(this.containOneofWords(words.Savoir_faire, words.Entraide) && this.inputValue < 50)
        this.params.size = 14;
      else if(this.containOneofWords(words.Do_It_Yourself,words.Citoyen))
        this.params.size = 15;
      else if(this.containOneofWords(words.Toucher, words.Citoyen))
        this.params.size = 16;
      else if(this.containOneofWords(words.Narration, words.Ecouter, words.Ludique,words.Creation))
        this.params.size = 17;
      else if(this.containOneofWords(words.Narration) && this.avgValue > 20)
        this.params.size = 18;
      else
        this.params.size = 13;
      }
      if(type === "addPoints" || type === "createBranche"){
        if(this.containOneofWords(words.Tristesse, words.Joie))
          this.params.freq = 15;
        else if(this.containOneofWords(words.Connaissance, words.Voir) && this.avgValue < 8 )
          this.params.freq = 16;
        else if(this.containOneofWords(words.Savoir_faire, words.Entraide) && this.inputValue < 50)
          this.params.freq = 17;
        else if(this.containOneofWords(words.Do_It_Yourself,words.Citoyen))
          this.params.freq = 18;
        else if(this.containOneofWords(words.Toucher, words.Citoyen))
          this.params.freq = 19;
        else if(this.containOneofWords(words.Narration, words.Ecouter, words.Ludique,words.Creation))
          this.params.freq = 20;
        else if(this.containOneofWords(words.Narration) && this.avgValue > 20)
          this.params.freq = 21;
        else
          this.params.freq = 15;
        if(this.containOneofWords(words.Tristesse, words.Joie))
          this.params.amplitude = -0.3;
        else if(this.containOneofWords(words.Connaissance, words.Voir) && this.avgValue < 8 )
          this.params.amplitude = 0.3;
        else if(this.containOneofWords(words.Savoir_faire, words.Entraide) && this.inputValue < 50)
          this.params.amplitude = 0.1;
        else if(this.containOneofWords(words.Do_It_Yourself,words.Citoyen))
          this.params.amplitude = 0.2;
        else if(this.containOneofWords(words.Toucher, words.Citoyen))
          this.params.amplitude = -0.2;
        else if(this.containOneofWords(words.Narration, words.Ecouter, words.Ludique,words.Creation))
          this.params.amplitude = -0.5;
        else if(this.containOneofWords(words.Narration) && this.avgValue > 20)
          this.params.amplitude = 0.8;
        else
          this.params.amplitude = -0.4;
      }

  },
  initTrunk: function(){
    var branche = this.treeGlobal.display.branche({
      strokeWidth: 8,
      strokeColor:white,
      points: [{x:oCanvas.Zoom.canvas.width/2, y:0}],
      startPoint: 0,
      trunk: true,
      maxBranches: 5,
      maxLeafs: 0,
      direction: 1,
      maxPoints: 500,
    });
    this.treeGlobal.addChild(branche);
    this.currentBranche = branche;
    this.nbBranches++;
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
    if(base.points.length < base.maxPoints/15 || (base.points.length < base.maxPoints/5 && this.containOneofWords(words.Outil,
                                                                      words.Do_It_Yourself,
                                                                      words.Virtuel,
                                                                      words.Nature))){
      // this.currentBranche = base;
      return "addPoints";
    }
    if (base ===this.treeGlobal.children[0] ){
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

    if (base.maxBranches > base.branches.length && this.avgValue < 10)
      {
        console.log(this.avgValue, this.nbInput);
        // this.currentBranche = base;
        // console.log("creating branche avgValue small enough");
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
      if (this.inputList.indexOf(arguments[i]) != -1)
        return true;
    }
  },
  enlarge: function(branche){

    // branche.strokeWidth += 2.5;
    branche.strokeWidth += 15 / oCanvas.Zoom.level;
    for(var i = branche.branches.length - 1; i>=0; i--){
      for(var j = 0; j < branche.branches[i].leaves.length; j++) {
        // branche.branches[i].leaves[j].size = oCanvas.Zoom.level / 15;
          branche.branches[i].leaves[j].size +=  15 / oCanvas.Zoom.level;
      }
      this.enlarge(branche.branches[i]);
    }
},
parseInput: function(words){
    this.inputValue = 0;
    this.maxValue = 0;
    this.minValue = 0;
    for(let i=0; i<words.length; i++)
    {
        var value = Number(words[i]);
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
