const setGameEasy = function() {
    console.log('clicked');
    window.localStorage.gamemode = 'easy'
    window.location.pathname = './engine/index.html'
}

const setGameMedium = function() {
    console.log('clicked');
    window.localStorage.gamemode = 'normal'
    window.location.pathname = './engine/index.html'
}

const setGameHard = function() {
    console.log('clicked');
    window.localStorage.gamemode = 'hard'
    window.location.pathname = './engine/index.html'
}



const loadWebpage = function() {
    const $root = $('#root');
    $($root).on('click', '#easyB', setGameEasy);
    $($root).on('click', '#mediumB', setGameMedium);
    $($root).on('click', '#hardB', setGameHard);
};

$(function() {
    loadWebpage();
});