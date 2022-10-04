const Game = require('./game');

function initApplication() {
    const dimension = 5;
    const rootNode = Game.getRootNodeForDimension(new Game(dimension));
    document.getElementById('game').append(rootNode);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApplication();
    }); 
} else if (document.readyState === 'complete') {
    initApplication();
}