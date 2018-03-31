import React, { Component } from 'react'
import glamorous, { Div } from 'glamorous'
import moment from 'moment'
import { filter, propEq, o, sortBy, path, reverse } from 'ramda'

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
          <Item key={v.id} isPositive={v.profitPerc > 0}>
            <Symbol>{ v.symbol }</Symbol>
            <Profit>
              <Label>Profit</Label>
              <Div>{ v.profitPerc.toFixed(8) } %</Div>
              <Div>{ v.profitAmount.toFixed(8) } BTC</Div>
            </Profit>
            <Prices>
              <Label>Open / Close</Label>
              <Div><Bigger>{ v.open.price.toFixed(8) }</Bigger> { moment(path([ 'open', 'time' ], v)).format('HH:mm, D MMM') }</Div>
              <Div><Bigger>{ v.close.price.toFixed(8) }</Bigger> { moment(path([ 'close', 'time' ], v)).format('HH:mm, D MMM') }</Div>
            </Prices>
            <HideWhenSmall>
              <Label>Amount / Comission</Label>
              <Div>{ v.open.origQty } { v.symbol }</Div>
              <Div>{ (v.open.commission + v.close.commission).toFixed(8) } { v.close.commissionAsset }</Div>
            </HideWhenSmall>
          </Item>
        )) }
      </Div>
    )
  }
}
