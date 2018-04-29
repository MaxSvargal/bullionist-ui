import React, { Component } from 'react'
import glamorous, { Div } from 'glamorous'
import { o, filter, propEq, both, pathSatisfies, converge, always, path, length } from 'ramda'
import moment from 'moment'

import BalanceStats from './balanceStats'
import ProfitLine from './profitLine'
import ProfitWaterfall from './profitWaterfall'
import Toggler from './toggler'
import PeriodSelector from './periodSelector'

const getOpenedLength = o(length, filter(propEq('closed', false)))
const timeInPeriod = period => time => time && !moment().isAfter(moment(time).add(period))
const openTimeInPeriod = converge(pathSatisfies, [ timeInPeriod, always([ 'open', 'time' ]) ])
const filterCandlesByPeriod = period => filter(openTimeInPeriod(period))

const Container = glamorous.div({
  width: '100vw',
  height: '100%',
  overflowX: 'scroll',
  overflowY: 'hidden'
})

const Scroller = glamorous.div({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  height: 'inherit',
  '@media(max-width: 600px)': {
    width: '200vw'
  }
})

const StatsContainer = glamorous.div({
  flex: '1.5 1',
  minWidth: '360',
  maxWidth: '50vw',
  height: 'inherit',
  '@media(max-width: 600px)': {
    width: '100vw'
  }
})

const GraphContainer = glamorous.div({
  flex: '1 1',
  minWidth: '300',
  maxWidth: '50vw',
  height: 'inherit',
  '@media(max-width: 600px)': {
    width: '100vw',
    height: '200px',
    position: 'relative'
  }
})

export default class extends Component {
  state = {
    positions: this.props.positions
  }

  onSelectPeriod = period =>
    this.setState({ positions: filterCandlesByPeriod(period)(this.props.positions) })

  render() {
    const { profile } = this.props
    const { positions } = this.state
    const openedNowLen = getOpenedLength(this.props.positions)

    return (
      <Container>
        <Scroller>
          <StatsContainer>
            <PeriodSelector onSelect={ this.onSelectPeriod } />
            <BalanceStats
              positions={ positions }
              chunksNumber={ path([ 'preferences', 'chunksNumber' ], profile) }
              openedNowLen={ openedNowLen } />
          </StatsContainer>
          <GraphContainer>
            <Toggler>
              <ProfitWaterfall positions={ positions } />
              <ProfitLine positions={ positions } />
            </Toggler>
          </GraphContainer>
        </Scroller>
      </Container>
    )
  }
}