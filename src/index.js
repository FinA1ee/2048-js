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
    // clivas.flush(false);
    clivas.cursor(false);
    'white blue yellow green magenta red cyan'.split(' ').forEach(function(color, i) {
      clivas.alias('color-'+i, '2+inverse+'+color);
    });
  
    // clivas.line('');
    // clivas.line('{full-width + box-color}');
    
    // const getDigitDrawing = (number) => {
    //   const color = 1+(((number / 1000)|0)%5);
    //   return (number.toString()).split('').map(function(d) {
    //     var num = Digits[d];
    //     return num;
    //   }).reduce(function(result, value) {
    //     value.forEach(function(line, i) {
    //       result[i] = (result[i] ? result[i] + ' ' : '');
    //       result[i] += ' '+line.replace(/x/g, '{2+color-'+color+'}').replace(/ /g, '  ');
    //     });
    //     return result;
    //   }, []);
    // };

    // for (let i = 0; i < 10; i++) {
    //   var padding = '';
    //   const scoreDraw = getDigitDrawing(9);
    //   if (i > 3 && scoreDraw[i-4]) {
    //     padding = '     ' + scoreDraw[i-4];
    //   }
    //   // clivas.line(' {2+box-color}'+'{2+box-color}'+padding+padding);
    //   clivas.line(padding+padding+padding+padding);
    // }
    // for (let x = 0; x < 4; x++) {
    //   for (let i = 0; i < 10; i++) {
    //     var padding1 = '';
    //     var padding2 = '';
    //     var padding3 = '';
    //     var padding4 = '';
    //     const scoreDraw1 = getDigitDrawing(2048);
    //     const scoreDraw2 = getDigitDrawing(1024);
    //     const scoreDraw3 = getDigitDrawing(1024);
    //     const scoreDraw4 = getDigitDrawing(1024);
    //     // const scoreDraw = getDigitDrawing(9);
    //     if (i > 3 && scoreDraw1[i-4]) {
    //       padding1 = '    ' + scoreDraw1[i-4];
    //     }

    //     if (i > 3 && scoreDraw2[i-4]) {
    //       padding2 = '    ' + scoreDraw2[i-4];
    //     }

    //     if (i > 3 && scoreDraw3[i-4]) {
    //       padding3 = '    ' + scoreDraw3[i-4];
    //     }

    //     if (i > 3 && scoreDraw4[i-4]) {
    //       padding4 = '    ' + scoreDraw4[i-4];
    //     }
    //     // clivas.line(' {2+box-color}'+'{2+box-color}'+padding+padding);

    //     // draw 4 digits
    //     clivas.line(padding1 + padding2 + padding3 + padding4);

    //     // draw 4 digits

    //   }
    // }

    board.draw();
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