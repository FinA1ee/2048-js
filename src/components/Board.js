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

    // this.verticalBoard[0][0].updateValue(2000);
    // this.verticalBoard[0][1].updateValue(200);
    // this.verticalBoard[0][3].updateValue(20);
    
    // console.log(this.board);
    // console.log(this.verticalBoard);
    // console.log(this.board);
    // console.log(this.verticalBoard);
    // this.prettyPrint();
  }

  _createBoard() {
    const arr = [];
    for (let i = 0; i < this.level; i++) {
      arr.push(new Array(this.level).fill(BoardNumber['0']));
    }
    this.board = arr;

    // this.verticalChains = JSON.parse(JSON.stringify(arr));
    this._iterateBoard((i, j) => {
      this.board[i][j] = new Block(i, j, BoardNumber['0']);
    });
  }

  _initBoard() {
    this._dropNumber(2);
    this._getVerticalChains();
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
      if (this.board[i][j].getValue() !==  BoardNumber['0']) continue;
      const value = Math.floor(Math.random() * 10) > 8 ? BoardNumber["2"] : BoardNumber["1"];
      // this.board[i][j].updateValue(fillFour ? BoardNumber["2"] : BoardNumber["1"]);
      this.board[i][j].updateValue(value);
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

  _slideIn(blockArr, i) {
    let begin = false;
    blockArr.forEach(item => {
      if (item === BoardNumber['0']) begin = true;
    })

    return blockArr;
  }

  _getVerticalChains() {
    const res = [];
    for (let i = 0; i < this.level; i++) {
      res.push(new Array(this.level).fill(BoardNumber['0']));
    }

    for (let i = 0; i < this.level; i++) {
      for (let j = 0; j < this.level; j++) {
        res[j][i] = this.board[i][j];
      }
    }
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
            // console.log(`merging block${j} to ${i}`);
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
          // console.log(`sliding block${j} to ${i}`);
          slideBlock(i, j);
          validMove = true;
          j++;
        }
      } else {
        j++;
      }
    }
    return blockArr;
    // console.log(this.board)
    // [4, 2, 2, 2, 0] => []

    // [0, 4, 0, 2, 2, 0] 
    // for (let i = 0; i < blockArr.length; i++) {
    //   // if (blockArr[i] ) continue;

    //   // if (blockArr[i + 1]) {
    //   //   blockArr[i].getAbsorbed(blockArr[i + 1]);
    //   // }
    // }
  }

  prettyPrint() {
    this._iterateBoard((i, j) => {
      console.log(this.board[i][j].getValue());
      // if (this.board[i][j] instanceof Block) {
      //   this.board[i][j].printBlock();
      // } else {
      //   console.log(this.board[i][j]);
      // }
    });
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
    let validMove = true;
    if (this.gameStatus === GameStatus.END) throw "Game has ended";
    if (!direction in Direction) throw "Invalid move";
    switch (direction) {
      case Direction.UP:
        this.verticalBoard.forEach(chain => {
          // console.log("chain 0", chain)
          this._absorbChain(chain);
          // chain.reverse();
          // console.log("chain 1", chain)
        })
        break;
      case Direction.LEFT:
        this.board.forEach(chain => {
          // console.log("chain 0", chain)
          this._absorbChain(chain);
          // console.log("chain 1", chain)
        })
        break;
      case Direction.DOWN:
        // console.log("down");
        // const arr = this.verticalBoard.reverse();
        this.verticalBoard.forEach(chain => {
          // console.log("chain 0", chain)
          this._absorbChain(chain.reverse()).reverse();
          // console.log("chain 1", chain)
        })
        break;
      case Direction.RIGHT:
        // console.log("right");
        this.board.forEach(chain => {
          // console.log("chain 0", chain)
          this._absorbChain(chain.reverse()).reverse();
          // console.log("chain 1", chain)
        })
        break;
    }
    // this.draw();
    // clivas.clear();
    if (validMove) {
      this._dropNumber(1);
        // this.prettyPrint();
    } else {
      // console.log("invalid move");
    }
    this.draw();
  }
  //   else {
  //     this.gameStatus = GameStatus.END;
  //     throw "Game Over";
  //   }
  // }

  restart() {
    this._createBoard();
    this._initBoard();
    this.prettyPrint();
  }
}

module.exports = Board;
