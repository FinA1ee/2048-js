const clivas = require("clivas");
const { Direction, GameStatus, BoardNumber } = require("../utils/types");
const { getDigitsDrawing } = require("../utils/drawing");
const Block = require("./Block");

class Board {
  clivas = null;
  board = null;
  level = null;
  verticalBoard = null;
  score = 0;
  gameLog = '';
  gameStatus = GameStatus.PREPARE;
  startFill = 2;
  appearFour = 0.5;

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
    this.log('Let The Game Begin!');
  }

  _checkGameWon() {
    let res = false;
    this._iterateBoard((i, j) => {
      if (this.board[i][j].getValue() === BoardNumber['11']) {
        res = true
        this.gameStatus = GameStatus.WON;
        this.log("You Won !!!")
      }
    })
    return res;
  }

  _checkGameLose() {
    let res = false;
    this._iterateBoard((i, j) => {
      // check valid move up
      const curValue = this.board[i][j].getValue();
      if (curValue === BoardNumber['0']) res = true;
      if (i > 0 && this.board[i - 1][j].getValue() === curValue) res = true;
      if (i < this.level - 1 && this.board[i + 1][j].getValue() === curValue) res = true;
      if (j > 0 && this.board[i][j - 1].getValue() === this.board[i][j]) res = true;
      if (j < this.level - 1 && this.board[i][j + 1].getValue() === curValue) res = true;
    });

    if (!res) {
      this.gameStatus = GameStatus.LOST;
      this.log("You Lost. Press R to Restart.")
    }
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
            this.score += blockArr[i].getValue();
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
    clivas.flush();
    
    const str = '2048';
    for (let z = 0; z < 5; z++) {
      let padding = "                            ";
      for (let x = 0; x < str.length; x++) {
        const lineDrawing = getDigitsDrawing(new Number(str[x]));
        if (lineDrawing[z]) padding += lineDrawing[z];
        
      }
      clivas.line(padding);
    }
    clivas.line("                            " + ' {bold:Version '+require('../../package.json').version+'} {cyan:by} {bold:@finale1891}');
    clivas.line('');

    for (let i = 0; i < this.level; i++) {
      for (let z = 0; z < 7; z++) {
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

    clivas.line(` {bold:Score:} {yellow:${this.score}}`);
    clivas.line(` {bold:Last Move:} {yellow:${this.log()}}`);
    clivas.line(' {white:Play:}    {bold:Press W(↑) A(←) S(↓) D(→) To Move The Tiles.}');
    clivas.line(' {white:Restart:} {bold:Press R.}');
    clivas.line(' {white:Exit:}    {bold:Press Crrl + C.}');
  }

  move(direction) {
    if (this.gameStatus !== GameStatus.PLAY) return;
    if (!direction in Direction) return;

    let validMove = false;

    switch (direction) {
      case Direction.UP:
        this.verticalBoard.forEach(chain => {
          if (this._absorbChain(chain)) validMove = true;
        })
        validMove ? this.log("You Move Up!") : this.log("Invalid Move!");
        break;
      case Direction.LEFT:
        this.board.forEach(chain => {
          if (this._absorbChain(chain)) validMove = true;
        })
        validMove ? this.log("You Move Left!") : this.log("Invalid Move!");
        break;
      case Direction.DOWN:
        this.verticalBoard.forEach(chain => {
          if (this._absorbChain(chain.reverse())) validMove = true;
          chain.reverse();
        })
        validMove ? this.log("You Move Down!") : this.log("Invalid Move!");
        break;
      case Direction.RIGHT:
        this.board.forEach(chain => {
          if (this._absorbChain(chain.reverse())) validMove = true;
          chain.reverse();
        })
        validMove ? this.log("You Move Right!") : this.log("Invalid Move!");
        break;
    }

    this.checkGameStatus();
    if (this.gameStatus === GameStatus.PLAY) {
      if (validMove) this._dropNumber(1);
      this.draw();
    } else {
      this.draw();
    }
  }

  log(str) {
    const res = this.gameLog;
    this.gameLog = str;
    return res;
  }

  restart() {
    this.gameLog = '';
    this.score = 0;
    this._createBoard();
    this._initBoard();
    this.draw();
  }
}

module.exports = Board;
