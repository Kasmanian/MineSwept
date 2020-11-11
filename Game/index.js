// generate grid
//add mines randomly 
//add cells
//check cells
// update counters
// timer
//clear clicks
//game states 
//powerups 
//inventory 

var grid = document.getElementById('gridy')
var game =  $('.game')



generate(10)
//rewrite in model view format
//variable map size 
//start with gray boared 
//only allowed to be moved a set distance
//reveal a set distance
//instead of numbers use textures 
//be able to destroy walls
//be able to mark blocks to warn of lava
//lava spread 
//spreads first then player can move
//health system
//add special items

function generateGrid(length) {
    //generate 10 by 10 grid
    grid.innerHTML = "";
    for (var i = 0; i < length; i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < length; j++) {
            cell = row.insertCell(j);
            cell.onclick = function () {
                clickCell(this);
            };
            var lava = document.createAttribute("data-mine");
            lava.value = "false";
            cell.setAttributeNode(lava);
        }
    }
    
    

}
function generate(length) {
    
    auto = ""
    for (var i = 0; i < length; i++) {
        auto = auto +" auto"
    }
   game.css("grid-template-columns", auto);
   game.css("grid-template-rows", auto );
  
 
   
   index = 0
    for (var i = 0; i < length; i++) {
 
        
        
        for (var j = 0; j < length; j++) {
            
            index = index + 1
            game.append(`<button class="cell" id="${index}">  ${index}</button>`)
        }
        $(".cell").css("width", length + "vw" )
        $(".cell").css("height", length + "vw" )
        $(".cell").css("padding-top", ((5/2)/2)+ "vw" )
    }

}
//bind all buttons

//have array of rand num from 0 to max size 

//in button function if certain num change button to lava empty space anything 

//create player button 