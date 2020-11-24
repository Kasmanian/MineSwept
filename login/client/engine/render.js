import Game from "./game.js";
import { gamemodes, blocks, items, audio } from "./data.js";

var size = 0;

var game = new Game(gamemodes[window.localStorage.gamemode]);
var user = {
    updated: [],
    display: `./assets/textures/skin.png`,
    movedto: 'nowhere',
    persistance: false,
    stickbuffer: false,
    heartbuffer: false,
    invincible: false,
}
var keys = { 37: 'left', 65: 'left', 38: 'up', 87: 'up', 39: 'right', 68: 'right', 40: 'down', 83: 'down', 
    codify: function(key) {
        switch (this[key]) {
            case 'left':
                return -1;
            case 'up':
                return -game.size();
            case 'right':
                return 1;
            case 'down':
                return game.size();
            default:
                return undefined;
        }
    } 
};
var s = Math.floor(Math.min(window.innerHeight, window.innerWidth)/game.size())-.5;

const renderChunk = function(chunk) {
    let blocks = ``;
    let render = `"grid-template-columns: repeat(${game.size()}, 1fr); 
                      grid-template-rows: repeat(${game.size()}, 1fr);"`;
    for(let coord in chunk) { blocks+=renderBlock(coord); }
    return `<section>
                <div class="container" id="render">
                    <div class="grid" style=${render}>${blocks}</div>
                </div>
            </section>`
}

const renderBlock = function(coord, mark=false) {
    let thespian = game.thespian();
    let hurt = user.healthBuffer? 'hurt' : '';
    let display = thespian.currxy!=coord? '' : 
        `<img id="thespian" src="${user.display}" class="user ${user.movedto} ${hurt}" style="width: ${.9*size}px; height: ${.9*size}px"></img>`;
    let block = blocks[game.rendered()[coord]].id!=9? blocks[game.rendered()[coord]] : blocks[game.unloaded()[coord]];
    let item = blocks[game.rendered()[coord]].id!=9? '' : `<img src="./assets/textures/${items[game.dropsmap()[coord]].name}.png" class="item" style="width: ${.6*size}px; height: ${.6*size}px"></img>`;
    let marker = mark? 'marked' : '';
    let img = mark? 'alert' : block.name;
    return `<div id="block" class="${block.name} #${coord}">
                ${display}
                ${item}
                <img id=${coord} src="./assets/textures/${img}.png" class="block ${marker} ${block.name}">
            </div>`;
}

const renderUnloadedChunk = function(chunk) {
    let divs = '';
    let render = `"grid-template-columns: repeat(${game.size()}, 1fr); 
                      grid-template-rows: repeat(${game.size()}, 1fr);"`;
    for (let coord in chunk) {
        let block = blocks[game.unloaded()[coord]];
        divs+=`<div id="block" class="${block.name} #${coord}">
                        <img id=${coord} src="./assets/textures/${block.name}.png" class="block ${block.name}">
                </div>`;
    }
    return `<section>
                <div class="container" id="render">
                    <div class="grid" style=${render}>${divs}</div>
                </div>
            </section>`
}

const reloadBlock = function(coord, mark=false) {
    let element = document.getElementsByClassName('#'+coord)[0];
    $(renderBlock(coord, mark)).insertAfter(element);
    element.remove();
}

const renderTool = function(coord, animation=false) {
    let scale = `style="max-width: ${.75*size}px; max-height: ${.75*size}px; `;
    let aimto = 'aim-right';
    let id = !animation? 'tool' : 'anmt'
    if (coord-game.thespian().currxy<0) {
        scale += `transform: scaleX(-1);`
        aimto = 'aim-left';
    }
    return `<img id="item_frame" src="./assets/textures/item_frame.png" class="${coord} ${id}" style="max-width: ${size}px; max-height: ${size}px;"></img>
            <img id=${id} src="./assets/textures/pickax.png" class="${coord} pick ${aimto}" ${scale}"></img>`
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
        let element = document.getElementById(coord);
        if (element.classList.contains('marked')) continue;
        if (!element.classList.contains('alert')) element.classList.add('alert');
    }
    return chunk.length > 0;
}

const markBlock = function(coord) {
    let element = document.getElementById(coord);
    if (!element.classList.contains('stone')) return;
    if (element.classList.contains('marked')) {
        reloadBlock(coord);
        alertBlocks(game.thespian().movexy);
    } else reloadBlock(coord, true);
    handleSound('mark'+(Math.ceil(Math.random()*2))+'.ogg');
}

const renderHearts = function() {
    let thespian = game.thespian()
    let health = 5;
    if (thespian.health>5) health = thespian.health;
    let element = document.getElementById('health');
    let hearts = ``;
    for (let i=0; i<health; i++) {
        let heart = thespian.health-i>0? './assets/textures/heart.png' : './assets/textures/empty_heart.png';
        if (thespian.health-i>0&thespian.resist>0) heart = './assets/textures/cold_heart.png';
        let label = thespian.health-i>0? 'heart' : 'empty';
        hearts+= thespian.health>5&label=='empty'? '' : `<img id="heart_${i}" class="heart" src=${heart}></img>`;
    }
    if (element==null) return `<div id="health">${hearts}</div>`;
    $(`<div id="health">${hearts}</div>`).insertAfter(element);
    element.remove();
}

const renderPoints = function() {
    let element = document.getElementById('score');
    if (element==null) return `<div id="score">${game.score()}</div>`;
    $(`<div id="score">${game.score()}</div>`).insertAfter(element);
    element.remove();
}

// const handleGameOver = function(won) {
//     user.invincible = true;
//     won? '' : handleSound('game_lost.oga');
//     let message = won? 'Cave cleared!' : 'You swam in lava...';
//     document.getElementById('health').remove();
//     document.getElementById('score').remove();
//     document.getElementById('thespian').remove();
//     won? update(game.score()) : '';
// }

const handleGameOver = function(won) {
    clearUI(); user.invincible = true;
    if (!won) {
        handleSound('game_lost.oga');
        document.getElementById('root').classList.add('lose-screen');
    } else update(game.score());
    const $leaf = $('#leaf');
    let message = won? 'Cave cleared!' : 'You swam in lava.';
    let button1 = '<div type="button" class="button"><button id="view">View Map</button></div>';
    let button2 = '<div type="button" class="button"><button id="exit">Exit</button></div>';
    $($leaf).append(`<div id="menu"><div id="message">${message}</div><div id="score-final">score: ${game.score()}</div>${button1}${button2}</div>`);
    $($leaf).on('click', '#view', handleClickView);
    $($leaf).on('click', '#exit', handleClickExit);
}

const handleClickView = function(event) {
    const $root = $('#root');
    $($root).empty();
    $($root).append(renderUnloadedChunk(game.unloaded()));
    const $leaf = $('#leaf');
    $($leaf).empty();
    document.getElementById('root').classList.remove('lose-screen');
    document.body.addEventListener('click', handleClickExit, true);
}

const handleClickExit = function(event) {
    window.location.pathname = './client/index.html';
}

const handleKeyPressed = function(event) {
    if (event.keyCode==27) handleClickExit();
    let coord = game.thespian().currxy+keys.codify(event.keyCode);
    if (document.getElementById(coord)==null) return;
    if (!document.getElementById(coord).classList.contains('marked')) {
        let removed = game.rendered()[coord];
        user.stickbuffer = true;
        let thespian = game.thespian();
        let coordlog = game.move(coord, user.persistance);
        if (thespian.lastxy==thespian.currxy) {
            let mineable = document.getElementsByClassName('#'+thespian.aiming)[0].classList.contains('stone');
            if (blocks[game.rendered()[thespian.aiming]].source&mineable) {
                handleSpread(thespian.aiming);
            }
            reloadBlock(thespian.lastxy);
            reloadBlock(thespian.aiming);
            if (game.over()) return handleGameOver(true);
            stupeBlocks([thespian.aiming]);
            if ((blocks[game.rendered()[thespian.aiming]].spread==0|blocks[game.rendered()[thespian.aiming]].source)&mineable) {
                $(renderTool(parseInt(thespian.aiming), true)).insertBefore(document.getElementById(thespian.aiming));
                handleSound('break'+(Math.ceil(Math.random()*4))+'.ogg');
            }
            user.persistance = false;
            if (blocks[game.rendered()[coord]].damage>0) { 
                user.persistance = true;
            } else if (game.dropsmap()[coord]!=-1&!blocks[game.rendered()[coord]].source&removed==9) {
                switch (game.dropsmap()[thespian.aiming]) {
                    case 3:
                        handleSound('jewel.ogg'); break;
                    case 4:
                        handleSound('heart.ogg'); break;
                    default:
                        handleSound('potion.ogg'); break;
                }
            }
            setTimeout(()=> {
                renderHearts();
                if (!user.healthBuffer&game.thespian().resist<1) handleDamage();
            }, 15000)
            renderPoints();
        } else {
            reloadBlock(thespian.lastxy);
            reloadBlock(thespian.currxy);
            stupeBlocks(coordlog);
            alertBlocks(thespian.movexy.filter(x=> game.rendered()[x]==1));
            user.persistance = false;
        }
    }
    user.movedto = no(coord)? user.movedto : keys[event.keyCode];
    if (!user.healthBuffer&game.thespian().resist<1) handleDamage();
    nudge();
    renderHearts();
    setTimeout(()=> {
        unloadTool('anmt');
        unloadTool('item_frame');
        user.stickbuffer = false;
    }, 225 - (game.thespian().speedy>0? 125 : 0));
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
            let coord = event.target.id!='item_frame'? 
                event.target.id : parseInt(event.target.classList[0]);
            markBlock(coord);
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

const handleDamage = async function() {
    user.healthBuffer = true;
    let thespian = game.thespian();
    while (blocks[game.rendered()[thespian.currxy]].damage>0&thespian.health>0&!user.invincible) {
        thespian.health-=blocks[game.rendered()[thespian.currxy]].damage;
        document.getElementById('thespian').classList.add('hurt');
        renderHearts();
        handleSound('hurts1.ogg');
        let element = document.getElementById('heart_'+thespian.health);
        if (element!=null) element.classList.add('hurt');
        if (thespian.health<1) handleGameOver(false);
        await timer(749);
    }
    let element = document.getElementById('thespian')
    if (element!=null) element.classList.remove('hurt');
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
        renderPoints();
        if (!user.healthBuffer&game.thespian().resist<1) handleDamage();
        handleSound('fizz.ogg');
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
    for (let src of Object.keys(audio)) {
        const sound = new Audio(`./assets/sounds/${src}`);
        sound.play().then(()=> {
            sound.pause();
        });
        audio[src] = sound;
    }
    let n = Math.ceil(Math.random()*19);
    handleSound('cave'+n+(n!=19? '.oga' : '.ogg'));
    const coord = parseInt(event.target.id);
    size = document.getElementById(event.target.id).offsetWidth;
    const $root = $('#root');
    const $game = $('#game');
    $($root).off('click', '.block', initialize);
    game.load(coord);
    $($root).empty();
    $($root).append(renderChunk(game.rendered()));
    alertBlocks(game.thespian().movexy.filter(x=> game.rendered()[x]==1));
    $($game).append(renderHearts());
    $($game).append(renderPoints());
    $($root).on('mousedown', '#item_frame', handleClickBlock);
    $($root).on('mousedown', '.block', handleClickBlock);
    $($root).on('mouseover', '.block', handleHoverAlert);
    $($root).on('contextmenu', function(e) {
        e.preventDefault();
        handleClickBlock(e);
        return false;
    }, false);
}

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

const clearUI = ()=> {
    const $root = $('#root'); $($root).off();
    document.onkeydown = ()=>{};
    document.getElementById('health').remove();
    document.getElementById('score').remove();
    document.getElementById('thespian').remove();
}

async function update(score) {
    const result = await axios({
        method: 'post',
        url: '/finish',
        data: { name: window.localStorage.user, mode: window.localStorage.gamemode, score: score },
    });
    return await result;
}