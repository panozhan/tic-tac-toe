/**
 * @jest-environment jsdom
 */

 const Game = require('./game');

 describe('Test Game constructor', () => {
     test('Should throw a RangeError if dimension is less than 3', () => {
         expect(() => new Game(2)).toThrow(RangeError);
     });
 
     test('Should save the dimension in a member variable', () => {
         const game = new Game(3);
         expect(game.dimension_).toBe(3);
     });
 
     test('Should set the player_ member variable to PLAYER_ONE', () => {
         const game = new Game(3);
         expect(game.player_).toBe(Game.prototype.PLAYER_ID.PLAYER_ONE);
     });
 
     test('Should initialize a board with a 2D Array filled with 0 of size 3', () => {
         const game = new Game(3);
         expect(game.board_).toEqual([[0,0,0],[0,0,0],[0,0,0]]);
     });
 
     test('Should initialize a board with a 2D Array filled with 0 of size 4', () => {
         const game = new Game(4);
         expect(game.board_).toEqual([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
     });
 
     test('Should initialize a board with a 2D Array filled with 0 of size 5', () => {
         const game = new Game(5);
         expect(game.board_).toEqual([[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]);
     });
 });
 
 describe('Test getRootNodeForDimension ', function(){
     const testGetRootNodeForDimensionHelper = (dimension, rootNode) => {
         expect(rootNode.id).toBe('root');
         expect(rootNode.tagName).toBe('DIV');
         expect(rootNode.children.length).toBe(dimension);
         for (let i = 0; i < dimension; ++i) {
             const item = rootNode.children.item(i);
                 expect(item.id).toBe(`row-${i}`);
                 expect(item.className).toBe('row');
                 expect(item.tagName).toBe('DIV');
                 expect(item.children.length).toBe(dimension);
             for (let j = 0; j < dimension; ++j) {
             const tile = item.children.item(j);
                 expect(tile.id).toBe(`tile-${i}-${j}`);
                 expect(tile.tagName).toBe('DIV');
                 expect(tile.className).toBe('tile');
             }
         }
     };
     test('Should return a root node with childrens representing a 3x3 board', function(){
         const game = new Game(3);
         testGetRootNodeForDimensionHelper(game.dimension_, game.getRootNodeForDimension());
     });
     test('Should return a root node with childrens representing a 4x4 board', function(){
         const game = new Game(4);
         testGetRootNodeForDimensionHelper(game.dimension_, game.getRootNodeForDimension());
     });
     test('Should return a root node with childrens representing a 15x15 board', function(){
         const game = new Game(15);
         testGetRootNodeForDimensionHelper(game.dimension_, game.getRootNodeForDimension());
     });
   });
 
 describe('Test Game Play logic 3x3', () => {
     const dimension = 4;
     let root;
     const clickTile = function(i,j) {
         expect(root.children.length).toBeGreaterThan(i);
         const row = root.children.namedItem(`row-${i}`);
         expect(row).not.toBeNull();
         expect(row.children.length).toBeGreaterThan(j);
         const tile = row.children.namedItem(`tile-${i}-${j}`);
         expect(tile).not.toBeNull();
         tile.click();
         return tile;
     }
     beforeEach(() => {
         const game = new Game(dimension);
         root = game.getRootNodeForDimension();
     });
     expect.extend({
         toHaveCrossInChild: function(tile) {
             if (tile.children.length !== 2) {
                 return {
                     pass: false,
                     message: () => `Expected the tile to have 2 children, but actual has ${tile.children.length}` 
                 }
             }
             const firstClassName = tile.children.item(0).className;
             const secondClassName = tile.children.item(1).className;
             return {
                 pass: (firstClassName === 'crossRight' && secondClassName === 'crossLeft') || (firstClassName === 'crossLeft' && secondClassName === 'crossRight'),
                 message: () => `Expected the children of the tile to have class names of crossLeft and crossRight, but actual is ${firstClassName}, ${secondClassName}` 
             };
         }, 
         toHaveCircleInChild: function(tile) {
             if (tile.children.length !== 1) {
                 return {
                     pass: false,
                     message: () => `Expected the tile to have 1 child, but actual has ${tile.children.length}` 
                 }
             }
             const className = tile.children.item(0).className;
             return {
                 pass: className === 'circle',
                 message: () => `Expected the child of the tile to have class name of circle, but actual is ${className}` 
             };
         },
         toHavePointerEventSetToNone: function(tile) {
             return {
                 pass: tile.style.pointerEvents === 'none',
                 message: () => `Expected the pointer events style of the tile to be none, but actual is ${tile.style.pointerEvents}`
             }
         },
         toHaveStrikeThroughInRow: function(row) {
             let allTilesHaveStrikeThrough = true;
             let wrongTiles = [];
             for (let i = 0; i < dimension; ++i) {
                 const tile = row.children.item(i);
                 let tileHaveStrikeThrough = false;
                 for (let j = 0; j < tile.children.length; ++j) {
                     tileHaveStrikeThrough = tileHaveStrikeThrough || tile.children.item(j).className === 'row-strike-through';
                 }
                 allTilesHaveStrikeThrough = allTilesHaveStrikeThrough && tileHaveStrikeThrough;
                 if (!tileHaveStrikeThrough) {
                     wrongTiles.push(i);
                 }
             }
             return {
                 pass: allTilesHaveStrikeThrough,
                 message: () => `Expected each tile in row to have an element with the class name of row-strike-through, but tiles ${wrongTiles.join(',')} do not have such a child node`
             }
         },
         toHaveStrikeThroughInCol: function(root, column) {
             let allTilesHaveStrikeThrough = true;
             let wrongTiles = [];
             for (let i = 0; i < dimension; ++i) {
                 const row = root.children.namedItem(`row-${i}`);
                 const tile = row.children.namedItem(`tile-${i}-${column}`);
                 let tileHaveStrikeThrough = false;
                 for (let j = 0; j < tile.children.length; ++j) {
                     tileHaveStrikeThrough = tileHaveStrikeThrough || tile.children.item(j).className === 'col-strike-through';
                 }
                 allTilesHaveStrikeThrough = allTilesHaveStrikeThrough && tileHaveStrikeThrough;
                 if (!tileHaveStrikeThrough) {
                     wrongTiles.push(i);
                 }
             }
             return {
                 pass: allTilesHaveStrikeThrough,
                 message: () => `Expected each tile in column to have an element with the class name of col-strike-through, but tiles ${wrongTiles.join(',')} do not have such a child node`
             }
         },
         toHaveStrikeThroughInRightDiagonal: function(root) {
             let allTilesHaveStrikeThrough = true;
             let wrongTiles = [];
             for (let i = 0; i < dimension; ++i) {
                 const row = root.children.namedItem(`row-${i}`);
                 const tile = row.children.namedItem(`tile-${i}-${i}`);
                 let tileHaveStrikeThrough = false;
                 for (let j = 0; j < tile.children.length; ++j) {
                     tileHaveStrikeThrough = tileHaveStrikeThrough || tile.children.item(j).className === 'right-diag-strike-through';
                 }
                 allTilesHaveStrikeThrough = allTilesHaveStrikeThrough && tileHaveStrikeThrough;
                 if (!tileHaveStrikeThrough) {
                     wrongTiles.push(i);
                 }
             }
             return {
                 pass: allTilesHaveStrikeThrough,
                 message: () => `Expected each tile in the right diagonal to have an element with the class name of right-diag-strike-through, but tiles ${wrongTiles.join(',')} do not have such a child node`
             }
         },
         toHaveStrikeThroughInLeftDiagonal: function(root) {
             let allTilesHaveStrikeThrough = true;
             let wrongTiles = [];
             for (let i = 0; i < dimension; ++i) {
                 const row = root.children.namedItem(`row-${i}`);
                 const tile = row.children.namedItem(`tile-${i}-${dimension - 1 - i}`);
                 let tileHaveStrikeThrough = false;
                 for (let j = 0; j < tile.children.length; ++j) {
                     tileHaveStrikeThrough = tileHaveStrikeThrough || tile.children.item(j).className === 'left-diag-strike-through';
                 }
                 allTilesHaveStrikeThrough = allTilesHaveStrikeThrough && tileHaveStrikeThrough;
                 if (!tileHaveStrikeThrough) {
                     wrongTiles.push(i);
                 }
             }
             return {
                 pass: allTilesHaveStrikeThrough,
                 message: () => `Expected each tile in the left diagonal to have an element with the class name of left-diag-strike-through, but tiles ${wrongTiles.join(',')} do not have such a child node`
             }
         }
     })
 
     test('Should add a circle after first click into the right tile', () => {
         return new Promise(resolve => {
             const tile = clickTile(0,0);
             setTimeout(() => {
                 expect(tile).toHaveCircleInChild();
                 expect(tile).toHavePointerEventSetToNone();
                 resolve();
             }, 10);
         });
     });
     test('Should add a circle and cross after 2 clicks.', () => {
         return new Promise(resolve => {
             const tileOne = clickTile(0,0);
             const tileTwo = clickTile(0,1);
 
             setTimeout(() => {
                 expect(tileOne).toHaveCircleInChild();
                 expect(tileTwo).toHaveCrossInChild();
                 expect(tileOne).toHavePointerEventSetToNone();
                 expect(tileTwo).toHavePointerEventSetToNone();
                 resolve();
             }, 10);
         });
     });
     test('Should add 2 circles and cross after 3 clicks', () => {
         return new Promise(resolve => {
             const tileOne = clickTile(0,0);
             const tileTwo = clickTile(0,1);
             const tileThree = clickTile(0,2);
 
             setTimeout(() => {
                 expect(tileOne).toHaveCircleInChild();
                 expect(tileTwo).toHaveCrossInChild();
                 expect(tileThree).toHaveCircleInChild();
                 expect(tileOne).toHavePointerEventSetToNone();
                 expect(tileTwo).toHavePointerEventSetToNone();
                 expect(tileThree).toHavePointerEventSetToNone();
                 resolve();
             }, 10);
         });
     });
 
     test('Should draw a red winning line in row 1 when player 1 wins', () => {
         return new Promise(resolve => {
             for (let i = 0; i < dimension - 1; ++i) {
                 clickTile(0,i);
                 clickTile(1,i);
             }
             clickTile(0, dimension - 1);
 
             setTimeout(() => {
                 expect(root.children.namedItem('row-0')).toHaveStrikeThroughInRow();
                 resolve();
             }, 10);
         });
     });
 
     test('Should draw a red winning line in column 1 when player 1 wins', () => {
         return new Promise(resolve => {
             const col = 0;
             for (let i = 0; i < dimension - 1; ++i) {
                 clickTile(i,col);
                 clickTile(i,col + 1);
             }
             clickTile(dimension - 1, col);
 
             setTimeout(() => {
                 expect(root).toHaveStrikeThroughInCol(col);
                 resolve();
             }, 10);
         });
     });
 
     test('Should draw a red winning line in the right diagonal when player 1 wins', () => {
         return new Promise(resolve => {
             for (let i = 0; i < dimension - 1; ++i) {
                 clickTile(i,i);
                 clickTile(i,i + 1);
             }
             clickTile(dimension - 1, dimension - 1);
 
             setTimeout(() => {
                 expect(root).toHaveStrikeThroughInRightDiagonal();
                 resolve();
             }, 10);
         });
     });
 
     test('Should draw a red winning line in the left diagonal when player 1 wins', () => {
         return new Promise(resolve => {
             const col = 0;
             for (let i = 0; i < dimension - 1; ++i) {
                 clickTile(i,dimension - 1 - i);
                 clickTile(i,dimension - 2 - i);
             }
             clickTile(dimension - 1, 0);
 
             setTimeout(() => {
                 expect(root).toHaveStrikeThroughInLeftDiagonal();
                 resolve();
             }, 10);
         });
     });
 
 });