const { BoardNumber, Direction } = require("../utils/types");

class Block {
  coord = null
  value = null;

  constructor(x, y, value) {
    this.coord = { x, y };
    this.value = value;
  }

  clear() {
    this.value = BoardNumber['0'];
  }

  getValue() {
    return this.value;
  }

  updateValue(value) {
    this.value = value;
  }

  merge(block) {
    if (this.value !== block.getValue()) throw "Invalid Merge";
    this.value += block.getValue();
  }

  slide(direction, distance) {
    switch(direction) {
      case Direction.UP:
        this.coord.x -= distance;
        break;
    }
  }
}

module.exports = Block;