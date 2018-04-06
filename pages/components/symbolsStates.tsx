import React, { Component } from 'react'
import glamorous, { Div } from 'glamorous'
import {
  propEq, cond, T, always, equals, sortBy, props, o, join, reverse, compose,
  converge, pair, nth, match, concat, allPass
} from 'ramda'

const symbolBaseURI = 'https://www.binance.com/tradeDetail.html?symbol='
const takePairFromSymbol = compose(converge(pair, [ nth(1), nth(2) ]), match(/(.+)(...)/))
const makeExchangeSymbolURI = compose(concat(symbolBaseURI), join('_'), takePairFromSymbol)

const readyToBuy = allPass([ propEq('4h', true), propEq('1h', true), propEq('15m', true) ])
const startdGrow = allPass([ propEq('4h', true), propEq('1h', true), propEq('15m', false) ])

const getSymbolStateType = cond([
  [ readyToBuy, always('enabled') ],
  [ startdGrow, always('prepared') ],
  [ T, always('growing') ]
])

const getSymbolStateTitle = cond([
  [ readyToBuy, always('is ready to buy') ],
  [ startdGrow, always('is grow now') ],
  [ T, always('is grow globally') ]
])

const SymbolBlock = glamorous.a(({ type }) => ({
  background: cond([
    [ equals('enabled'), always('#7e57c2') ],
    [ equals('prepared'), always('#7986cb') ],
    [ equals('growing'), always('#78909c') ]
  ])(type),
  textDecoration: 'none',
  padding: '.5rem .25rem',
  color: '#eeeeee',
  textAlign: 'center',
  fontSize: '.8rem',
  flexGrow: 1
}))

const ListContainer = glamorous.div({
  display: 'flex',
  flexFlow: 'row wrap',
  maxHeight: '70vh',
  overflowY: 'auto'
})

export default class extends Component {
  render () {
    const { data } = this.props
    const sorted = o(reverse, sortBy(props([ '15m', '1h' ])), data)

    return <Div alignSelf='flex-end' >
      <ListContainer>
        { sorted.map(v => (
          <SymbolBlock
            key={v.symbol}
            type={getSymbolStateType(v)}
            href={makeExchangeSymbolURI(v.symbol)}
            title={`${v.symbol} ${getSymbolStateTitle(v)}`}
            target='_blank'
            >{ v.symbol }
          </SymbolBlock>
        )) }
      </ListContainer>
    </Div>
  }
}