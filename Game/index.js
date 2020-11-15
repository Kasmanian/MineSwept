
//powerups 
//inventory 


//rewrite in model view format

//instead of numbers use textures 

//be able to mark blocks to warn of lava
//lava spread 
//spreads first then player can move
//health system
//add special items

var game =  $('.game')
var stats = $('.stats')
//list of lava 
var lavaList = []


//make a list for lava spread
var lavaSpreadList =[]

//list of all cobble blocks
var cobbleList = []

//list for other things like special items 
var otherList = []
//list of mined out or hollow areas
var hollowList = []
//list of a spaces player can reach and move to
var playerList= []





//position
var player = 1
var health = 5
var fireResist = 0
var onTop = "hollow"





var length = 10
var mineDelay = 3
var stop = true
var randomizedDetection = true

generate()



document.onkeydown = function (e) {
    e = e || window.event;

    //console.log(e.key)
    if(stop) {
        if (e.key == "s"){
            arrowBut(player-1+1+length)
        } else if (e.key == "w"){
            arrowBut(player-length)
        } else if (e.key == "a"){
            arrowBut(player-1)
        } else if (e.key == "d"){
            arrowBut(player-1+2)
        }
    }


};

//clears grid
function clearBoard() {
    game.empty()
    playerList= []
    hollowList = []
    otherList = []
    cobbleList = []
    LavaList = []
    lavaSpreadList =[]
   player = 1
 health = 5
 fireResist = 0
 onTop = "hollow"

}

//generates new grid; calls createSpecial()
function generate() {
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

            game.append( `<div class="cell" id="${index}" > <button class="but cobble" id="${index}">  <img class="but" id="${index}" src="assets/tiles/cobblestone.png" alt="cobble"> </button></div>`)
            cobbleList.push(index)
            
            
        }
    }
    $(".cell").css("width", 100/length + "vw" )
    $(".img").css("width", 100/length + "vw" )
    $(".cell").css("height", 100/length + "vw" )
    $("button.cobble").on('click', pressBut)
   
    
    createSpecial(length)
  
    status()
}

//creates all special blocks lava player items  calls SpawnPlayer()
function createSpecial(length) {
 
    specialList = []
    temp = 0
    while (temp <= length) {
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
    lavaList = specialList.slice(1, specialList.length*2 /3)
    otherList = specialList.slice(specialList.length*2 /3, 3*length + 1)
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
setSpreadLava()
replaceCobble(player)
console.log(player)
console.log(lavaList)
console.log(lavaSpreadList)

}

//spawn player and surround him with lava
function SpawnPlayer() {
    //console.log(player)
    //spawn
    console.log("spawn player")
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
                for (var i = 0; i < lavaList.length; i++) {
                    if (lavaList[i] == x) {
                        lavaList.splice(i, 1)
                        
                    }
                }
                replaceCobble(x)
                //test
                replaceCobble(player)

            }
        })
    })
}

function setSpreadLava() {
//finds lava adj
console.log("spreaded")
    lavaList.forEach(lava=>{
        adjacents(lava).forEach(near=>{

            proceed = true
            //this should prevent overlap ove spread
            lavaSpreadList.forEach(same=>{
                if(near == same){
                    proceed = false
                }
                
            })
            //if on lava 
            lavaList.forEach(same=>{
                if(near == same){
                    proceed = false
                }
                
            })
            //if player
            
            // if(player == near){
            //     proceed = false
            // }
                
           
            if(proceed) {
                lavaSpreadList.push(near)
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
        right = id-1+2
        arr.push(right)
    }
    if(id <= ((length*length) - length)) {
        down = id-1+1+length
        arr.push(down)
    }
    return arr

}


function status() {
    stats.find(".stat").remove()
    stats.append(`<div class = "stat"id="haste">${mineDelay}</div>`)
    stats.append(`<div class = "stat" id="health">${health}
    </div>`)
    stats.append(`<div class = "stat" id="fireresist">${fireResist}</div>`)
}


function consumeBuff() {
   rand = Math.floor(Math.random()*3)

    //haste postion 
    if(rand ==0) {
        haste()
    //heal potion 
    } else  if(rand ==1) {
        healthTaken()
    //fire resistance 
    } else  if(rand ==2) {
        addFireResist()
    } 
   
   }
function damageTaken() {
    health = health -1
    if(health <= 0) {
        stats.find(".msg").remove()
        stats.append(`<div class="msg" >Rip Ya Death, hit restart to try again</div>`)
        alert("dead")
        stop = false

    }
    stats.find(".msg").remove()
    stats.append(`<div class="msg" >OUCH!</div>`)
}
function haste() {
    mineDelay = mineDelay/2
    stats.find(".msg").remove()
    stats.append(`<div class="msg" >POOOOWWWEEERR OVEERRWHHEELLLMINGG!!</div>`)
}
function healthTaken() {
    health = health +10
    stats.find(".msg").remove()
    stats.append(`<div class="msg" >Potion of HEALING</div>`)
}

function addFireResist() {
    fireResist = fireResist + 5
    stats.find(".msg").remove()
    stats.append(`<div class="msg" > FIRERESISTANCE!!</div>`)
}

function tickFireResist() {
    fireResist = fireResist -1
}

function onFire() {
    if(fireResist <= 0) {
        
        damageTaken()
    } else {
        fireResist = fireResist-1
    }
}



//button listener and calls checkListRemove
function pressBut(event) {
    //console.log("but", event)
    id = event.target.id
    arrowBut(id)

}

//same thing as pressBut() but with arrowKeys
function arrowBut(id) {
    

console.log("")

  //check list for whats in it  and append   
    //make a distance check
    adjacents(player).forEach(x=>{
        if (x==id) {
            //reveals the
            checkList2(id)
            //id is the minedblock at this point
            // revealLava(id)
            // revealSpecial(id)
            spreadLava()
        }
    })
    lavaList.forEach(x=> {
        lavaSpreadList.forEach(y=>{
            if (x==y) {
                alert("overlap at" + x)
            }
        })
    })
    status()
}
function revealSpecial(id){
    
    adjacents(id).forEach(reveal => {
        //console.log(reveal)
        otherList.forEach(special => {
            if (reveal == special) {
                removeCobble(reveal)
                placeSpecial(reveal)
                
                spreadLava()
            }
        })
    } )
}
function revealLava(id){
    
    adjacents(id).forEach(reveal => {
        
        lavaList.forEach(lava => {
            if (reveal == lava) {
                
                //checkList(reveal)
                
                if (reveal != player) {
                    removeCobble(reveal)
                    placeLava(reveal)
                    //console.log("Reveal lava")
                }
                
                spreadLava()
            }
        })
    } )
}

function checkList2(id) {
    parent = game.find("#"+ id)
    once = true
    //player movement 
   if (once ) {
        hollowList.forEach(x=> {
        
        if(id ==  x) {

            //console.log("in hollow")
            removePlayer()
            decidePlaceBlock()
            onTop = "hollow"
            removeHollow(x)
            placePlayer(x)
            once = false
        }
        })
    }

    if (once ) {
        cobbleList.forEach(x=> {
            if(id ==  x) {

                mineCobble(x)

                once = false
                

            }
        })
    }
    if (once ) {
        
        lavaSpreadList.forEach(x=> {
            if(id ==  x) {
                adjacents(x).forEach(gold =>{
                    if (gold==player){
                        console.log("in spread")
                        removePlayer()
                        decidePlaceBlock()
                        onTop = "spread"
                        removeLavaSpread(x)
                        placePlayer(x)
                        once = false
                        onFire()

                        
                        
                    }
                })
       
                
            }
        })
    }
    if (once ) {
        lavaList.forEach(x=> {
            if(id ==  x) {
                adjacents(x).forEach(gold =>{
                    
                    if (gold==player){
                        console.log("in lava")
                        removePlayer()
                        decidePlaceBlock()
                        onTop = "lava"
                        removeLava(x)
                        placePlayer(x)
                        once = false
                       onFire()

                        
                        
                    }
                })
       
                
            }
        })
    }
    if (once ) {
        otherList.forEach(x=> {
            if(id ==  x) {
                adjacents(x).forEach(gold =>{
                    if (gold==player){
                        onTop= "hollow"
                        removePlayer()
                        decidePlaceBlock()
                        removeSpecial(x)
                        placePlayer(x)
                        consumeBuff(x)
            
                        once = false
                    }
                })
       
                
            }
        })
    }
    spreadLava()
}
function decidePlaceBlock() {
    if (onTop == "hollow") {
        placeHollow(player)
    } else if (onTop == "spread") {
        placeLavaSpread(player)
    } else if (onTop == "lava") {
        placeLava(player)
    }
}


function mineCobble(id){
    
    parent = game.find("#"+ id)
    parent.empty()

    
    parent.append(`<button class="but cobble mine" id="${id}">  <img class="but cobble"src="assets/tiles/cobblestone.png" alt="cobble"> </button>`)
    $(".mine").css("animation-duration",  mineDelay+"s" )

    stop = false
    setTimeout(function(){
        removeCobble(id)
        placeHollow(id)
        revealLava(id)
        revealSpecial(id)
        replaceCobble(id)
        stop = true
    }, mineDelay*1000); 
    

}

function spreadLava() {
    //gets adjacents for each lava
    lavaList.forEach(lava => {
        adjacents(lava).forEach(lavaAdja => {
            //fills in holo spots
            hollowList.forEach(hol=> {
                if (hol == lavaAdja) {
                    //makes sure its not a a lava spot
                    proceed = true
                    lavaList.forEach(fellowSpot => {
                        if (hol ==fellowSpot) {
                            proceed = false
                        }
                    })
                    if(proceed) {
                        removeHollow(hol)
                        placeLavaSpread(hol)
                    }
                   
                    

                }
            })
        })
    })
}
//check if a cobble should be replaced with a lavacobble
//so if the destroyed block is adj to a lavablock and is a cobble block
function replaceCobble(id) {
    //adjacents to current block
    
    adjacents(id).forEach(adj=>{
        //adjacent to lava 
       
        lavaList.forEach(lav=> {
            adjacents(lav).forEach(lavadj=>{

                //checks if adj is adj to lava
                if(adj == lavadj){
                    //if adj is in cobblelist
                    cobbleList.forEach(cobb=> {

                        if (cobb== adj) {
                            console.log("replacing")
                            removeCobbleForLavaCobble(adj)
                            replaceWithLavaCobble(adj)
                        }

                    })
                }

            })

        })
 
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

function removeCobbleForLavaCobble(id) {
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
            //lavaList.splice(i, 1)
            parent = game.find("#"+ id)
            parent.empty()
        }
    }

}
function removeLavaSpread(id){
    //remove from list and from screen
    for (var i = 0; i < lavaSpreadList.length; i++) {
        if (lavaSpreadList[i] == id) {
            //lavaSpreadList.splice(i, 1)
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
function removeBurning(){
    parent = game.find("#"+ player)
    parent.empty()
}





function placeCobble(id){
    parent = game.find("#"+ id)
    parent.append(`<button class="but cobble" id="${id}">  <img class="but cobble" id="${id}" src="assets/tiles/cobblestone.png" alt="cobble"> </button>`)
    cobbleList.push(id)
    $("button.cobble").on('click', pressBut)
}
function replaceWithLavaCobble(id) {
    parent = game.find("#"+ id)
    rand = 0
    if (randomizedDetection) {
        rand = Math.floor(Math.random()*2)
    }
    
    if(rand ==0) {
        parent.append(`<button class="but cobble" id="${id}">  <img class="but" id="${id}" src="assets/tiles/marked_3.png" alt="cobble"> </button>`)
    } else    if(rand ==1) {
        parent.append(`<button class="but cobble" id="${id}">  <img class="but" id="${id}" src="assets/tiles/marked_2.png" alt="cobble"> </button>`)
    } else    if(rand ==2) {
        parent.append(`<button class="but cobble" id="${id}">  <img class="but cobble" id="${id}" src="assets/tiles/cobblestone.png" alt="cobble"> </button>`)
    } 
    cobbleList.push(id)
    $("button.cobble").on('click', pressBut)
}
function placeHollow(id){
    parent = game.find("#"+ id)
    parent.append(`<button class="but hollow" id="${id}"> <img class="but" id="${id}" src="assets/tiles/stone.png" alt="cobble"> </button>`)
    hollowList.push(id)
    $("button.hollow").on('click', pressBut)
}
function placeLava(id){
    console.log("pressed lava")
    parent = game.find("#"+ id)
    parent.append(`<button class="but lava" id="${id}"> </button>`)
//<img class="but"src="assets/tiles/marked_3.png" alt="cobble">

    $("button.lava").on('click', pressBut)
    
}
function placeLavaSpread(id){
    console.log("pressed spread")
    parent = game.find("#"+ id)

    parent.append(`<button class="but lavaSpread" id="${id}"> </button>`)
//<img class="but"src="assets/tiles/marked_2.png" alt="cobble">
    
    $("button.lavaSpread").on('click', pressBut)
    
}

function placeSpecial(id){
    parent = game.find("#"+ id)
    parent.append(`<button class="but special" id="${id}">  ${id}</button>`)
    $("button.special").on('click', pressBut)
    
}
function placePlayer(id){

    parent = game.find("#"+ id)
    parent.append(`<button class="but player" id="${id}">  <img class="but player" id="${id}" src="assets/playerheads/playerhead_alex.png" alt="head"></button>`)
    //console.log("player placed")
    player = id
    
    $("button.player").on('click', pressBut)
}



//to implement 


//actual database stuff 
    //maybe seperate load screen thing 
    //link textures system 

    //player chosen spawning 
        //clears all adjacent blocks 

    //custimizable textures for amount of lavapits 

    //mark blocks 

    //buffs to implement 
        //water 
        //dynamte

    //when destroying lavacobble animate it with lavacobble
    //deactive mouse movement when dead
    