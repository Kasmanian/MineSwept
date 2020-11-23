const makeBlock = (name, isMineable, isWalkable, isTakeable, isFluid, height, spread, damage, points, source, id)=> {
    return {
        name: name,
        isMineable: isMineable,
        isWalkable: isWalkable,
        isTakeable: isTakeable,
        isFluid: isFluid,
        height: height,
        spread: spread,
        damage: damage,
        points: points,
        source: source,
        id: id,
    }
};

const makeItem = (name, id, give=undefined)=> {
    return {
        name: name,
        give: give,
        id: id,
    }
}

export var blocks = {
    0: makeBlock('floor', false, true, false, false, 0, 0, 0, 10, false, 0),
    1: makeBlock('stone', true, false, false, false, 2, 0, 0, 0, false, 1),
    2: makeBlock('colder_mafic', false, true, false, false, 0, 0, 0, 10, false, 2),
    3: makeBlock('cooled_mafic', false, true, false, false, 0, 0, 0, 10, false, 3),
    4: makeBlock('warmed_mafic', false, true, false, false, 0, 0, 0, 10, false, 4),
    5: makeBlock('heated_mafic', false, true, false, false, 0, 0, 0, 10, false, 5),
    6: makeBlock('magma', false, false, false, false, 1, -1, 1, 0, false, 6),
    7: makeBlock('magma', false, false, false, false, 1, 1, 1, 0, false, 7),
    8: makeBlock('magma', false, false, false, false, -1, 2, 1, 0, true, 8),
    9: makeBlock('bound', false, false, true, false, 0, 0, 0, 10, false, 9),
}

export var items = {
    0: makeItem('pickax', 0),
    1: makeItem('bucket', 1),
    2: makeItem('boomer', 2, async function(game) { game.clear(game.thespian().aiming); }),
    3: makeItem('jewel',  3, async function(game) { game.thespian().points+=100; }),
    4: makeItem('heart',  4, async function(game) { game.thespian().health+=1; }),
    5: makeItem('haste',  5, async function(game) { 
        game.thespian().speedy+=15;
        while (game.thespian().speedy>0) {
            await timer(1000);
            game.thespian().speedy-=1;
        }
    }),
    6: makeItem('flame',  6, async function(game) { 
        game.thespian().resist+=15;
        while (game.thespian().resist>0) {
            await timer(1000);
            game.thespian().resist-=1;
        }
    }),
}

export var invalids = {
    5: 'heated_mafic', // #4
}

export var gamemodes = {
    easy: { 
        harm: [{id: 8, count: 10}],
        hbar: [{id: 0, count:  1}, {id: 1, count: 1}, {id: 2, count: 2}],
        drop: [{id: 3, count:  4}, {id: 4, count: 1}, {id: 5, count: 1}, {id: 6, count: 1}],
        size: 10,
    },

    normal: { 
        harm: [{id: 8, count: 48}],
        hbar: [{id: 0, count:  1}, {id: 1, count: 1}, {id: 2, count: 8}],
        drop: [{id: 3, count: 12}, {id: 4, count: 2}, {id: 5, count: 2}, {id: 6, count: 2}],
        size: 16,
    },

    hard: {
        harm: [{id: 8, count: 72}],
        hbar: [{id: 0, count:  1}, {id: 1, count: 1}, {id: 2, count: 16}],
        drop: [{id: 3, count: 18}, {id: 4, count: 4}, {id: 5, count:  4}, {id: 6, count: 4}],
        size: 20,
    },
}

export var audio = {
    'break1.ogg': undefined,
    'break2.ogg': undefined,
    'break3.ogg': undefined,
    'break4.ogg': undefined,
    'hurts1.ogg': undefined,
    'cave1.oga': undefined,
    'cave2.oga': undefined,
    'cave3.oga': undefined,
    'cave4.oga': undefined,
    'cave5.oga': undefined,
    'cave6.oga': undefined,
    'cave7.oga': undefined,
    'cave8.oga': undefined,
    'cave9.oga': undefined,
    'cave10.oga': undefined,
    'cave11.oga': undefined,
    'cave12.oga': undefined,
    'cave13.oga': undefined,
    'cave14.oga': undefined,
    'cave15.oga': undefined,
    'cave16.oga': undefined,
    'cave17.oga': undefined,
    'cave18.oga': undefined,
    'cave19.ogg': undefined,
    'heart.ogg': undefined,
    'jewel.ogg': undefined,
    'potion.ogg': undefined,
    'step1.ogg': undefined,
    'step2.ogg': undefined,
    'step3.ogg': undefined,
    'step4.ogg': undefined,
    'step5.ogg': undefined,
    'step6.ogg': undefined,
    'fizz.ogg': undefined,
    'take.ogg': undefined,
    'mark1.ogg': undefined,
    'mark2.ogg': undefined,
    'game_lost.oga': undefined,
}

const timer = ms => new Promise(res => setTimeout(res, ms));