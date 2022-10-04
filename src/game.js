function Game(dimension) {

}

Game.prototype.getBoard = function(dimension) {
	if (dimension < 3) {
        return null;
    }
    const board = [];
    for (let i = 0; i < dimension; ++i) {
        const row = new Array(dimension);
        row.fill(0);
        board.push(row);
    }
    return board;
}

Game.prototype.PLAYER_ID = {
	PLAYER_ONE: 0,
    PLAYER_TWO: 1
}

/**
 * @param{!Element} tile - The tile that was clicked
 */
Game.prototype.handleClickOnTile = function(tile) {

}

/** 
    This function should return a single element or tag DIV, and id = root.
    This root element should have number of children equal to "dimension".

    The direct children of "root" should have ids = "row-" appended with the
    0 based position of the row. So for example, with dimension = 3, root should
    have 3 children with ids "row-0", "row-1", "row-2".

    Each row element should have additional children equal to "dimension".
    The children of rows should have the ids = "tile-" appended with the row and
    column. So for example, row-0 with dimension 3 should have 3 children with ids
    "tile-0-0", "tile-0-1", "tile-0-2"
    @param {number} dimension
    @param {!Game} game
    @return {!Element} 
*/
Game.getRootNodeForDimension = function(game) {
    
}

module.exports = Game;