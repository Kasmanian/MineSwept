const mode = ['easy', 'normal', 'hard'];
const text = ['Easy', 'Normal', 'Hard'];
const info = [
    'map size: 10x10\nmagma count: 10\n\nloot drops:\njewel x4\nheart x1\nhaste potion x1\nfreeze potion x1',
    'map size: 16x16\nmagma count: 48\n\nloot drops:\njewel x12\nheart x2\nhaste potion x2\nfreeze potion x2',
    'map size: 20x20\nmagma count: 72\n\nloot drops:\njewel x18\nheart x4\nhaste potion x4\nfreeze potion x4',
];
const icon = [
    'assets/easy.jpg',
    'assets/normal.png',
    'assets/hard.jpg',
];
var click_counter = 1;

async function index(user) {
    const result = await axios({
        method: 'get',
        url: '/score',
        params: { name: user },
    });
    return await result.data;
}

const setGameMode = function(event) {
    click_counter+=1;
    window.localStorage.gamemode = mode[click_counter%3];
    document.getElementById('info').innerText = info[click_counter%3];
    document.getElementById('head').src = icon[click_counter%3];
    event.target.innerText = text[click_counter%3];
}

const handleStart = function(event) {
    window.location.pathname = './client/engine/index.html';
}

const seeInfo = function(event) {
    let el = document.getElementById('info');
    if (!el.classList.contains('show')) {
        el.classList.add('show');
    }
}

const hideInfo = function(event) {
    document.getElementById('info').classList.remove('show');
}

const renderScoreBoard = function(scores) {
    let list = '';
    for (let key of Object.keys(scores)) {
        for (let score of scores[key]) {
            list+=`<div class="line">${score['mode']}: <span>${score['name']}</span>...${score['score']}</div>`;
        }
    }
    return `<div id="list">${list}</div>`;
}

const updateScoreBoard = function() {
    const result = index(window.localStorage.user);
    result.then((result)=> {
        let element = document.getElementById('anchor');
        if (element!=null) {
            $(renderScoreBoard(result)).insertAfter(element);
            element.remove();
        } else $(renderScoreBoard(result)).insertAfter(document.getElementById('anchor'));
    });
}


const loadWebpage = function() {
    window.localStorage.gamemode = mode[click_counter%3];
    document.getElementById('info').innerText = info[click_counter%3];
    const $root = $('#root');
    $($root).on('click', '#diff', setGameMode);
    $($root).on('click', '#play', handleStart);
    $($root).on('mouseover', '#head', seeInfo);
    $($root).on('mouseout', '#head', hideInfo);
    updateScoreBoard();
};

$(function() {
    loadWebpage();
});