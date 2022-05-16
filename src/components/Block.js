const { BoardNumber, Direction } = require("../utils/types");

class Block {
  coord = null
  value = null;

  constructor(x, y, value) {
    this.coord = { x, y };
    this.value = value;
  }

  hasWon() {
    return this.value = BoardNumber['11'];
  }

  clear() {
    this.value = BoardNumber['0'];
  }

  getValue() {
    return this.value;
  }

  updateValue(value) {
    if (value === this.value) return false;
    this.value = value;
    return true;
  }

  merge(block) {
    if (this.value !== block.getValue()) throw "Invalid Merge";
    this.value += block.getValue();
  }

  // /** 合并两个块 */
  // getAbsorbed(block) {
  //   if (this.value !== BoardNumber['0'] && block.BoardNumber === this.value) {
  //     block.updateValue(this.value);
  //     this.updateValue(BoardNumber['0']);
  //   }
  // }

  slide(direction, distance) {
    switch(direction) {
      case Direction.UP:
        this.coord.x -= distance;
        break;
    }
  }

  printBlock() {
    // console.log(this.value);
  }

  draw() {

  }


}

module.exports = Block;