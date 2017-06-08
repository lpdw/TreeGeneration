var count_input = 0;
var point_input= 0;
var list_input = [1,1,1,1,1,1,1];

$('body').keypress(function() {
  count_input++;
  switch (count_input){
    case 1 :
      //function drawTree1()
      break;
    case 2 :
      //function drawTree2()
      break;
    case 3 :
      //function drawTree3()
      break;
    case 4 :
      //function drawTree4()
      break;
    default:
      point_input = traitementInput(list_input);

      /* TODO
      Si branche existe
        alors compte feuille
        si trop feuille
          créer nouveau branche
            ajouter feuille

      si branche dosn't existe
        créer nouveau branche
          ajouter feuille
      */

      break;
  }


});

function traitementInput(input)
{
  let point_input = 0;
  for(let i=0; i<input.length; i++)
  {
      point_input = point_input + Number(input[i]);
  }

  return point_input;
}

var algo = {
  //branches = [],
  generate: function(tree, datas){
    tree.display.branche({})
  }
}
