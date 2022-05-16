const Digits = [
    [
      'xxx',
      'x x',
      'x x',
      'x x',
      'xxx'
    ], [
      '  x',
      '  x',
      '  x',
      '  x',
      '  x'
    ], [
      'xxx',
      '  x',
      'xxx',
      'x  ',
      'xxx'
    ], [
      'xxx',
      '  x',
      'xxx',
      '  x',
      'xxx'
    ], [
      'x x',
      'x x',
      'xxx',
      '  x',
      '  x'
    ], [
      'xxx',
      'x  ',
      'xxx',
      '  x',
      'xxx'
    ], [
      'xxx',
      'x  ',
      'xxx',
      'x x',
      'xxx'
    ], [
      'xxx',
      '  x',
      '  x',
      '  x',
      '  x'
    ], [
      'xxx',
      'x x',
      'xxx',
      'x x',
      'xxx'
    ], [
      'xxx',
      'x x',
      'xxx',
      '  x',
      '  x'
    ]
]

const getDigitsDrawing = (number) => {
  const color = (Math.log2(number) % 7 )| 0;
  return (number.toString()).split('').map(function(d) {
    var num = Digits[d];
    return num;
  }).reduce(function(result, value) {
    value.forEach(function(line, i) {
      result[i] = (result[i] ? result[i] + ' ' : '');
      result[i] += ' '+line.replace(/x/g, '{2+color-'+color+'}').replace(/ /g, '  ');
    });
    return result;
  }, []);
}

module.exports = {
  getDigitsDrawing
}