const make = (name, isMineable, isWalkable, isTakeable, isFluid, height, spread, damage, points, source, id)=> {
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

export var blocks = {
    0: make('floor', false, true, false, false, 0, 0, 0, 1, false, 0),
    1: make('stone', true, false, false, false, 2, 0, 0, 0, false, 1),
    2: make('colder_mafic', false, true, false, false, 0, 0, 0, 1, false, 2),
    3: make('cooled_mafic', false, true, false, false, 0, 0, 0, 1, false, 3),
    4: make('warmed_mafic', false, true, false, false, 0, 0, 0, 1, false, 4),
    5: make('heated_mafic', false, true, false, false, 0, 0, 0, 1, false, 5),
    6: make('magma', false, false, false, true, 1, -1, 1, -1, false, 6),
    7: make('magma', false, false, false, true, 1, 1, 1, -1, false, 7),
    8: make('magma', false, false, true, true, -1, 2, 1, -1, true, 8),
}

export var invalids = {
    5: 'heated_mafic', // #4
}

export var gamemodes = {
    easy: { 
        harm: [{ID:  8, count: 16}],
        hbar: [{ID: 64, count:  1}],
        size: 10,
    },

    normal: { 
        harm: [{ID:  8, count: 48}],
        hbar: [{ID: 64, count:  1}],
        size: 16,
    },

    hard: {
        harm: [{ID:  8, count: 0}],
        hbar: [{ID: 64, count:  1}],
        size: 20,
    },
}

export var audio = {
    'break1': undefined,
    'break2': undefined,
    'break3': undefined,
    'break4': undefined,
    'hurts1': undefined,
    'fizz': undefined,
}

// export var textures = {
//     0: 'floor',
//     1: 'stone',
//     2: 'colder_mafic', // #1
//     3: 'cooled_mafic', // #2
//     4: 'warmed_mafic', // #3
//     5: 'heated_mafic', // #4
//     6: 'magma',
//     7: 'magma',
//     8: 'magma',
//     9: 'creep',
//    32: 'lapis',
//    33: 'jewel',
//    34: 'heart',
//    64: 'pickax',
//    65: 'bucket',
//    66: 'boomer',
// }