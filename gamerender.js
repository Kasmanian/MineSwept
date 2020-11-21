import Game from "./engine/game.js";
import { gamemodes, blocks, audio } from "./engine/data.js";

var game = new Game(gamemodes.hard);
var user = {
    updated: [],
    display: `./assets/skin.png`,
    movedto: 'nowhere',
    persistance: false,
    stickbuffer: false,
    heartbuffer: false,
}
var keys = { 37: 'left', 65: 'left', 38: 'up', 87: 'up', 39: 'right', 68: 'right', 40: 'down', 83: 'down' };
var s = Math.floor(Math.min(window.innerHeight, window.innerWidth)/game.size())-1;

const renderChunk = function(chunk) {
    let blocks = ``;
    let render = `"grid-template-columns: repeat(${game.size()}, ${s}px); 
                      grid-template-rows: repeat(${game.size()}, ${s}px);"`;
    for(let coord in chunk) { blocks+=renderBlock(coord); }
    return `<section>
                <div class="container" id="render">
                    <div class="grid" style=${render}>${blocks}</div>
                </div>
            </section>`
}

const renderBlock = function(coord) {
    let thespian = game.thespian();
    let hurt = user.healthBuffer? 'hurt' : '';
    let display = thespian.currxy!=coord? '' : 
        `<img id="thespian" src="${user.display}" class="user ${user.movedto} ${hurt}" style="max-width: ${.9*s}px; max-height: ${.9*s}px;"></img>`;
    let block = blocks[game.rendered()[coord]];
    return `<div id="block" class="${block.name} #${coord}">${display}
                <img id=${coord} src="./assets/${block.name}.png" class="block" style="min-width: ${s}px; min-height: ${s}px;">
            </div>`;
}

const reloadBlock = function(coord) {
    let element = document.getElementsByClassName('#'+coord)[0];
    $(renderBlock(coord)).insertAfter(element);
    element.remove();
}

const renderTool = function(coord, animation=false) {
    let scale = `style="max-width: ${.8*s}px; max-height: ${.8*s}px; `;
    let aimto = 'aim-right';
    let id = !animation? 'tool' : 'anmt'
    if (coord-game.thespian().currxy<0) {
        scale += `transform: scaleX(-1);`
        aimto = 'aim-left';
    }
    return `<img id="item_frame" src="./assets/item_frame.png" class="${coord} ${id}" style="max-width: ${s}px; max-height: ${s}px;"></img>
            <img id=${id} src="./assets/pickax.png" class="${coord} pick ${aimto}" ${scale}"></img>`
}

const unloadTool = function(id) {
    let element = document.getElementById(id);
    if (element!=null) element.remove();
}

const stupeBlocks = function(chunk) {
    unloadTool('tool');
    for (let coord of chunk) {
        document.getElementById(coord).classList.remove('alert');
    }
    return chunk.length > 0;
}

const alertBlocks = function(chunk) {
    for (let coord of chunk) {
        document.getElementById(coord).classList.add('alert');
    }
    return chunk.length > 0;
}

const renderHearts = function() {
    let thespian = game.thespian()
    let health = 5;
    if (thespian.health>5) health = thespian.health;
    let element = document.getElementById('health');
    let hearts = ``;
    for (let i=0; i<health; i++) {
        let heart = thespian.health-i>0? './assets/heart.png' : './assets/empty_heart.png';
        let label = thespian.health-i>0? 'heart' : 'empty';
        hearts+= thespian.health>5&label=='empty'? '' : `<img id="heart_${i}" class=${label} src="${heart}"></img>`;
    }
    if (element==null) return `<div id="health">${hearts}</div>`;
    $(`<div id="health">${hearts}</div>`).insertAfter(element);
    element.remove();
}

const handleGameOver = function() {
    
}

const handleKeyPressed = function(event) {
    if (no(keys[event.keyCode])) return;
    user.stickbuffer = true;
    let thespian = game.thespian();
    let coordlog = game.move(event.keyCode, user.persistance);
    if (thespian.lastxy==thespian.currxy) {
        let mineable = document.getElementsByClassName('#'+thespian.aiming)[0].classList.contains('stone');
        if (blocks[game.rendered()[thespian.aiming]].source&mineable) {
            handleSpread(thespian.aiming);
        }
        reloadBlock(thespian.lastxy);
        reloadBlock(thespian.aiming);
        stupeBlocks([thespian.aiming]);
        if ((blocks[game.rendered()[thespian.aiming]].spread==0|blocks[game.rendered()[thespian.aiming]].source)&mineable) {
            $(renderTool(parseInt(thespian.aiming), true)).insertBefore(document.getElementById(thespian.aiming));
            handleSound('break'+Math.ceil(Math.random()*4));
        }
        user.persistance = true;
    } else {
        reloadBlock(thespian.lastxy);
        reloadBlock(thespian.currxy);
        stupeBlocks(coordlog);
        alertBlocks(thespian.movexy.filter(x=> game.rendered()[x]==1));
        user.persistance = false;
    }
    user.movedto = no(keys[event.keyCode])? user.movedto : keys[event.keyCode];
    if (!user.healthBuffer) handleDamage();
    nudge();
    setTimeout(()=> {
        unloadTool('anmt');
        unloadTool('item_frame');
        user.stickbuffer = false;
    }, 225);
}

const handleClickBlock = function(event) {
    switch (event.which) {
        case 1:
            handleMine(parseInt(event.target.classList[0]));
            break;
        case 2:
            alert('Middle Mouse button pressed.');
            break;
        case 3:
            console.log('Right Mouse button pressed.');
            break;
        default:
            alert('You have a strange Mouse!');
    }
}

const handleMine = function(coord) {
    switch (coord-game.thespian().currxy) {
        case -1:
            handleKeyPressed({ keyCode: 37 }); break;
        case -game.size():
            handleKeyPressed({ keyCode: 38 }); break;
        case 1:
            handleKeyPressed({ keyCode: 39 }); break;
        case game.size():
            handleKeyPressed({ keyCode: 40 }); break;
    }
}

const handleClear = function(event) {

}

const handleDamage = async function() {
    user.healthBuffer = true;
    let thespian = game.thespian();
    while (blocks[game.rendered()[thespian.currxy]].damage>0&thespian.health>0) {
        thespian.health-=blocks[game.rendered()[thespian.currxy]].damage;
        document.getElementById('thespian').classList.add('hurt');
        renderHearts();
        handleSound('hurts1');
        let element = document.getElementById('heart_'+thespian.health);
        if (element!=null) element.classList.add('hurt');
        await timer(749);
    }
    document.getElementById('thespian').classList.remove('hurt');
    if (thespian.health<1) handleGameOver();
    user.healthBuffer = false;
}

const handleSpread = async function(coord) {
    let queue = [coord];
    let block = blocks[game.rendered()[coord]];
    while (queue.length>0) {
        let result = game.spread(queue, block);
        queue = result.next;
        user.movedto = 'nowhere';
        for (let coord of result.load) {
            reloadBlock(coord);
        }
        if (!user.healthBuffer) handleDamage();
        handleSound('fizz');
        await timer(750);
        block = blocks[block.id-1];
    }
}

const handleHoverAlert = function(event) {
    unloadTool('tool');
    unloadTool('item_frame');
    if (document.getElementById(event.target.id).classList.contains('alert')) {
        $(renderTool(parseInt(event.target.id))).insertBefore(event.target);
    }
}

const handleSound = function(src) {
    const sound = audio[src];
    if (!sound.paused) {
        audio[src] = new Audio(sound.src);
    }
    audio[src].play();
}

const loadBoardIntoDOM = function(game) {
    const $root = $('#root');
    $($root).append(renderChunk(game.rendered()));
    $($root).on('click', '.block', initialize);
    
    document.onkeydown = function(e) {
        e.preventDefault();
        if (!user.stickbuffer) {
            handleKeyPressed(e);
        }
    };
};

const initialize = function(event) {
    const coord = parseInt(event.target.id);
    const $root = $('#root');
    $($root).off('click', '.block', initialize);
    game.load(coord);
    $($root).empty();
    $($root).append(renderChunk(game.rendered()));
    alertBlocks(game.thespian().movexy.filter(x=> game.rendered()[x]==1));
    $($root).append(renderHearts());
    $($root).on('mousedown', '#item_frame', handleClickBlock);
    $($root).on('mouseover', '.block', handleHoverAlert);
    $($root).on('contextmenu', function(e) {
        e.preventDefault();
        handleClickBlock(e);
        return false;
    }, false);
    for (let src of Object.keys(audio)) {
        const sound = new Audio(`./assets/sounds/${src}.ogg`);
        sound.play().then(()=> {
            sound.pause();
        });
        audio[src] = sound;
    }
}

// game.on('move', (state)=> {

// });

$(function() {
    loadBoardIntoDOM(game);
});

const timer = ms => new Promise(res => setTimeout(res, ms));

const nudge = function() {
    let element = document.getElementById('thespian');
    element.classList.remove('left', 'up', 'right', 'down');
    setTimeout(()=>{
        element.classList.add(user.movedto);
    }, 50);
}

const no = (o)=> { return o===undefined; }