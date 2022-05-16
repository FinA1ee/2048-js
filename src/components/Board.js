const clivas = require("clivas");
const { Direction, GameStatus, BoardNumber } = require("../utils/types");
const { getDigitsDrawing } = require("../utils/drawing");
const Block = require("./Block");


class Board {
  clivas = null;
  board = null;
  level = null;
  verticalBoard = null;
  gameStatus = GameStatus.PREPARE;
  startFill = 2;
  appearFour = 0.2;

  constructor(level, clivas) {
    this.clivas = clivas;
    this.level = level;
    this._createBoard();
    this._initBoard();
  }

  _createBoard() {
    const arr = [];
    for (let i = 0; i < this.level; i++) {
      arr.push(new Array(this.level).fill(BoardNumber['0']));
    }
    this.board = arr;

    this._iterateBoard((i, j) => {
      this.board[i][j] = new Block(i, j, BoardNumber['0']);
    });
  }

  _initBoard() {
    this._dropNumber(2);
    this._getVerticalChains();
    this.gameStatus = GameStatus.PLAY;
  }

  _checkGameWon() {
    let res = false;
    this._iterateBoard((i, j) => {
      if (this.board[i][j].getValue() === BoardNumber['11']) {
        res = true
        this.gameStatus = GameStatus.WON;
      }
    })
    return res;
  }

  _checkGameLose() {
    let res = true;
    this._iterateBoard((i, j) => {
      if (this.board[i][j].getValue() !== BoardNumber['0']) {
        res = false;
      }
    });
    if (res) this.gameStatus = GameStatus.LOST;
    return res;
  }

  _dropNumber(num) {
    if (!num || isNaN(num)) return;
    let iter = 0;
    while (iter < num) {
      const i = Math.floor(Math.random() * this.level);
      const j = Math.floor(Math.random() * this.level);
      if (this.board[i][j].getValue() !==  BoardNumber['0']) continue;
      const value = Math.floor(Math.random() * 10) > 8 ? BoardNumber["2"] : BoardNumber["1"];
      this.board[i][j].updateValue(value);
      iter++;
    }
  }

  _iterateBoard(cb) {
    for (let i = 0; i < this.level; i++) {
      for (let j = 0; j < this.level; j++) {
        cb(i, j);
      }
    }
  }

  _getVerticalChains() {
    const res = [];
    for (let i = 0; i < this.level; i++) {
      res.push(new Array(this.level).fill(BoardNumber['0']));
    }
    this._iterateBoard((i, j) => {
      res[j][i] = this.board[i][j];
    })
    this.verticalBoard = res;
  }

  _absorbChain(blockArr) {
    
    let validMove = false;
    // slide block j to i
    const slideBlock = (i, j) => {
      blockArr[i].updateValue(blockArr[j].getValue());
      blockArr[j].clear();
    }

    let i = 0;
    let j = 1;

    while(i < blockArr.length && j < blockArr.length) {
      if (blockArr[j].getValue() !== BoardNumber['0']) {
        if (blockArr[i].getValue() !== BoardNumber['0']) {
          if (blockArr[i].getValue() === blockArr[j].getValue()) {
            // merge j to i
            blockArr[i].merge(blockArr[j]);
            blockArr[j].clear();
            j++;
            validMove = true;
          } else {
            if (j - i > 1) {
              slideBlock(i + 1, j);
              validMove = true;
            }
            i++;
            j++;
          }
        } else {
          // slide
          slideBlock(i, j);
          validMove = true;
          j++;
        }
      } else {
        j++;
      }
    }
    return validMove;
  }

  checkGameStatus() {
    this._checkGameWon();
    this._checkGameLose();
  }

  draw() {
    clivas.clear();
    for (let i = 0; i < this.level; i++) {
      for (let z = 0; z < 10; z++) {
        let padding = "";
        for (let j = 0; j < this.level; j++) {
          let space;
          const res = this.board[i][j].getValue();
          const lineDrawing = getDigitsDrawing(res);
          if (res.toString().length === 1) {
            space = '                            ';
          } else if (res.toString().length === 2) {
            space = '                    ';
          } else if (res.toString().length === 3) {
            space = '            ';
          } else if (res.toString().length === 4) {
            space = '    ';
          }
          
          if (lineDrawing[z]) padding += space + lineDrawing[z];
        }
        clivas.line(padding);
      }
    }
  }

  move(direction) {
    let validMove = false;

    if (this.gameStatus === GameStatus.END) throw "Game has ended";
    if (!direction in Direction) throw "Invalid move";
    switch (direction) {
      case Direction.UP:
        this.verticalBoard.forEach(chain => {
          if (this._absorbChain(chain)) validMove = true;
        })
        break;
      case Direction.LEFT:
        this.board.forEach(chain => {
          if (this._absorbChain(chain)) validMove = true;
        })
        break;
      case Direction.DOWN:
        this.verticalBoard.forEach(chain => {
          if (this._absorbChain(chain.reverse())) validMove = true;
          chain.reverse();
        })
        break;
      case Direction.RIGHT:
        this.board.forEach(chain => {
          if (this._absorbChain(chain.reverse())) validMove = true;
          chain.reverse();
        })
        break;
    }

    this.checkGameStatus();

    if (this.gameStatus !== GameStatus.PLAY) throw this.gameStatus;
    if (validMove) this._dropNumber(1);
    this.draw();
  }

  restart() {
    this._createBoard();
    this._initBoard();
    this.draw();
  }
}

module.exports = Board;
