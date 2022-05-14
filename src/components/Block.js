const { BoardNumber } = require("../utils/types");

class Block {
  coord = null
  value = BoardNumber['0'];

  constructor(x, y) {
    this.coord = { x, y };
  }

  getValue() {
    return this.value;
  }

  updateValue(value) {
    if (value === this.value) return false;
    this.value = value;
    return true;
  }

  /** 合并两个块 */
  merge() {

  }

  printBlock() {
    // console.log(this.value);
  }

  draw() {

  }


}

module.exports = Block;