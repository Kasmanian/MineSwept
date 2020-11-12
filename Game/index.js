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


generate(10)


function clearBoard() {
    game.empty()
    playerList= []
    hollowList = []
    otherList = []
    cobbleList = []
    LavaList = []
}

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
 //create an array of indexes of lava
         //first 3/4 of length is lava 
            //rest is other
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
    lavaList = specialList.slice(0, 2.5*length)
    otherList = specialList.slice(2.5*length, 3*length + 1)
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
    
    //slice list or rands to other array

    
   // console.log(lavaList)
    //console.log(otherList)
    // console.log(cobbleList)
    // console.log(specialList)
    // console.log(cobbleList.concat(specialList).sort(function(a, b){return a-b}))
     
}

function pressBut(event) {
    id = event.target.id
  parent = game.find("#"+ id)
  parent.empty()
  //check list for whats in it  and append
 checkList(id)
 

}

function checkList(id) {
    parent = game.find("#"+ id)
    lavaList.forEach(x=> {
        if(id ==  x) {
            //intiate spread to other open spaces aswell
            parent.append(`<button class="but lava" id="${x}">  ${x}</button>`) 
            return
        }
    })

    cobbleList.forEach(x=> {
        if(id ==  x) {
            //remove block aswell
              parent.append(`<button class="but hollow" id="${x}">  ${x}</button>`)
              return
        }
    })

    otherList.forEach(x=> {
        if(id ==  x) {
            //remove block aswell
              parent.append(`<button class="but special" id="${x}">  ${x}</button>`)
              return
        }
    })

    hollowList.forEach(x=> {
        
        if(id ==  x) {
            console.log("here")
            //replace player with hollow  
              parent.append(`<button class="but hollow player" id="${x}">  ${x}</button>`)
              return
        }
    })
}



//in button function if certain num change button to lava empty space anything 

//create player button 