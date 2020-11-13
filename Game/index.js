// generate grid
//add mines randomly 

// update counters
// timer
//clear clicks
//game states 
//powerups 
//inventory 


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

var grid = document.getElementById('gridy')
var game =  $('.game')
//list of lava 
var LavaList = []
//make a list for lava spread

//list of all cobble blocks
var cobbleList = []
//list for other things like special items 
var otherList = []
//list of mined out or hollow areas
var hollowList = []
//list of a spaces player can reach and move to
var playerList= []
//current player
//is temp till random gen of player
var player = 1
var length = 10
generate(length)

//clears grid
function clearBoard() {
    game.empty()
    playerList= []
    hollowList = []
    otherList = []
    cobbleList = []
    LavaList = []
}
//generates new grid; calls createSpecial()
function generate(length) {
    clearBoard()
    
    auto = ""
    for (var i = 0; i < length; i++) {
        auto = auto +" auto"
    }
   game.css("grid-template-columns", auto);
   game.css("grid-template-rows", auto );
  
 
   
   index = 0
   //create cobble cells 
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
            
            index = index + 1

            game.append( `<div class="cell" id="${index}" > <button class="but cobble" id="${index}">  ${index}</button></div>`)
            cobbleList.push(index)
            
            
        }
    }
    
    $(".cell").css("width", 100/length + "vw" )
    $(".cell").css("height", 100/length + "vw" )
    $("button.cobble").on('click', pressBut)

    createSpecial(length)
  
    
}

//creates all special blocks lava player items  calls SpawnPlayer()
function createSpecial(length) {
 
    specialList = []
    temp = 0
    while (temp <= 3*length) {
        //get rand num
       rand =  Math.floor(Math.random() * (length*length) + 1)
       //console.log(rand)
        //make sure it doesnt overlap
        empty = true 

        specialList.forEach(x => {
            if (x ==rand) {
                empty = false;
            }
        })
       if(empty) {
           temp++
           specialList.push(rand)
       }
    }
    player = specialList[0]
    lavaList = specialList.slice(1, 2.5*length)
    otherList = specialList.slice(2.5*length, 3*length + 1)
    // console.log(specialList)
    // console.log(lavaList)
    // console.log(otherList)
    specialList.sort(function(a, b){return a-b})

    //create a list of cobble blocks
    for (var i = 0; i < cobbleList.length; i++) {
        for (var j = 0; j < specialList.length; j++) {
            if(cobbleList[i] == specialList[j]) {
                
            cobbleList.splice(i, 1)
                //console.log(ok)
            }
        }
    }
    
SpawnPlayer()
     
}

//spawn player and surround him with lava
function SpawnPlayer() {
    console.log(player)
    //spawn
    cobbleList.push(player)
    removeCobble(player)
    placePlayer(player)
    //for each left right up down around player make sure its not lava 

    adjacents(player).forEach(id=> {
        lavaList.forEach(x=> {
            if(id ==  x) {
                removeLava(x)
                placeCobble(x)
                console.log("pre lava removed at " + x)

            }
        })
    })
}
//get adjacents 
function adjacents(id)  {
    arr = []
    if (id%length != 1 ) {
        left = id-1
        arr.push(left)
    }
    if(id >length) {
        up = id-length
        arr.push(up)
    }
    if(id%length != 0 ) {
        right = id+1
        arr.push(right)
    }
    if(id <= ((length*length) - length)) {
        down = id+length
        arr.push(down)
    }
    return arr

}


//button listener and calls checkListRemove
function pressBut(event) {
    console.log("but")
    id = event.target.id
//make a distance check

  //check list for whats in it  and append
 checkList(id)
 

}

function checkList(id) {
    parent = game.find("#"+ id)
   
    hollowList.forEach(x=> {
        
        if(id ==  x) {
            console.log("hollow")
            removePlayer()
            placeHollow(player)
            removeHollow(x)
            placePlayer(x)
              
        }
    })
    lavaList.forEach(x=> {
        if(id ==  x) {
            console.log("lava")
            removeCobble(x)
            placeLava(x)
        }
    })

    cobbleList.forEach(x=> {
        if(id ==  x) {
            removeCobble(x)
            placeHollow(x)
        }
    })

    otherList.forEach(x=> {
        if(id ==  x) {
            removeCobble(x)
            placeSpecial(x)
        }
    })


}



function removeCobble(id){
    
    //remove from list and from screen
    for (var i = 0; i < cobbleList.length; i++) {
        if (cobbleList[i] == id) {
            cobbleList.splice(i, 1)

        }
    }
    parent = game.find("#"+ id)
    parent.empty()

}
function removeHollow(id){
    //remove from list and from screen
    for (var i = 0; i < hollowList.length; i++) {
        if (hollowList[i] == id) {
            hollowList.splice(i, 1)
            parent = game.find("#"+ id)
            parent.empty()
        }
    }

}
function removeLava(id){
    //remove from list and from screen
    for (var i = 0; i < lavaList.length; i++) {
        if (lavaList[i] == id) {
            lavaList.splice(i, 1)
            parent = game.find("#"+ id)
            parent.empty()
        }
    }

}

function removeSpecial(id){
    //remove from list and from screen
    for (var i = 0; i < otherList.length; i++) {
        if (otherList[i] == id) {
            otherList.splice(i, 1)
            parent = game.find("#"+ id)
            parent.empty()
        }
    }
}
function removePlayer(){
    //remove from list and from screen

    parent = game.find("#"+ player)
    parent.empty()
 
}
function placeCobble(id){
    parent = game.find("#"+ id)
    parent.append(`<button class="but cobble" id="${id}">  ${id}</button>`)
    cobbleList.push(id)
    $("button.cobble").on('click', pressBut)
}
function placeHollow(id){
    parent = game.find("#"+ id)
    parent.append(`<button class="but hollow" id="${id}">  ${id}</button>`)
    hollowList.push(id)
    $("button.hollow").on('click', pressBut)
}
function placeLava(id){
    parent = game.find("#"+ id)
    parent.append(`<button class="but lava" id="${id}">  ${id}</button>`)
    $("button.lava").on('click', pressBut)
    
}
function placeSpecial(id){
    parent = game.find("#"+ id)
    parent.append(`<button class="but special" id="${id}">  ${id}</button>`)
    $("button.special").on('click', pressBut)
    
}
function placePlayer(id){

    parent = game.find("#"+ id)
    parent.append(`<button class="but player" id="${id}">  ${id}</button>`)
    player = id
    $("button.player").on('click', pressBut)
}
//in button function if certain num change button to lava empty space anything 

//create player button 