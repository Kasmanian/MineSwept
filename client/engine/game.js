import { invalids, blocks, items } from "./data.js"

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
        resist: 0,
        speedy: 0,
        aiming: -1,
        lastxy: -1,
        currxy: -1,
        movexy: [],
        hotbar: gamemode.hbar,
        active: gamemode.hbar[0].ID,
    } : snapshot[0];

    // an array of tiles
    var chunkmap = no(snapshot)? new Array(gamemode.size*gamemode.size).fill(1) : snapshot[1];

    // var keybinds = no(snapshot)? { 
    //     37: -1,
    //     65: -1,
    //     38: -gamemode.size,
    //     87: -gamemode.size,
    //     39: 1,
    //     68: 1,
    //     40: gamemode.size,
    //     83: gamemode.size,
    // } : snapshot[2];

    // { move: [], mine: [], mark: [], swap: [], drop: [], feat: [], lose: [] }
    this.extract = {
        gamemode: gamemode,
        snapshot: snapshot,
        // keybinds: keybinds,
        thespian: thespian,
        blockmap: { unloaded: new Array(gamemode.size*gamemode.size).fill(0), rendered: [...chunkmap] },
        dropsmap: new Array(gamemode.size*gamemode.size).fill(-1),
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
    const drops = this.dropsmap();
    const chunk = this.unloaded();
    const r = this.size();
    for (let h of this.gamemode().harm) {
        let count = h.count;
        while (count>0) {
            let n = Math.floor(Math.random()*r*r);
            if (blocks[chunk[n]].damage>0 | overlap(center, n, r)) continue;
            let perim = this.perimeter(n, r);
            if (valid(perim)) {
                chunk[n] = h.id;
                for (let p of perim) {
                    let id = chunk[p]==0? 1 : chunk[p];
                    chunk[p] = chunk[p]>4? chunk[p] : id+1;
                }
                count--;
            }
        }
    }
    for (let d of this.gamemode().drop) {
        let count = d.count;
        while (count>0) {
            let n = Math.floor(Math.random()*r*r);
            if (d.id==3) {
                let magmamap = [];
                for (let c in chunk) {
                    if (blocks[chunk[c]].damage>0) magmamap.push(c);
                }
                while (count>0) {
                    let n = Math.floor(Math.random()*magmamap.length);
                    let perim = this.perimeter(magmamap[n], r);
                    magmamap.splice(magmamap.indexOf(n), 1);
                    let m = perim[Math.floor(Math.random()*perim.length)];
                    if (blocks[chunk[n]].damage>0) continue;
                    drops[m] = 3;
                    count--;
                } continue;
            } else if (blocks[chunk[n]].damage>0&drops[n]!=-1) continue;
            drops[n] = d.id;
            count--;
        }
    }
    this.thespian().lastxy = center;
    this.thespian().currxy = center;
    this.thespian().movexy = this.perimeter(center, r, false);
    this.clear(center);
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
        if (blocks[unloaded[n]].height>-1&this.dropsmap()[n]==-1) {
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
    thespian.aiming = direction;
    let rendered = this.rendered();
    let block = blocks[rendered[direction]];
    let oldxy = thespian.currxy;
    let perim = [...thespian.movexy];
    let coord = perim.indexOf(direction);
    if (coord>-1) {
        if ((block.isWalkable|persistance|!blocks[rendered[oldxy]].isWalkable)&blocks[rendered[direction]].height<2) {
            thespian.lastxy = oldxy;
            thespian.currxy = direction;
            thespian.movexy = this.perimeter(direction, this.size(), false);
            return perim;
        } else {
            thespian.lastxy = oldxy;
            return blocks[rendered[direction]].isMineable? this.mine(direction) : this.take(direction);
        }
    } else {
        return [];
    }
}

Game.prototype.mine = function(direction) {
    if (this.rendered()[direction]==this.unloaded()[direction]) return [direction];
    this.rendered()[direction] = this.dropsmap()[direction]!=-1? 9 : this.unloaded()[direction];
    return [direction];
}

Game.prototype.take = function(direction) {
    if (!blocks[this.rendered()[direction]].isTakeable) return [];
    items[this.dropsmap()[direction]].give(this);
    this.rendered()[direction] = this.unloaded()[direction];
    return [direction];
}

Game.prototype.score = function() {
    return this.thespian().points + this.rendered().reduce((a, b)=> { return a+blocks[b].points }, 0);
}

Game.prototype.over = function() {
    for (let n in this.rendered()) {
        let perim = this.perimeter(parseInt(n), this.size(), false);
        let moves = perim.length;
        for (let m in perim) {
            if (blocks[this.unloaded()[perim[m]]].damage<1) perim.splice(m, 1);
        }
        if (this.rendered()[n]==1&!blocks[this.unloaded()[n]].source) {
            if (moves==perim.length) continue;
            return false;
        }
    }
    return true;
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

Game.prototype.dropsmap = function() {
    return this.extract.dropsmap;
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