import React, { Component } from 'react'
import glamorous, { Div } from 'glamorous'
import moment from 'moment'
import { filter, prop, propEq, o, sortBy, path, reverse, converge, add, lt, multiply, head, last } from 'ramda'
import { toFixed, takePairFromSymbol } from '../shared/helpers'

const toFixed4 = toFixed(4)
const toFixed8 = toFixed(8)
const symbolPair = o(takePairFromSymbol, prop('symbol'))
const chunkAmount = converge(multiply, [ path([ 'open', 'origQty' ]), path([ 'open', 'price' ]) ])
const comissionsSumm = converge(add, [ path([ 'open', 'commission' ]), path([ 'close', 'commission' ]) ])
const filterClosed = o(o(reverse, sortBy(path([ 'close', 'time' ]))), filter(propEq('closed', true)))

type Props = { positions: {}[] }
export default class extends Component<Props> {
  render() {
    const { positions } = this.props
    const closed = filterClosed(positions)

    const Container = glamorous.div({
      display: 'grid'
    })

    const Item = glamorous.div(({ isPositive }) => ({
      boxSizing: 'border-box',
      display: 'grid',
      gridColumn: '1 / -1',
      gridTemplateColumns: '1.25fr 1.25fr 1.5fr 1fr',
      alignItems: 'center',
      lineHeight: '1.8rem',
      padding: '.5rem 1rem',
      color: '#546e7a',
      background: `linear-gradient(to left, ${
        isPositive ? '#f9fbe7 75%, #80deea 100%' : '#ffebee 75%, #ce93d8 100%'
      })`,
      '@media(max-width: 600px)': {
        fontSize: '.65rem',
        lineHeight: '1.25rem',
        padding: '.25rem .5rem',
        maxHeight: '8rem',
        gridTemplateColumns: '1fr 1.2fr 2fr'
      }
    }))
    const Symbol = glamorous.div({
      fontSize: '3em',
      color: '#fff',
      '@media(max-width: 600px)': {
        fontSize: '2em'
      }
    })
    const Profit = glamorous.div({
      fontSize: '1.2em'
    })
    const Prices = glamorous.div({
      padding: '0 .5rem'
    })
    const Label = glamorous.div({
      fontSize: '.8em',
      marginBottom: '0.15em'
    })
    const Bigger = glamorous.span({
      fontSize: '1.2em',
      padding: '0 .5rem'
    })
    const HideWhenSmall = glamorous.div({
      '@media(max-width: 600px)': {
        display: 'none'
      }
    })

    return (
      <Container>
        { closed.map(v => (
          <Item key={ prop('id', v) } isPositive={ o(lt(0), prop('profitPerc'), v) }>
            <Symbol>{ prop('symbol', v) }</Symbol>
            <Profit>
              <Label>Profit</Label>
              <Div>{ o(toFixed8, prop('profitPerc'), v) } %</Div>
              <Div>{ o(toFixed8, prop('profitAmount'), v) } BTC</Div>
            </Profit>
            <Prices>
              <Label>Open / Close</Label>
              <Div>
                <Bigger>{ o(toFixed8, path([ 'open', 'price' ]), v) }</Bigger>
                { moment(path([ 'open', 'time' ], v)).format('HH:mm, D MMM') }
              </Div>
              <Div>
                <Bigger>{ o(toFixed8, path([ 'close', 'price' ]), v) }</Bigger>
                { moment(path([ 'close', 'time' ], v)).format('HH:mm, D MMM') }
              </Div>
            </Prices>
            <HideWhenSmall>
              <Label>Amount / Comission</Label>
              <Div>{ path([ 'open', 'origQty' ], v) } { o(head, symbolPair, v) } | { o(toFixed4, chunkAmount, v) } { o(last, symbolPair, v) }</Div>
              <Div>{ o(toFixed8, comissionsSumm, v) } { path([ 'close', 'commissionAsset' ], v) }</Div>
            </HideWhenSmall>
          </Item>
        )) }
      </Container>
    )
  }
}
