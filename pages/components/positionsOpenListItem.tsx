import React, { Component } from 'react'
import { o, map, nth, converge, pair, path, prop, propEq } from 'ramda'
import glamorous, { Div } from 'glamorous'
import moment from 'moment'
import { get, post } from '../services/fetch'

import CandlesChart from './candlesChart'

const Container = glamorous.div(({ positive }) => ({
  maxWidth: '100vw',
  height: '8rem',
  display: 'grid',
  grid: '1fr / 1fr 12rem',
  alignItems: 'center',
  justifyItems: 'start',
  // overflow: 'hidden',
  color: positive ? '#4B6227' : '#804743',
  background: '#fafafa',
  borderTop: `1px solid ${positive ? '#D7EDB6' : '#fff'}`,
  borderBottom: `1px solid ${positive ? '#D7EDB6' : '#fce4ec'}`,
  '@media(max-width: 600px)': {
    height: '7rem',
  }
}))

const HeadTitle = glamorous.div(({ positive }) => ({
  fontSize: '3.14rem',
  wordSpacing: '1rem',
  margin: '0 1rem',
  boxSizing: 'border-box',
  color: positive ? '#c0ca33' : '#f48fb1',
  display: 'flex',
  alignItems: 'center',
  ':hover > button': {
    opacity: 1
  },
  '@media(max-width: 600px)': {
    fontSize: '2rem',
    wordSpacing: '0',
    margin: '0 .5rem 0 .5rem',
    flexFlow: 'row wrap'
  }
}))

const ButtonForceSell = glamorous.button({
  background: '#f44336',
  border: 0,
  borderBottom: '2px solid #c62828',
  color: '#fff',
  margin: '0 1rem',
  opacity: 0,
  transition: 'opacity .2s ease-in-out',
  '@media(max-width: 600px)': {
    margin: 0
  }
})

const ClosedState = glamorous.div({
  height: '8rem',
  background: '#cfd8dc',
  border: '1px solid #90a4ae',
  color: '#455a64',
  fontSize: '1.34rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media(max-width: 600px)': {
    fontSize: '1rem',
  }
})

const SymbolPerc = glamorous.div({
  fontSize: '1.2rem',
  marginLeft: '1rem',
  '@media(max-width: 600px)': {
    fontSize: '.9rem',
    margin: 0
  }
})

const PricesContainer = glamorous.div({
  display: 'flex',
  margin: '0 1rem',
  lineHeight: '1.8rem',
  '@media(max-width: 600px)': {
    fontSize: '.9rem',
    lineHeight: '1.5rem'
  }
})

type Props = { position: { id: string, symbol: string, open: { price: number, time: number } } }
export default class extends Component<Props> {
  state = {
    closed: false,
    candles: []
  }

  static getPriceWProfit (price) {
    return price + (price * 0.006)
  }

  updateCandles = async () => {
    const candles = await get(`/api/candles/${this.props.position.symbol}/30m/48`)
    this.setState({ candles })
  }

  onForceSell = async () => {
    const confirmation = confirm(`Are you sure you want to sell ${this.props.position.symbol}?`)
    if (confirmation) {
    const resp = await post(`/api/positions/forceSell`, { id: this.props.position.id })
    if (propEq('status', true, resp)) this.setState({ closed: true })
    else alert('Something went wrong')
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.ticker !== nextProps.ticker ||
      this.state.closed !== nextState.closed ||
      this.state.candles.length !== nextState.candles.length // TODO: fix it
    )
  }

  componentDidMount () {
    this.updateCandles()
    this.updateInterval = setInterval(this.updateCandles, 1000 * 120)
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval)
  }

  render() {
    const { position, ticker } = this.props
    const { getPriceWProfit } = this.constructor

    const openPrice = path([ 'open', 'price' ], position)
    const candles = map(o(parseFloat, nth(4)), this.state.candles)
    const chadlesChartData = candles.map((v, i) => [ i, v, getPriceWProfit(openPrice) ])
    const changePerc = ticker / openPrice * 100 - 100

    return this.state.closed ? <ClosedState>{ prop('symbol', position) } sold</ ClosedState> : (
      <Container positive={ ticker > openPrice } >
        <Div gridArea='1 / 1 / 1 / 1' width='100%'>
          <CandlesChart
            width='100%'
            height='8rem'
            data={ chadlesChartData }
            type={ ticker > openPrice ? 'positive' : 'default' } />
        </Div>
        <Div gridArea='1 / 1 / 1 / 1' zIndex='999'>
          <HeadTitle positive={ ticker > openPrice }>
            { prop('symbol', position) }
            { changePerc ? <SymbolPerc>{ changePerc.toFixed(2) }%</SymbolPerc> : <div/> }
            <ButtonForceSell onClick={ this.onForceSell }>Force sell</ButtonForceSell>
          </HeadTitle>
        </Div>
        <Div gridArea='1 / 2 / 1 / 2'>
          <PricesContainer>
            <Div fontSize='1.14em' color={ticker > openPrice ? '#9e9d24' : '#d84315' }>
              <div>{ ticker || '~' }</div>
              <div>{ getPriceWProfit(openPrice).toFixed(8) }</div>
              <div>{ openPrice }</div>
              <Div fontSize='.75em'>{ moment(path([ 'open', 'time' ], position)).format('HH:mm, D MMM') }</Div>
            </Div>
            <Div fontSize='.8em' color={ticker > openPrice ? '#c0ca33' : '#ef6c00' } marginLeft='.5rem'>
              <div>curent</div>
              <div>expect</div>
              <div>bought</div>
              <div>from</div>
            </Div>
          </PricesContainer>
        </Div>
      </Container>
    )
  }
}