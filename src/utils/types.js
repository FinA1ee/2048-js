const exponential = 11;
const numberObj = {};
for (let i = 0; i <= exponential; i++) {
  if (i === 0) numberObj['0'] = 0;
  else numberObj[i.toString()] = Math.pow(2, i);
}
const BoardNumber = Object.freeze(numberObj)

// {
//   '0': 0,
//   '1': 2,
//   '2': 4,
//   '3': 8,
//   '4': 16,
//   '5': 32,
//   '6': 64,
//   '7': 128,
//   '8': 256,
//   '9': 512,
//   '10': 1024,
//   '11': 2048
// }

// const BlockColor = Object.freeze({
//   '0': 1,
//   '2': 2,
//   '4': 3,
//   '8': 4,
//   '16': 5,
//   '32': 6,
//   '64': 7,
//   '128': 1,
//   '256': 2,
//   '512': 3,
//   '1024': 4,
//   '2048': 5
// })

const Direction = Object.freeze({
  UP: 'up',
  LEFT: 'left',
  DOWN: 'down',
  RIGHT: 'right'
})

const GameStatus = Object.freeze({
  PREPARE: 0,
  PLAY: 1,
  END: 2
})


module.exports = {
  Direction, BoardNumber, GameStatus
}