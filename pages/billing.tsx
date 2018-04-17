import React, { Component } from 'react'
import Router from 'next/router'
import { o, compose, sum, map, prop, filter, propEq, multiply, subtract } from 'ramda'
import { Div, H1, H2 } from 'glamorous'

import requireAuth from './utils/requireAuth'
import { get, post } from './services/fetch'
import { toFixed } from './shared/helpers'

import { Container, MenuContainer, Main } from './layouts'
import Menu from './components/menu'
import PayForm from './components/payForm'
import PaymentsList from './components/paymentsList'
import EventMessage from './components/eventMessage'

const fee = 0.1
const toFixed8 = toFixed(8)
const getPositionsProfit = compose(sum, map(prop('profitAmount')), filter(propEq('closed', true)))
const getPaidsAmount = o(sum, map(prop('amount')))

export default class extends Component<Props> {
  state = {
    showMessage: false,
    status: false,
    error: null
  }

  static async getInitialProps ({ req, res }: any) {
    await requireAuth(res, '/signin')
    const [ profile, paids, positions ] = await Promise.all([
      get('/api/profile', req),
      get('/api/paids', req),
      get('/api/positions', req)
    ])
    return { profile, paids, positions }
  }

  onSubmit = (data: {}) =>
    post('/api/checkPaid', data)
      .then(res => {
        this.setState({ showMessage: true, status: res.status, error: res.error })
        if (res.status === true) Router.reload('/billing')
        setTimeout(() => this.setState({ showMessage: false }), 5000)
      })

  render () {
    const { showMessage, status, error } = this.state
    const { profile, paids, positions } = this.props
    const profitAmount = getPositionsProfit(positions)
    const paidsAmount = getPaidsAmount(paids)
    const feeAmount = multiply(profitAmount, fee)
    const onBalance = subtract(paidsAmount, feeAmount)

    return (
      <Container>
        <MenuContainer>
          <Menu />
        </MenuContainer>
        <Main>
          <Div padding='1rem'>
            <Div display='flex' flexFlow='row wrap' justifyContent='space-between'>
              <Div>
                <H1 color='#ec407a'><small>On balance:</small> { toFixed8(onBalance) } BTC</H1>
                <H2 color='#455a64'><small>Spent for fees:</small> { toFixed8(feeAmount) } BTC</H2>
              </Div>
              <Div>
              { showMessage && <EventMessage message={ error ? error : 'Success! Thank you!' } /> }
                <PayForm
                  payAddress='155eXd5EY7WtiR4VsCbyGuk86eRTX5w6yj'
                  onSubmit={ this.onSubmit } />
              </Div>
            </Div>
            <Div marginTop='3rem'>
              <PaymentsList rows={ paids } />
            </Div>
          </Div>
        </Main>
      </Container>
    )
  }
}
