function Game(dimension) {
	if (dimension < 3) {
        throw new RangeError('Dimension must be greater than 3');
    }
    this.dimension_ = dimension;
    this.board_ = this.getBoard(dimension);
    this.player_ = this.PLAYER_ID.PLAYER_ONE;
    this.root_ = this.getRootNodeForDimension();
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
	PLAYER_ONE: 1,
    PLAYER_TWO: 2
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
    this.board_[row][col] = this.player_;
    if (this.player_ === this.PLAYER_ID.PLAYER_ONE) {
        this.board_[row][col] = this.PLAYER_ID.PLAYER_ONE;
        const circle = document.createElement('div');
        circle.className = 'circle';
        tile.append(circle);
        this.player_ = this.PLAYER_ID.PLAYER_TWO;
    } else {
        this.board_[row][col] = this.PLAYER_ID.PLAYER_TWO;
        const crossRight = document.createElement('div');
        const crossLeft = document.createElement('div');
        crossRight.className = 'crossRight';
        crossLeft.className = 'crossLeft';
        tile.append(crossRight);
        tile.append(crossLeft);
        this.player_ = this.PLAYER_ID.PLAYER_ONE;
    }
}

Game.prototype.WINNING_LINE_CASE = {
    ROW: 0,
    COL: 1,
    RIGHT_DIAG: 2,
    LEFT_DIAG: 3
}

Game.prototype.drawLineIfPlayerHasWonAndEndGame = function() {
    console.log(this.board_);
    for (let i = 0; i < this.dimension_; ++i) {
        let winningPlayerRow = this.board_[i][0];
        let isWinningRow = this.board_[i][0] !== 0; 
        for (let j = 0; j < this.dimension_; ++j) {
            if (this.board_[i][j] !== winningPlayerRow) {
                isWinningRow = false;
            }
        }
        if (isWinningRow) {
            this.drawWinningLine(this.WINNING_LINE_CASE.ROW, i);
            return;
        }
    }

    for (let i = 0; i < this.dimension_; ++i) {
        let winningPlayerCol = this.board_[0][i];
        let isWinningCol = this.board_[0][i] !== 0; 
        for (let j = 0; j < this.dimension_; ++j) {
            if (this.board_[j][i] !== winningPlayerCol) {
                isWinningCol = false;
            }
        }
        if (isWinningCol) {
            this.drawWinningLine(this.WINNING_LINE_CASE.COL, i);
            return;
        }
    }

    let winningPlayerRightDiagonal = this.board_[0][0];
    let isWinningRightDiagonal = this.board_[0][0] !== 0; 
    for (let i = 0; i < this.dimension_; ++i) {
        if (this.board_[i][i] !== winningPlayerRightDiagonal) {
            isWinningRightDiagonal = false;
        }
    }

    if (isWinningRightDiagonal) {
        this.drawWinningLine(this.WINNING_LINE_CASE.RIGHT_DIAG);
        return;
    }

    let winningPlayerLeftDiagonal = this.board_[0][this.dimension_ - 1];
    let isWinningLeftDiagonal = this.board_[0][this.dimension_ - 1] !== 0; 
    for (let i = 0; i < this.dimension_; ++i) {
        if (this.board_[i][this.dimension_ - 1 - i] !== winningPlayerLeftDiagonal) {
            isWinningLeftDiagonal = false;
        }
    }

    if (isWinningLeftDiagonal) {
        this.drawWinningLine(this.WINNING_LINE_CASE.LEFT_DIAG);
    }
}

/**
 * Adds elements with a strike through class based on the winning case
 * If the winning case is "row" - it will add elements with the class "row-strike-through"
 * If the winning case is "col" - it will add elements with the class "col-strike-through"
 * If the winning case is "right-diag" - it will add elements with the class "right-strike-through"
 * If the winning case is "left-diag" - it will add elements with the class "left-strike-through"
 * @param {@enum} winningCase
 * @param {number} position
 */
Game.prototype.drawWinningLine = function(winningCase, position) {
    let className;
    switch (winningCase) {
        case this.WINNING_LINE_CASE.ROW:
            className = 'row-strike-through';
            for (let i = 0; i < this.dimension_; ++i) {
                const element = document.createElement('div');
                element.className = className;
                const row = this.root_.children.namedItem(`row-${position}`);
                const tile = row.children.namedItem(`tile-${position}-${i}`);
                tile.appendChild(element);
            }
            break;
        case this.WINNING_LINE_CASE.COL:
            className = 'col-strike-through';
            for (let i = 0; i < this.dimension_; ++i) {
                const element = document.createElement('div');
                element.className = className;
                const row = this.root_.children.namedItem(`row-${i}`);
                const tile = row.children.namedItem(`tile-${i}-${position}`);
                tile.appendChild(element);
            }
            break;
        case this.WINNING_LINE_CASE.RIGHT_DIAG:
            className = 'right-diag-strike-through';
            for (let i = 0; i < this.dimension_; ++i) {
                const element = document.createElement('div');
                element.className = className;
                const row = this.root_.children.namedItem(`row-${i}`);
                const tile = row.children.namedItem(`tile-${i}-${i}`);
                tile.appendChild(element);
            }
            break;
        case this.WINNING_LINE_CASE.LEFT_DIAG:
            className = 'left-diag-strike-through';
            for (let i = 0; i < this.dimension_; ++i) {
                const element = document.createElement('div');
                element.className = className;
                const row = this.root_.children.namedItem(`row-${i}`);
                const tile = row.children.namedItem(`tile-${i}-${this.dimension_ - 1 - i}`);
                tile.appendChild(element);
            }
            break;
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

    This function should also attach click listeners for each of the tiles that 
    have been generated
    @return {!Element} 
*/
Game.prototype.getRootNodeForDimension = function() {
    if (this.root_ !== undefined) {
        return this.root_;
    }
    const root = document.createElement('div');
    root.id = 'root'
    for (let i = 0; i < this.dimension_; ++i) {
        const row = document.createElement('div');
        row.id = `row-${i}`;
        row.className = 'row';
        for (let j = 0; j < this.dimension_; ++j) {
            const tile = document.createElement('div');
            tile.id = `tile-${i}-${j}`;
            tile.className = 'tile';
            tile.addEventListener('click', (pointerEvent) => {
                tile.style.pointerEvents = 'none';
                this.handleClickOnTile(pointerEvent.target);
                this.drawLineIfPlayerHasWonAndEndGame();
            });
            row.append(tile);
        }
        root.append(row);
    }
    return root;
}


module.exports = Game;