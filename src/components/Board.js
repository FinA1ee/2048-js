const clivas = require("clivas");
const { Direction, GameStatus, BoardNumber } = require("../utils/types");
const { getDigitsDrawing } = require("../utils/drawing");
const Block = require("./Block");

const space = '            ';

class Board {
  clivas = null;
  board = null;
  level = null;
  gameStatus = GameStatus.PREPARE;
  startFill = 2;
  appearFour = 0.2;

  constructor(level, clivas) {
    this.clivas = clivas;
    this.level = level;
    this._createBoard();
    this._initBoard();
    // this.prettyPrint();
  }

  _createBoard() {
    const arr = [];
    for (let i = 0; i < this.level; i++) {
      arr.push(new Array(this.level));
    }
    this.board = arr;
    this._iterateBoard((i, j) => {
      this.board[i][j] = new Block(i, j);
    });
  }

  _initBoard() {
    this._dropNumber(2);
    this.gameStatus = GameStatus.PLAY;
  }

  _checkGameOver() {
    // let res = false;
    return true;
    // this._iterateBoard((i, j, boardItem) => {
    //   if (boardItem === BoardNumber['0']) res = true;
    // })
    // return res;
  }

  _dropNumber(num) {
    if (!num || isNaN(num)) return;
    let iter = 0;
    while (iter < num) {
      const i = Math.floor(Math.random() * this.level);
      const j = Math.floor(Math.random() * this.level);
      if (this.board[i][j].getValue() !== BoardNumber['0']) continue;
      const fillFour = Math.floor(Math.random() * 10) > 8;
      this.board[i][j].updateValue(fillFour ? BoardNumber["2"] : BoardNumber["1"]);
      iter++;
    }
    return this._checkGameOver();
  }

  _iterateBoard(cb) {
    for (let i = 0; i < this.level; i++) {
      for (let j = 0; j < this.level; j++) {
        cb(i, j);
      }
    }
  }

  prettyPrint() {
    this._iterateBoard((i, j) => {
      this.board[i][j].printBlock();
    });
  }

  draw() {
    for (let i = 0; i < this.level; i++) {
      for (let z = 0; z < 10; z++) {
        let padding = "";
        for (let j = 0; j < this.level; j++) {
          const lineDrawing = getDigitsDrawing(this.board[i][j].getValue());
          if (lineDrawing[z]) padding += space + lineDrawing[z];
        }
        clivas.line(padding);
      }
    }
  }

  move(direction) {
    if (this.gameStatus === GameStatus.END) throw "Game has ended";
    if (!direction in Direction) throw "Invalid move";
    switch (direction) {
      case Direction.UP:
        let resArr = [0, 0, 0, 0];
        this._iterateBoard((i, j, item) => {
          if (this.board[i][j] !== BoardNumber["0"] && i !== 0) {
            if (
              this.board[i][j] === this.board[0][j] ||
              this.board[0][j] === BoardNumber["0"]
            ) {
              this.board[0][j] += this.board[i][j];
              // console.log(i, j, this.board[i][j], this.board[i][0])
              this.board[i][j] = BoardNumber["0"];
            }
            // this.prettyPrint();
          }
          // if (this.board[0][j] !== BoardNumber['0'] && this.board[0][j] === item) {
          // }
        });
        console.log("up");
        break;
      case Direction.LEFT:
        console.log("up");
        break;
      case Direction.DOWN:
        console.log("down");
        break;
      case Direction.RIGHT:
        console.log("right");
        break;
    }
    if (this._dropNumber(1)) {
      this.prettyPrint();
    } else {
      this.gameStatus = GameStatus.END;
      throw "Game Over";
    }
  }

  restart() {
    this._createBoard();
    this._initBoard();
    this.prettyPrint();
  }
}

module.exports = Board;
