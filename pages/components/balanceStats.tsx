import React, { Component } from 'react'
import { Div, Small, Strong } from 'glamorous'
import { apply, filter, propEq, prop, map, compose, sum, o, length, reject, isNil, path, converge, multiply, divide } from 'ramda'

const filterClosed = filter(propEq('closed', true))
const filterOpened = filter(propEq('closed', false))
const getBalance = compose(sum, reject(isNil), map(prop('profitAmount')))
const sumOfAmounts = o(sum, map(converge(multiply, [ path([ 'open', 'price' ]), path([ 'open', 'origQty' ]) ])))
const profitPerc = o(multiply(100), apply(divide))
const getChunkAmount = converge(divide, [ sumOfAmounts, length ])

export default class extends Component {
  componentDidMount() {
    document.title = `+${parseInt(getBalance(this.props.positions) * 1e8)} satoshi`
  }

  render () {
    const { positions, chunksNumber, openedNowLen } = this.props
    const balance = getBalance(positions)
    const chunkAmount = o(getChunkAmount, filterOpened, positions)
    const amountOfVolume = o(sumOfAmounts, filterClosed, positions)
    const profitOfVolume = profitPerc([ balance, amountOfVolume ])
    const amountOfCapital = multiply(chunkAmount, chunksNumber)
    const profitOfCapital = multiply(100, divide(balance, amountOfCapital))

    return (
      <Div height='100%' display='flex' flexFlow='column wrap' alignItems='center' justifyContent='center' paddingTop='1rem' boxSizing='border-box'>
        <Div color='#ec407a' display='flex' flexFlow='row nowrap' alignItems='center' lineHeight='4rem'>
          <Small fontSize='.9rem' marginRight='.5rem'>+ balance</Small>
          <Strong fontSize='calc(0.025 * 100vw + 1rem)'> { balance.toFixed(8) }<Strong fontSize='1.1em' color='#880e4f'>₿</Strong></Strong>
        </Div>
        <Div fontSize='calc(12px + (20 - 12) * ((100vw - 300px) / (1600 - 300)))' color='#455a64' marginTop='1rem' lineHeight='3rem' textAlign='center'>
          <div>{ profitOfVolume.toFixed(4) }% <small>of trade volume</small> { amountOfVolume.toFixed(8) }<strong>₿</strong></div>
          <div>{ profitOfCapital.toFixed(4) }% <small>of balance capital</small> { amountOfCapital.toFixed(8) }<strong>₿</strong></div>
          <div>{ openedNowLen } / { chunksNumber } <small>chunks of amount </small> { chunkAmount.toFixed(8) }<strong>₿</strong></div>
        </Div>
      </Div>
    )
  }
}