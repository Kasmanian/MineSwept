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

generateGrid();
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
function generateGrid() {
    //generate 10 by 10 grid
    grid.innerHTML = "";
    for (var i = 0; i < 10; i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < 10; j++) {
            cell = row.insertCell(j);
            cell.onclick = function () {
                clickCell(this);
            };
            var lava = document.createAttribute("data-mine");
            lava.value = "false";
            cell.setAttributeNode(lava);
        }
    }
    addLava();
}