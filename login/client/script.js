const conv = { easy: 'easy', norm: 'normal', hard: 'hard' }

async function index(user) {
    const result = await axios({
        method: 'get',
        url: '/score',
        params: { name: user },
    });
    return await result.data;
}

const setGameEasy = function() {
    console.log('clicked');
    window.localStorage.gamemode = 'easy'
    window.location.pathname = './client/engine/index.html'
}

const setGameMedium = function() {
    console.log('clicked');
    window.localStorage.gamemode = 'normal'
    window.location.pathname = './client/engine/index.html'
}

const setGameHard = function() {
    console.log('clicked');
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



const loadWebpage = function() {
    const $root = $('#root');
    $($root).on('click', '#easyB', setGameEasy);
    $($root).on('click', '#mediumB', setGameMedium);
    $($root).on('click', '#hardB', setGameHard);
    const result = index(window.localStorage.user);
    result.then((result)=> {
        window.localStorage.highscores = result;
        $(renderScoreBoard(result)).insertAfter(document.getElementById('anchor'));
    });
};

$(function() {
    loadWebpage();
});