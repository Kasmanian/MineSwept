import { invalids, blocks } from "./data.js"

export default function Game(gamemode, snapshot=undefined) {

    // gamemode is a JSON-style object that specifies objects with fields of 
    // {ID : count} mobstacles, loot_table, and items_list where
    // gamemode = {harm: [], loot: [], hbar: []}

    // the snapshot when defined is an array containing the player object,
    // an array of tiles, and the current game-state, supports game-save 
    // functionality
    
    // the player object
    var thespian = no(snapshot)? 
    {
        health: 5,
        points: 0,
        aiming: -1,
        lastxy: -1,
        currxy: -1,
        movexy: [],
        hotbar: gamemode.hbar,
        active: gamemode.hbar[0].ID,
    } : snapshot[0];

    // an array of tiles
    var chunkmap = no(snapshot)? new Array(gamemode.size*gamemode.size).fill(1) : snapshot[1];

    var keybinds = no(snapshot)? { 
        37: -1,
        65: -1,
        38: -gamemode.size,
        87: -gamemode.size,
        39: 1,
        68: 1,
        40: gamemode.size,
        83: gamemode.size,
    } : snapshot[2];

    // { move: [], mine: [], mark: [], swap: [], drop: [], feat: [], lose: [] }
    this.extract = {
        gamemode: gamemode,
        snapshot: snapshot,
        keybinds: keybinds,
        thespian: thespian,
        blockmap: { unloaded: new Array(gamemode.size*gamemode.size).fill(0), rendered: [...chunkmap] },
        magmamap: [],
        dropsmap: [],
        listener: {},
        continue: true,
    }
}

// public methods

Game.prototype.on = function(event, CB) {
    const listener = this.extract.listener;
    listener[event] = no(listener[event])? [] : listener[event];
    listener[event].push(CB);
}

Game.prototype.load = function(center) {
    const chunk = this.unloaded();
    const r = this.size();
    for (let h of this.gamemode().harm) {
        let count = h.count;
        while (count>0) {
            let n = Math.floor(Math.random()*r*r);
            if (blocks[chunk[n]].damage>0 | overlap(center, n, r)) continue;
            let perim = this.perimeter(n, r);
            if (valid(perim)) {
                chunk[n] = h.ID;
                for (let p of perim) {
                    let ID = chunk[p]==0? 1 : chunk[p];
                    chunk[p] = chunk[p]>4? chunk[p] : ID+1;
                }
                count--;
            }
        }
    }
    this.thespian().lastxy = center;
    this.thespian().currxy = center;
    this.thespian().movexy = this.perimeter(center, r, false);
    this.clear(center);
    chunk;
}

Game.prototype.clear = function(center) {
    const rendered = this.rendered();
    const unloaded = this.unloaded();
    const r = this.size();
    let match = 1000;
    let count = Math.ceil(rendered.length*.05);
    let queue = [center];
    while (count>0 & match>0) {
        let n = queue.pop();
        if (blocks[unloaded[n]].height>-1) {
            rendered[n] = unloaded[n]==1? 0 : unloaded[n];
            count--; 
        }
        queue.push(sibling(this.perimeter(n, r, false), n, r));
        match--;
    }
    return rendered;
}

Game.prototype.spread = function(queue=[], block) {
    let coord = -1;
    let rendered = this.rendered();
    let perim = [];
    let renew = [];
    while (queue.length>0) {
        coord = queue.pop();
        rendered[coord] = blocks[block.id-1].name!=block.name|blocks[rendered[coord]].source? block.id : blocks[block.id-1].id;
        renew.push(coord);
        perim = [...perim, ...this.perimeter(coord, this.size(), false)];
    }
    return block.spread>0? 
    { next: perim.filter(coord=> !blocks[rendered[coord]].isFluid&rendered[coord]!=1), load: renew } : 
    { next: [], load: renew };
}

Game.prototype.move = function(direction, persistance=false) {
    let thespian = this.thespian();
    let rendered = this.rendered();
    let newxy = thespian.currxy+this.extract.keybinds[direction];
    let block = blocks[rendered[newxy]];
    let oldxy = thespian.currxy;
    let perim = [...thespian.movexy];
    let coord = perim.indexOf(newxy);
    if (coord>-1) {
        if ((block.isWalkable|persistance|!blocks[rendered[oldxy]].isWalkable)&blocks[rendered[newxy]].height<2) {
            thespian.lastxy = oldxy;
            thespian.currxy = newxy;
            thespian.movexy = this.perimeter(newxy, this.size(), false);
            return perim;
        } else {
            thespian.lastxy = oldxy;
            return blocks[rendered[newxy]].isMineable? this.mine(newxy) : this.take(newxy);
        }
    } else {
        thespian.aiming = oldxy;
        return [];
    }
}

Game.prototype.mine = function(direction) {
    if (this.rendered()[direction]==this.unloaded()[direction]) return [direction];
    this.thespian().aiming = direction;
    this.rendered()[direction] = this.unloaded()[direction];
    if (blocks[this.rendered()[direction]].source) this.magmamap().push(direction);
    return [direction];
}

Game.prototype.take = function(direction) {
    this.thespian().aiming = direction;
    console.log("I'm taking away!");
    return [direction];
}

Game.prototype.update = function(handler='all') {
    if (handler=='all') {
        let handlers = this.extract.listener.keys();
        for (let handler of handlers) {
            for (let h of this.extract.listener[handler]) {
                h(this.extract);
            }
        }
    } else {
        for (let h of this.extract.listener[handler]) {
            h(this.extract);
        }
    }
}

// private methods

Game.prototype.notify = function(handlers) {
    const state = this.extract;
    for (let handle of handlers) { handle(state); }
}

// compact methods

const no = (object)=> { return object===undefined; }

const overlap = (c1, c2, r, d=3)=> {
    let x = c2%r - c1%r;
    let y = Math.floor(c2/r) - Math.floor(c1/r);
    return d > Math.sqrt((x*x)+(y*y));
}

const sibling = (arr, c1, r)=> {
    while (arr.length > 0) {
        let c2 = arr[Math.floor(Math.random()*arr.length)];
        if (overlap(c1, c2, r, 2)) return c2;
        arr.splice(arr.indexOf(c2), 1);
    }
    return c1;
}

const valid = (arr)=> {
    for (let a of arr) {
        if (!no(invalids[a])) return false;
    }
    return true;
}

Game.prototype.perimeter = (center, r, corner=true)=> {
    let U = false;
    let D = false;
    let L = false;
    let R = false;
    let perim = [];
    if (center-r>=0) {
        perim.push(center-r); U = true;
    }
    if (center+r<r*r) {
        perim.push(center+r); D = true;
    }
    if (center%r!=0) {
        perim.push(center-1); L = true;
    }
    if (center%r!=r-1) {
        perim.push(center+1); R = true;
    }
    if (!corner) return perim;
    if (U&L) {
        perim.push(center-r-1);
    }
    if (U&R) {
        perim.push(center-r+1);
    }
    if (D&L) {
        perim.push(center+r-1);
    }
    if (D&R) {
        perim.push(center+r+1);
    }
    return perim;
}

Game.prototype.compare = function(n) {
    return this.extract.blockmap.rendered[n] == this.extract.blockmap.unloaded[n];
}

Game.prototype.rendered = function() {
    return this.extract.blockmap.rendered;
}

Game.prototype.unloaded = function() {
    return this.extract.blockmap.unloaded;
}

Game.prototype.magmamap = function() {
    return this.extract.magmamap;
}

Game.prototype.gamemode = function() {
    return this.extract.gamemode;
}

Game.prototype.thespian = function() {
    return this.extract.thespian;
}

Game.prototype.size = function() {
    return this.extract.gamemode.size;
}