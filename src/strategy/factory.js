const Crossover = require('./crossover')
const Volume = require('./volume')
const SimpleCCI = require('./cci')
const MACD = require('./macd')

exports.create = function (type, data) {
  switch (type) {
    case 'macd':
      return new MACD(data)
    case 'volume':
      return new Volume(data)
    case 'crossover':
      return new Crossover(data)
    default:
      return new SimpleCCI(data)
  }
}
