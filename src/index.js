#!/usr/bin/env node
const clivas = require('clivas');
const keypress = require('keypress');
const { Direction, BoardNumber, GameStatus } = require('./utils/types');
const Board = require('./components/Board');

const startGame = (level) => {
  
  const restart = () => board.restart();
  const handleMove = (direction) => {
    board.move(direction);
    // if (board.gameStatus === GameStatus.WON) return process.exit(0);
  }

  const draw = () => {
    clivas.flush(false);
    clivas.cursor(false);
    'white blue green yellow magenta red cyan'.split(' ').forEach(function(color, i) {
      clivas.alias('color-'+i, '2+inverse+'+color);
    });
    board.draw();
  }

  const handleKeyPress = () => {
    keypress(process.stdin);

    process.stdin.on("keypress", (ch, key) => {
      if (key.name === 'c' && key.ctrl) return process.exit(0);
      if (key.name === 'w' || key.name === 'up') handleMove(Direction.UP);
      if (key.name === 'a' || key.name === 'left') handleMove(Direction.LEFT);
      if (key.name === 's' || key.name === 'down') handleMove(Direction.DOWN);
      if (key.name === 'd' || key.name === 'right') handleMove(Direction.RIGHT);
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