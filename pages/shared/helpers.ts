import { o, curry, invoker } from 'ramda'

type ToFixed = (percision?: number) => (num?: number) => string
export const toFixed: ToFixed = (per = 4) => (num = 0) =>
  num ? invoker(1, 'toFixed')(per, num) : '0'