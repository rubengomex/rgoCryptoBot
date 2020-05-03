const Strategy = require('./strategy')
const tulind = require('tulind')

class SimpleMACD extends Strategy {
  async run({ ticks, time }) {
    const prices = ticks.map((tick) => tick.average())
    const price = ticks[ticks.length - 1].close

    const boundary = 0.025
    // const shortPeriod = 10
    // const longPeriod = 21
    const shortPeriod = parseInt(this.period * 0.5)
    const longPeriod = this.period
    const signalPeriod = longPeriod - shortPeriod
    const indicator = tulind.indicators.macd.indicator

    const results = await indicator([prices], [shortPeriod, longPeriod, signalPeriod])
    const [macd, signal, histogram] = results
    const length = histogram.length
    if (length < 2) return
    const penultimate = histogram[length - 2]
    const last = histogram[length - 1]

    const wasAbove = penultimate > boundary
    const wasBelow = penultimate < -boundary
    const isAbove = last > boundary
    const isBelow = last < -boundary

    const openTrades = this.openPositions()
    const tp = 1.04
    if (openTrades.length < this.maxActiveTrades) {
      if (wasAbove && isBelow) {
        this.onBuySignal({ price, time })
      }
    } else {
      openTrades.forEach((p) => {
        if (isAbove && wasBelow) {
          if (p.enter.price * tp < price) {
            this.onSellSignal({ price, time, size: p.enter.size, position: p })
          }
        }
      })
    }
  }
}

module.exports = exports = SimpleMACD
