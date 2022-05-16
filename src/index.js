#!/usr/bin/env node
const clivas = require('clivas');
const keypress = require('keypress');
const { Direction, BoardNumber } = require('./utils/types');
const Board = require('./components/Board');

const startGame = (level) => {

  var WIDTH = 25;
  var HEIGHT = 20;
  
  const restart = () => {
    board.restart();
  }
  
  const handleMove = (direction) => {
    try {
      board.move(direction);
    } catch(e) {
      console.log("Move Error: ", e);
    }
  }

  const draw = () => {
    clivas.alias('box-color', 'inverse+cyan');
    clivas.alias('full-width', 4 * WIDTH + 15);
    clivas.flush(false);
    clivas.cursor(false);
    'white blue yellow green magenta red cyan'.split(' ').forEach(function(color, i) {
      clivas.alias('color-'+i, '2+inverse+'+color);
    });
  
    board.draw();
    clivas.line(' {green:2048} {bold:'+require('../package.json').version+'} {green:by} {bold:@finale1891}');
    clivas.line(' Press R to Restart.');
  }

  const handleKeyPress = () => {
    keypress(process.stdin);

    process.stdin.on("keypress", (ch, key) => {
      if (key.name === 'c' && key.ctrl) return process.exit(0);
      if (key.name === 'w') handleMove(Direction.UP);
      if (key.name === 'a') handleMove(Direction.LEFT);
      if (key.name === 's') handleMove(Direction.DOWN);
      if (key.name === 'd') handleMove(Direction.RIGHT);
      if (key.name === 'r') restart();
    })  
    
    process.stdin.setRawMode(true);
    process.stdin.resume();
  }

  const board = new Board(level, clivas);
  handleKeyPress();
  draw();
}


startGame(4);