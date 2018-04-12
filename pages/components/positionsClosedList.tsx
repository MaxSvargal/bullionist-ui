import React, { Component } from 'react'
import glamorous, { Div } from 'glamorous'
import moment from 'moment'
import { filter, prop, propEq, o, sortBy, path, reverse, converge, add, lt } from 'ramda'
import { toFixed } from '../shared/helpers'

const toFixed8 = toFixed(8)
const comissionsSumm = converge(add, [ path([ 'open', 'comission' ]), path([ 'close', 'comission' ]) ])
const filterClosed = o(o(reverse, sortBy(path([ 'close', 'time' ]))), filter(propEq('closed', true)))

type Props = { positions: {}[] }
export default class extends Component<Props> {
  render() {
    const { positions } = this.props
    const closed = filterClosed(positions)

    const Item = glamorous.div(({ isPositive }) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
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
        maxHeight: '4rem'
      }
    }))
    const Symbol = glamorous.div({
      fontSize: '3em',
      color: '#fff',
      flex: '0 0 15rem',
      '@media(max-width: 600px)': {
        fontSize: '2em',
        flex: '0 0 6rem'
      }
    })
    const Profit = glamorous.div({
      fontSize: '1.2em',
      flex: '0 0 13rem',
      '@media(max-width: 600px)': {
        flex: '0 0 8rem'
      }
    })
    const Prices = glamorous.div({
      flex: '0 0 16rem',
      '@media(max-width: 600px)': {
        flex: '0 0 10.5rem'
      }
    })
    const Label = glamorous.div({
      fontSize: '.8em',
      marginBottom: '0.15em'
    })
    const Bigger = glamorous.span({
      fontSize: '1.2em'
    })
    const HideWhenSmall = glamorous.div({
      '@media(max-width: 600px)': {
        display: 'none'
      }
    })

    return (
      <Div display='flex' flexFlow='column nowrap'>
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
              <Div>{ path([ 'open', 'origQty' ], v) } { prop('symbol', v) }</Div>
              <Div>{ o(toFixed8, comissionsSumm, v) } { path([ 'close', 'commissionAsset' ], v) }</Div>
            </HideWhenSmall>
          </Item>
        )) }
      </Div>
    )
  }
}
