import React, { Component } from 'react'
import { Form, Field } from 'simple-react-form'
import glamorous, { Div, Button } from 'glamorous'
import { Container, MenuContainer, Main } from './layouts'
import { get, put } from './services/fetch'
import requireAuth from './utils/requireAuth'

import InputText from './components/inputText'
import RangeInput from './components/rangeInput'
import PercInput from './components/percInput'
import Menu from './components/menu'
import ToggleBtn from './components/toggleBtn'
import MainButton from './components/mainBtn'
import FlashMessage from './components/flashMessage'

const Row = glamorous.div({
  display: 'flex',
  flexFlow: 'column wrap',
  lineHeight: '1.6rem',
  padding: '1rem'
})

const Header = glamorous.h2({
  marginBottom: '1rem',
  fontSize: '2.2rem',
  fontWeight: 'normal'
})

const EnableContainer = glamorous.div({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  background: '#ffebee'
})

const EnableHeader = glamorous(Header)({
  fontSize: '1.6rem',
  margin: '1.5rem 1rem',
  color: '#b71c1c'
})

interface Props {
  profile: {
    enabled: boolean,
    preferences: {
      chunksNumber: number,
      minProfit: number
    }
  }
}

export default class extends Component<Props> {
  state = {
    saveStatus: null,
    showMessage: false
  }

  static async getInitialProps ({ req, res }: any) {
    await requireAuth(res, '/signin')
    const profile = await get('/api/profile', req)
    return { profile }
  }

  onSubmit = (data: {}) =>
    put('/api/settings', data)
      .then(res => {
        this.setState({ showMessage: true, saveStatus: res.status })
        setTimeout(() => this.setState({ showMessage: false }), 1000)
      })

  render () {
    const { profile } = this.props

    return (
      <Container>
        <MenuContainer>
          <Menu />
        </MenuContainer>
        <Main>
          <Form onSubmit={this.onSubmit}>
            <Div display='flex' flexFlow='column nowrap'>
              <EnableContainer>
                <EnableHeader>Bot enabled</EnableHeader>
                <Field
                  type={ ToggleBtn }
                  fieldName='enabled'
                  value={ profile.enabled } />
              </EnableContainer>

              <Row>
                <Header>Exchange keys</Header>
                <small>
                  Take them from <a href='https://www.binance.com/userCenter/createApi.html' target='_blank'>Binance profile</a><br />
                  This keys will be encrypted by AES-256
                </small>
              </Row>
              <Field
                type={ InputText }
                fieldName='binance.key'
                label='Key'
                placeholder='****************************************************************' />
              <Field
                type={ InputText }
                fieldName='binance.secret'
                label='Secret'
                placeholder='****************************************************************' />

              <Row>
                <Header>Trading preferences</Header>
              </Row>
              <Field
                type={ RangeInput }
                fieldName='preferences.chunksNumber'
                label='Chunks number'
                value={ profile.preferences.chunksNumber } />
              <Field
                type={ PercInput }
                fieldName='preferences.minProfit'
                label='Minimal profit threshold'
                value={ profile.preferences.minProfit || 0.006 } />

              <Row>
                <MainButton type='submit'>Save</MainButton>
              </Row>
              
              { this.state.showMessage &&
                <FlashMessage
                  type={ this.state.saveStatus ? 'success' : 'error' }
                  message={ this.state.saveStatus ? 'Preferences saved' : 'Something went wrong' } />
              }
            </Div>
          </Form>
        </Main>
      </Container>
    )
  }
}
