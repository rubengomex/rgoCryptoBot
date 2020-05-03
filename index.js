require('dotenv').config()

const program = require('commander')
const Backtester = require('./src/backtester')
const Trader = require('./src/trader')

const now = new Date()
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1e3)

function toDate(val) {
  return new Date(val * 1e3)
}

program
  .version('1.0.0')
  .option('-i, --interval [interval]', 'Interval in seconds for candlestick', parseInt)
  .option('-c, --coin [product]', 'Product [BTC-EUR, LTC-EUR, ETH-EUR]', 'BTC-EUR')
  .option('-p, --period [Period]', 'Period for strategies', 20)
  .option('-s, --start [start]', 'Start time in unix seconds', toDate, yesterday)
  .option('-e, --end [end]', 'End time in unix seconds', toDate, now)
  .option('-t, --strategy [strategy]', 'The strategy for trading [cci, crossover]', 'cci')
  .option('-r, --type [type]', 'Run type [backtester, trader]', 'backtester')
  .option('-f, --funds [funds]', 'Amount of money to use', parseFloat)
  .option('-l, --live', 'Run live')
  .parse(process.argv)

const main = async function () {
  const { interval, coin, start, end, strategy, live, type, funds, period } = program

  if (type == 'trader') {
    const trader = new Trader({
      start,
      end,
      product: coin,
      interval,
      strategyType: strategy,
      live,
      funds,
      period
    })

    await trader.start()
  } else {
    const tester = new Backtester({
      start,
      end,
      product: coin,
      interval,
      strategyType: strategy,
      funds,
      period
    })

    await tester.start()
  }
}

main()
