function Game(dimension) {
	if (dimension < 3) {
        throw new RangeError('Dimension must be greater than 3');
    }
    this.dimension_ = dimension;
    this.board_ = this.getBoard(dimension);
    this.player_ = this.PLAYER_ID.PLAYER_ONE;
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

Game.prototype.getRowAndColByTileId = function(id) {
	let parts = id.split('-');
    console.log(parts);
    if (parts.length !== 3) {
        console.log('WARNING - did not find 3 parts in tile id');
        return [-1,-1];
    } else {
        return [parseInt(parts[1]), parseInt(parts[2])];
    }
}

/**
 * @param{!Element} tile - The tile that was clicked
 */
Game.prototype.handleClickOnTile = function(tile) {
  const rowAndCol = this.getRowAndColByTileId(tile.id);
  const row = rowAndCol[0];
  const col = rowAndCol[1];
	if (this.player_ === this.PLAYER_ID.PLAYER_ONE) {
  	this.board_[row][col] = this.PLAYER_ID.PLAYER_ONE;
    const circle = document.createElement('div');
    circle.className = 'circle';
    tile.append(circle);
    this.player_ = this.PLAYER_ID.PLAYER_TWO;
  } else {
  	this.board_[row][col] = this.PLAYER_ID.PLAYER_ONE;
    const crossRight = document.createElement('div');
    const crossLeft = document.createElement('div');
    crossRight.className = 'crossRight';
    crossLeft.className = 'crossLeft';
    tile.append(crossRight);
    tile.append(crossLeft);
    this.player_ = this.PLAYER_ID.PLAYER_ONE;
  }
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
    const dimension = game.dimension_;
    if(dimension < 3) {
        return null;
    }
    const root = document.createElement('div');
    root.id = 'root'
    for (let i = 0; i < dimension; ++i) {
        const row = document.createElement('div');
        row.id = `row-${i}`;
        row.className = 'row';
        for (let j = 0; j < dimension; ++j) {
            const tile = document.createElement('div');
        tile.id = `tile-${i}-${j}`;
        tile.className = 'tile';
        tile.addEventListener('click', (pointerEvent) => {
            tile.style.pointerEvents = 'none';
            game.handleClickOnTile(pointerEvent.srcElement);
        });
        row.append(tile);
        }
        root.append(row);
    }
    return root;
}

module.exports = Game;