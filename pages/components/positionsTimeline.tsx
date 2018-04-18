import React, { Component } from 'react'
import { Chart } from 'react-google-charts'

type Position = {
  symbol: string,
  profitPerc: number,
  open: {
    price: number,
    time: string
  },
  close?: {
    price: number,
    time: string
  }
}

type Props = {
  positions: Position[]
}

export default class extends Component<Props> {
  getRows(arr) {
    return arr.map(({ symbol, profitPerc, open, close }: Position) => [
      symbol, `${profitPerc ? profitPerc.toFixed(2) + '% |' : ''} ${open.price} -> ${close ? close.price : '|'}`, new Date(open.time), close ? new Date(close.time) : new Date()
    ])
  }

  render() {
    const data = this.getRows(this.props.positions)

    return <Chart
      chartType='Timeline'
      graph_id='Timeline'
      columns={ [
        { id: 'symbol', type: 'string' },
        { id: 'info', type: 'string' },
        { id: 'opened', type: 'date' },
        { id: 'closed', type: 'date' }
      ] }
      rows={ data }
      width="99%"
      height="100vh"
      chartPackage={ [ 'timeline' ] }
    />
  }
}