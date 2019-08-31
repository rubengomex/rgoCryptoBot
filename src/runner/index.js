const Historical = require('../historical')
const { Factory } = require('../strategy')
const colors = require('colors/safe')

class Runner {
  constructor({ start, end, interval, product, strategyType, funds }) {
    this.startTime = start
    this.endTime = end
    this.interval = interval
    this.product = product
    this.funds = funds
    this.historical = new Historical({
      start,
      end,
      interval,
      product
    })
    this.strategyType = strategyType
    this.strategy = Factory.create(this.strategyType, {
      onBuySignal: x => {
        this.onBuySignal(x)
      },
      onSellSignal: x => {
        this.onSellSignal(x)
      }
    })
  }

  printPositions() {
    const positions = this.strategy.getPositions()
    positions.forEach(p => p.print())
  }

  printProfit() {
    const positions = this.strategy.getPositions()
    const total = positions.reduce((r, p) => r + p.profit(), 0)

    const prof = `${total}`
    const colored = total > 0 ? colors.green(prof) : colors.red(prof)
    console.log(`Total: ${colored}`)
  }
}

module.exports = exports = Runner
