import { pair, invoker, compose, converge, nth, match } from 'ramda'

type ToFixed = (percision?: number) => (num?: number) => string
export const toFixed: ToFixed = (per = 4) => (num = 0) =>
  num ? invoker(1, 'toFixed')(per, num) : '0'

type TakePairFromSymbol = (a: string) => [ string, string ]
export const takePairFromSymbol: TakePairFromSymbol = compose(converge(pair, [ nth(1), nth(2) ]), match(/(.+)(...)/))
