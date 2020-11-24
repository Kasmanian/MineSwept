const conv = { easy: 'easy', norm: 'normal', hard: 'hard' }

var dirty_bit = document.getElementById('page_is_dirty');
if (dirty_bit.value == '1') window.location.reload();
function mark_page_dirty() {
    dirty_bit.value = '1';
}

async function index(user) {
    const result = await axios({
        method: 'get',
        url: '/score',
        params: { name: user },
    });
    return await result.data;
}

const setGameEasy = function() {
    window.localStorage.gamemode = 'easy'
    window.location.pathname = './client/engine/index.html'
}

const setGameMedium = function() {
    window.localStorage.gamemode = 'normal'
    window.location.pathname = './client/engine/index.html'
}

const setGameHard = function() {
    window.localStorage.gamemode = 'hard'
    window.location.pathname = './client/engine/index.html'
}

const renderScoreBoard = function(scores) {
    let list = '';
    for (let key of Object.keys(scores)) {
        for (let score of scores[key]) {
            list+=`<div class="line">${conv[score['mode']]}: ${score['name']}...${score['score']}</div>`;
        }
    }
    return `<div id="list">${list}</div>`;
}

const updateScoreBoard = function() {
    const result = index(window.localStorage.user);
    result.then((result)=> {
        window.localStorage.highscores = result;
        let element = document.getElementById('anchor');
        if (element!=null) {
            $(renderScoreBoard(result)).insertAfter(element);
            element.remove();
        } else $(renderScoreBoard(result)).insertAfter(document.getElementById('anchor'));
    });
}


const loadWebpage = function() {
    const $root = $('#root');
    $($root).on('click', '#easyB', setGameEasy);
    $($root).on('click', '#mediumB', setGameMedium);
    $($root).on('click', '#hardB', setGameHard);
    updateScoreBoard();
};

$(function() {
    loadWebpage();
});

const timer = ms => new Promise(res => setTimeout(res, ms));