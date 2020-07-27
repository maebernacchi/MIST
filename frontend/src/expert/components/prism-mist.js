const mist = {
  'keyword': {
    'pattern': /(^|,|\s|\()(?:abs|avg|cos|mistif|mult|neg|rgb|sign|signz|sin|sine|square|sum|wsum)(?=\(|\s)/,
    'lookbehind': true
  },
  'number': {
    'pattern': /(,|\s|\()-?0?\.?[0-9]+/,
    'lookbehind': true
  },
  'symbol': {
    'pattern': /(\(|,|\s)(?:x|y|t\.(?:s|m|h|d)|m\.(?:x|y))(?=\s|,|\))/,
    'lookbehind': true
  }
};

export default mist;
