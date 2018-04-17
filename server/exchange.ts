import Binance from 'binance-api-node'

export default ([ apiKey, apiSecret ]: [ string, string ]) =>
  Binance({ apiKey, apiSecret })
