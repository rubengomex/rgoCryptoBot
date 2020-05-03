const randomstring = require('randomstring')
const Runner = require('../runner')

class Backtester extends Runner {
  async start() {
    try {
      const history = await this.historical.getData()

      await Promise.all(
        history.map((tick, index) => {
          const ticks = history.slice(0, index + 1)
          return this.strategy.run({ ticks, time: tick.startTime })
        })
      )

      this.printPositions()
      this.printProfit()
    } catch (error) {
      console.log(error)
    }
  }

  async onBuySignal({ price, time }) {
    const id = randomstring.generate(20)
    this.strategy.positionOpened({ price, time, size: this.funds / price, id })
  }

  async onSellSignal({ price, size, time, position }) {
    this.strategy.positionClosed({ price, time, size, id: position.id })
  }
}

module.exports = exports = Backtester
