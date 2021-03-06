import React, { Component } from 'react'
import glamorous, { Div, Small, Strong } from 'glamorous'
import { apply, filter, propEq, prop, map, compose, sum, o, length, reject, isNil, path, converge, multiply, divide, invoker } from 'ramda';
import Icon from 'react-icons-kit'
import { bitcoin } from 'react-icons-kit/fa/bitcoin'

import { toFixed } from '../shared/helpers'
import { Container } from '../layouts/index';

const filterClosed = filter(propEq('closed', true))
const filterOpened = filter(propEq('closed', false))
const getBalance = compose(sum, reject(isNil), map(prop('profitAmount')))
const sumOfAmounts = o(sum, map(converge(multiply, [ path([ 'open', 'price' ]), path([ 'open', 'origQty' ]) ])))
const profitPerc = o(multiply(100), apply(divide))
const getChunkAmount = converge(divide, [ sumOfAmounts, length ])
const toFixed4 = toFixed(4)
const toFixed8 = toFixed(8)

const Container = glamorous.div({
  height: '100%',
  display: 'flex',
  flexFlow: 'column wrap',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '1rem',
  boxSizing: 'border-box',
  '@media(max-width: 600px)': {
    height: 'auto',
  }
})

const BalanceHeader = glamorous.div({
  color:'#ec407a',
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  lineHeight: '4rem',
  '@media(max-width: 600px)': {
    marginTop: '1rem'
  }
})

const RowsContainer = glamorous.div({
  fontSize: 'calc(12px + (20 - 12) * ((100vw - 300px) / (1600 - 300)))',
  color: '#455a64',
  marginTop: '1rem',
  lineHeight: '3rem',
  textAlign:'center',
  '@media(max-width: 600px)': {
    lineHeight: '1.34rem',
    marginTop: 0
  }
})

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
      <Container>
        <BalanceHeader>
          <Small fontSize='.9rem' marginRight='.5rem'>+ balance </Small>
          <Strong fontSize='calc(0.025 * 100vw + 1rem)'>
            { balance.toFixed(8) }
            <Strong color='#880e4f' marginTop='.075em' position='absolute'>
              <Icon icon={ bitcoin } size='1em' />
            </Strong>
          </Strong>
        </BalanceHeader>
        <RowsContainer>
          <div>{ toFixed4(profitOfVolume) }% <small>of trade volume</small> { toFixed8(amountOfVolume) }<Icon icon={ bitcoin } /></div>
          <div>{ toFixed4(profitOfCapital) }% <small>of balance capital</small> { toFixed8(amountOfCapital) }<Icon icon={ bitcoin } /></div>
          <div>{ openedNowLen } / { chunksNumber } <small>chunks of amount </small> { toFixed8(chunkAmount) }<Icon icon={ bitcoin } /></div>
        </RowsContainer>
      </Container>
    )
  }
}